import { ml_dsa87 } from "@noble/post-quantum/ml-dsa.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256, sha512 } from "@noble/hashes/sha2.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { scryptAsync } from "@noble/hashes/scrypt.js";
import base58check from "@vandeurenglenn/base58check";
import {
  generateMnemonic,
  mnemonicToSeed,
  validateMnemonic,
} from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";

export const PQ_NETWORK = "leofcoin:pq";
export const PQ_SCHEME = "ML-DSA-87:v1";
export const PQ_ADDRESS_PREFIX = "lfc-pq1:";
export const PQ_PUBLIC_KEY_BYTES = 2592;
export const PQ_SIGNATURE_BYTES = 4627;

const BACKUP_FORMAT = "leofcoin:pq-wallet";
const BACKUP_VERSION = 1;
const BACKUP_MAGIC = new TextEncoder().encode("LFPQ");
const BACKUP_ENVELOPE_VERSION = 2;
const BACKUP_SALT_LENGTH = 16;
const BACKUP_IV_LENGTH = 12;
const BACKUP_HEADER_LENGTH = BACKUP_MAGIC.length + 1;
const BACKUP_CIPHERTEXT_MIN_LENGTH = 16;
const KDF_SALT = "leofcoin:ML-DSA-87:v1";
const utf8 = new TextEncoder();
const backupKdfOptions = {
  N: 2 ** 15,
  r: 8,
  p: 1,
  dkLen: 32,
  maxmem: 64 * 1024 * 1024,
};

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.length);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

async function importAesKey(
  keyBytes: Uint8Array,
  usage: KeyUsage[],
): Promise<CryptoKey> {
  const rawKey = toArrayBuffer(keyBytes);
  try {
    return await globalThis.crypto.subtle.importKey(
      "raw",
      rawKey,
      { name: "AES-GCM" },
      false,
      usage,
    );
  } finally {
    new Uint8Array(rawKey).fill(0);
  }
}

type WalletBackup = {
  format: typeof BACKUP_FORMAT;
  version: typeof BACKUP_VERSION;
  network: typeof PQ_NETWORK;
  accountIndex: number;
  seed: Uint8Array;
};

function assertAccountIndex(value: number): void {
  if (!Number.isSafeInteger(value) || value < 0 || value > 0xffffffff)
    throw new RangeError("Account index must be uint32");
}

function assertBackupPassword(password: unknown): asserts password is string {
  if (typeof password !== "string" || password.length === 0)
    throw new TypeError("Backup password must be a non-empty string");
}

function assertBip39Passphrase(passphrase: unknown): asserts passphrase is string {
  if (typeof passphrase !== "string" || passphrase.length === 0)
    throw new TypeError("A non-empty BIP39 passphrase is required for PQ wallets");
}

function publicKeyAddress(publicKey: Uint8Array): string {
  if (publicKey.length !== PQ_PUBLIC_KEY_BYTES)
    throw new TypeError("Invalid ML-DSA-87 public key length");
  return PQ_ADDRESS_PREFIX + bytesToHex(publicKey);
}

function chainContext(chainId: string): Uint8Array {
  if (typeof chainId !== "string" || !/^lfc:[0-9a-f]{64}$/.test(chainId))
    throw new TypeError("Invalid chain ID");
  return utf8.encode(`Leofcoin:${PQ_SCHEME}:${chainId}`);
}

function parseBackup(value: string): WalletBackup {
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch (error) {
    throw new TypeError("Invalid PQ wallet backup", { cause: error });
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    throw new TypeError("Invalid PQ wallet backup");

  const record = parsed as Record<string, unknown>;
  if (
    Object.keys(record).sort().join(",") !==
      "accountIndex,format,network,seed,version" ||
    record.format !== BACKUP_FORMAT ||
    record.version !== BACKUP_VERSION ||
    record.network !== PQ_NETWORK ||
    typeof record.accountIndex !== "number" ||
    !Number.isSafeInteger(record.accountIndex) ||
    record.accountIndex < 0 ||
    record.accountIndex > 0xffffffff ||
    typeof record.seed !== "string" ||
    !/^[0-9a-f]{128}$/.test(record.seed)
  )
    throw new TypeError("Invalid PQ wallet backup");

  return { ...record, seed: hexToBytes(record.seed) } as WalletBackup;
}

async function encryptBackup(password: string, payload: string): Promise<string> {
  const passwordBytes = utf8.encode(password);
  let payloadBytes: Uint8Array | undefined;
  let keyBytes: Uint8Array | undefined;
  try {
    const salt = new Uint8Array(BACKUP_SALT_LENGTH);
    const iv = new Uint8Array(BACKUP_IV_LENGTH);
    globalThis.crypto.getRandomValues(salt);
    globalThis.crypto.getRandomValues(iv);
    const header = new Uint8Array(BACKUP_HEADER_LENGTH);
    header.set(BACKUP_MAGIC);
    header[BACKUP_MAGIC.length] = BACKUP_ENVELOPE_VERSION;
    payloadBytes = utf8.encode(payload);
    keyBytes = await scryptAsync(passwordBytes, salt, backupKdfOptions);
    const key = await importAesKey(keyBytes, ["encrypt"]);
    const plaintext = toArrayBuffer(payloadBytes);
    let encrypted: ArrayBuffer;
    try {
      encrypted = await globalThis.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: toArrayBuffer(iv),
          additionalData: toArrayBuffer(header),
        },
        key,
        plaintext,
      );
    } finally {
      new Uint8Array(plaintext).fill(0);
    }
    const ciphertext = new Uint8Array(
      encrypted,
    );
    const envelope = new Uint8Array(
      header.length + salt.length + iv.length + ciphertext.length,
    );
    envelope.set(header);
    envelope.set(salt, header.length);
    envelope.set(iv, header.length + salt.length);
    envelope.set(ciphertext, header.length + salt.length + iv.length);
    ciphertext.fill(0);
    return base58check.encode(envelope);
  } finally {
    passwordBytes.fill(0);
    payloadBytes?.fill(0);
    keyBytes?.fill(0);
  }
}

async function decryptBackup(password: string, encoded: string): Promise<string> {
  const { data } = await base58check.decode(encoded);
  const minimumLength =
    BACKUP_HEADER_LENGTH +
    BACKUP_SALT_LENGTH +
    BACKUP_IV_LENGTH +
    BACKUP_CIPHERTEXT_MIN_LENGTH;
  if (
    data.length < minimumLength ||
    !BACKUP_MAGIC.every((byte, index) => data[index] === byte) ||
    data[BACKUP_MAGIC.length] !== BACKUP_ENVELOPE_VERSION
  )
    throw new TypeError("Invalid PQ wallet backup envelope");

  const saltStart = BACKUP_HEADER_LENGTH;
  const ivStart = saltStart + BACKUP_SALT_LENGTH;
  const ciphertextStart = ivStart + BACKUP_IV_LENGTH;
  const header = data.slice(0, BACKUP_HEADER_LENGTH);
  const salt = data.slice(saltStart, ivStart);
  const iv = data.slice(ivStart, ciphertextStart);
  const ciphertext = data.slice(ciphertextStart);
  const passwordBytes = utf8.encode(password);
  let keyBytes: Uint8Array | undefined;
  let plaintext: Uint8Array | undefined;
  try {
    keyBytes = await scryptAsync(passwordBytes, salt, backupKdfOptions);
    const key = await importAesKey(keyBytes, ["decrypt"]);
    plaintext = new Uint8Array(
      await globalThis.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: toArrayBuffer(iv),
          additionalData: toArrayBuffer(header),
        },
        key,
        toArrayBuffer(ciphertext),
      ),
    );
    return new TextDecoder("utf-8", { fatal: true }).decode(plaintext);
  } finally {
    passwordBytes.fill(0);
    keyBytes?.fill(0);
    plaintext?.fill(0);
  }
}

/** BIP39-backed ML-DSA-87 wallet for the experimental leofcoin:pq network. */
export default class PqWallet {
  readonly network = PQ_NETWORK;
  readonly scheme = PQ_SCHEME;
  #accountIndex: number;
  #seed: Uint8Array | undefined;
  #publicKey: Uint8Array | undefined;
  #secretKey: Uint8Array | undefined;
  #selectedAccount: string | undefined;
  #id: string | undefined;
  #chainId: string | undefined;
  #encrypted: string | undefined;
  locked = false;

  constructor(accountIndex = 0) {
    assertAccountIndex(accountIndex);
    this.#accountIndex = accountIndex;
  }

  static fromSeed(seed: Uint8Array, accountIndex = 0): PqWallet {
    const wallet = new PqWallet(accountIndex);
    wallet.#installSeed(seed, accountIndex);
    return wallet;
  }

  get accountIndex(): number {
    return this.#accountIndex;
  }

  get selectedAccount(): string {
    if (!this.#selectedAccount) throw new Error("PQ wallet is not initialized");
    return this.#selectedAccount;
  }

  get id(): string {
    if (!this.#id) throw new Error("PQ wallet is not initialized");
    return this.#id;
  }

  get publicKey(): Uint8Array {
    if (!this.#publicKey) throw new Error("PQ wallet is not initialized");
    return this.#publicKey.slice();
  }

  get address(): Promise<string> {
    return Promise.resolve(this.selectedAccount);
  }

  get accounts(): Promise<Array<[string, string, string]>> {
    return Promise.resolve([
      ["PQ account", this.selectedAccount, this.selectedAccount],
    ]);
  }

  getAccounts(): Promise<Array<[string, string, string]>> {
    return this.accounts;
  }

  async generate(passphrase: string): Promise<string> {
    this.#assertUnlocked();
    assertBip39Passphrase(passphrase);
    const mnemonic = generateMnemonic(wordlist, 256);
    const seed = await mnemonicToSeed(mnemonic, passphrase);
    try {
      this.#installSeed(seed, this.#accountIndex);
    } finally {
      seed.fill(0);
    }
    return mnemonic;
  }

  async recover(mnemonic: string, passphrase: string): Promise<void> {
    this.#assertUnlocked();
    assertBip39Passphrase(passphrase);
    if (!validateMnemonic(mnemonic, wordlist))
      throw new TypeError("Invalid BIP39 mnemonic");
    const seed = await mnemonicToSeed(mnemonic, passphrase);
    try {
      this.#installSeed(seed, this.#accountIndex);
    } finally {
      seed.fill(0);
    }
  }

  bindChainId(chainId: string): void {
    chainContext(chainId);
    if (this.#chainId && this.#chainId !== chainId)
      throw new Error("PQ wallet is already bound to another chain");
    this.#chainId = chainId;
  }

  async selectAccount(address: string): Promise<void> {
    if (address !== this.selectedAccount)
      throw new Error("Unknown PQ account; recover its explicit account index");
  }

  async load(password?: string, fresh = false): Promise<void> {
    if (fresh)
      throw new Error("PQ wallets must be explicitly generated or recovered");
    if (this.locked) {
      if (password === undefined || !this.#encrypted)
        throw new Error("PQ wallet is locked");
      await this.unlock(password);
    }
    this.#assertLive();
  }

  async sign(digest: Uint8Array): Promise<Uint8Array> {
    this.#assertLive();
    if (!(digest instanceof Uint8Array) || digest.length !== 32)
      throw new TypeError("PQ signing requires a 32-byte digest");
    if (!this.#chainId) throw new Error("PQ wallet requires a validated chain binding");
    const secretKey = this.#secretKey;
    if (!secretKey) throw new Error("PQ wallet has no live private key");
    return ml_dsa87.sign(digest, secretKey, {
      context: chainContext(this.#chainId),
    });
  }

  async export(password: string): Promise<string> {
    assertBackupPassword(password);
    this.#assertLive();
    if (!this.#seed) throw new Error("PQ wallet seed is unavailable");
    const payload = JSON.stringify({
      format: BACKUP_FORMAT,
      version: BACKUP_VERSION,
      network: this.network,
      accountIndex: this.#accountIndex,
      seed: bytesToHex(this.#seed),
    });
    return encryptBackup(password, payload);
  }

  async import(password: string, encrypted: string): Promise<void> {
    assertBackupPassword(password);
    this.#assertUnlocked();
    await this.#restore(password, encrypted);
  }

  async lock(password: string): Promise<void> {
    assertBackupPassword(password);
    if (this.locked) return;
    const encrypted = await this.export(password);
    this.#encrypted = encrypted;
    this.#clearPrivateMaterial();
    this.locked = true;
  }

  async unlock(password: string): Promise<void> {
    assertBackupPassword(password);
    if (!this.locked || !this.#encrypted)
      throw new Error("PQ wallet is not locked");
    await this.#restore(password, this.#encrypted);
    this.locked = false;
  }

  destroy(): void {
    this.#clearPrivateMaterial();
    this.#publicKey = undefined;
    this.#selectedAccount = undefined;
    this.#id = undefined;
    this.#chainId = undefined;
    this.#encrypted = undefined;
    this.locked = true;
  }

  #installSeed(seed: Uint8Array, accountIndex: number): void {
    if (!(seed instanceof Uint8Array) || seed.length !== 64)
      throw new TypeError("A 64-byte BIP39 seed is required");
    assertAccountIndex(accountIndex);

    const salt = utf8.encode(KDF_SALT);
    const info = utf8.encode(`${this.network}\0${accountIndex}`);
    const derived = hkdf(sha512, seed, salt, info, 32);
    const seedCopy = seed.slice();
    let generatedSecret: Uint8Array | undefined;
    try {
      const { publicKey, secretKey } = ml_dsa87.keygen(derived);
      generatedSecret = secretKey;
      const selectedAccount = publicKeyAddress(publicKey);
      const id = `lfc-pq-id-v1-${bytesToHex(sha256(publicKey))}`;
      this.#clearPrivateMaterial();
      this.#seed = seedCopy;
      this.#publicKey = publicKey;
      this.#secretKey = secretKey;
      this.#selectedAccount = selectedAccount;
      this.#id = id;
      this.#accountIndex = accountIndex;
      generatedSecret = undefined;
    } catch (error) {
      seedCopy.fill(0);
      generatedSecret?.fill(0);
      throw error;
    } finally {
      derived.fill(0);
    }
  }

  async #restore(password: string, encrypted: string): Promise<void> {
    const payload = await decryptBackup(password, encrypted);
    const backup = parseBackup(payload);
    try {
      this.#installSeed(backup.seed, backup.accountIndex);
      this.#encrypted = encrypted;
    } finally {
      backup.seed.fill(0);
    }
  }

  #clearPrivateMaterial(): void {
    this.#seed?.fill(0);
    this.#secretKey?.fill(0);
    this.#seed = undefined;
    this.#secretKey = undefined;
  }

  #assertLive(): void {
    if (this.locked || !this.#seed || !this.#secretKey)
      throw new Error("PQ wallet has no live private key");
  }

  #assertUnlocked(): void {
    if (this.locked) throw new Error("Wallet is locked");
  }
}
