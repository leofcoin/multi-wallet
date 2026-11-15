import {
  Point,
  etc,
  getPublicKey,
  utils,
} from "@noble/secp256k1";
import typedArraySmartConcat from "@vandeurenglenn/typed-array-smart-concat";
import typedArraySmartDeconcat from "@vandeurenglenn/typed-array-smart-deconcat";
import networks from "./networks.js";
import { createRIPEMD160, createHMAC, createSHA512 } from "hash-wasm";
import { createHash } from "@leofcoin/crypto";
import base58check from "@vandeurenglenn/base58check";
import type { base58String } from "@vandeurenglenn/base58";
import wif from "@leofcoin/wif";
import type { network } from "./index.js";
const HIGHEST_BIT = 0x80000000;

const privateKeyVerify = (privateKey: Uint8Array): boolean =>
  utils.isValidSecretKey(privateKey);

const publicKeyCreate = (
  privateKey: Uint8Array,
  compressed = true,
): Uint8Array => getPublicKey(privateKey, compressed);

const publicKeyVerify = (publicKey: Uint8Array): boolean =>
  utils.isValidPublicKey(publicKey);

const privateKeyTweakAdd = (
  privateKey: Uint8Array,
  tweak: Uint8Array,
): Uint8Array | null => {
  const curveOrder = Point.CURVE().n;
  const key = etc.bytesToNumberBE(privateKey);
  const scalar = etc.bytesToNumberBE(tweak);
  const sum = etc.mod(key + scalar, curveOrder);
  if (sum === 0n) return null;
  const bytes = etc.numberToBytesBE(sum);
  if (bytes.length === 32) return bytes;
  const padded = new Uint8Array(32);
  padded.set(bytes, 32 - bytes.length);
  return padded;
};

export default class HdNode {
  #privateKey!: Uint8Array | undefined;
  #publicKey!: Uint8Array | undefined;
  #chainCode!: Uint8Array | undefined;
  #network!: network;
  #depth!: number;
  #index!: number;
  #parentFingerprint!: number;

  constructor(
    privateKey?: Uint8Array,
    publicKey?: Uint8Array,
    chainCode?: Uint8Array,
    network?: network,
    depth = 0,
    index = 0,
    parentFingerprint = 0x00000000,
  ) {
    this.#initialize(
      privateKey,
      publicKey,
      chainCode,
      network,
      depth,
      index,
      parentFingerprint,
    );
  }

  #initialize(
    privateKey?: Uint8Array,
    publicKey?: Uint8Array,
    chainCode?: Uint8Array,
    network?: network,
    depth = 0,
    index = 0,
    parentFingerprint = 0x00000000,
  ): void {
    this.#privateKey = privateKey;
    this.#publicKey = publicKey;
    this.#chainCode = chainCode;
    this.#network = network || networks.leofcoin;
    this.#depth = depth;
    this.#index = index;
    this.#parentFingerprint = parentFingerprint;
  }

  get network(): network {
    return this.#network;
  }

  get publicKey(): Uint8Array {
    if (!this.#publicKey) {
      if (!this.#privateKey) throw new TypeError("Missing public or private key");
      this.#publicKey = publicKeyCreate(this.#privateKey, true);
    }
    return this.#publicKey;
  }

  get privateKey(): Uint8Array | undefined {
    return this.#privateKey;
  }

  get chainCode(): Uint8Array | undefined {
    return this.#chainCode?.slice();
  }

  get depth(): number {
    return this.#depth;
  }

  get identifier(): Promise<Uint8Array> {
    return this.hash160(this.publicKey);
  }
  get fingerprint(): Promise<Uint8Array> {
    return (async () => (await this.identifier).subarray(0, 4))();
  }

  async hash160(data: Uint8Array): Promise<Uint8Array> {
    const hash = await createHash(data, "SHA-256");
    return (await createRIPEMD160())
      .update(new Uint8Array(hash))
      .digest("binary");
  }

  get isNeutered(): boolean {
    return this.#privateKey === undefined;
  }

  get neutered(): HdNode {
    return new HdNode(
      undefined,
      this.publicKey.slice(),
      this.#chainCode?.slice(),
      this.#network,
      this.#depth,
      this.#index,
      this.#parentFingerprint,
    );
  }

  fromPrivateKey(
    privateKey: Uint8Array,
    chainCode?: Uint8Array,
    network?: network,
  ): HdNode {
    if (!privateKeyVerify(privateKey))
      throw new TypeError("Private key not in range [1, n)");
    if (chainCode && chainCode.length !== 32)
      throw new TypeError("Chain code must be 32 bytes");

    const publicKey = publicKeyCreate(privateKey, true);
    return new HdNode(
      privateKey,
      publicKey,
      chainCode,
      network,
    );
  }

  fromPublicKey(
    publicKey: Uint8Array,
    chainCode: Uint8Array | undefined,
    network: network,
  ): HdNode {
    // verify the X coordinate is a point on the curve
    if (!publicKeyVerify(publicKey))
      throw new TypeError("Point is not on the curve");
    if (chainCode && chainCode.length !== 32)
      throw new TypeError("Chain code must be 32 bytes");

    return new HdNode(undefined, publicKey, chainCode, network);
  }

  async fromSeed(seed: Uint8Array, network: network): Promise<HdNode> {
    if (seed.length < 16)
      throw new TypeError("Seed should be at least 128 bits");
    if (seed.length > 64)
      throw new TypeError("Seed should be at most 512 bits");

    let hash = (
      await createHMAC(createSHA512(), new TextEncoder().encode("Bitcoin seed"))
    )
      .update(seed)
      .digest("binary");

    const privateKey = hash.subarray(0, 32);
    const chainCode = hash.subarray(32);
    return this.fromPrivateKey(privateKey, chainCode, network);
  }

  async toBase58(): Promise<string> {
    const network = this.#network || networks.leofcoin;
    if (!this.#chainCode) throw new TypeError("Missing chain code");
    let version = !this.isNeutered
      ? network.bip32.private
      : network.bip32.public;

    const set = [
      new TextEncoder().encode(version.toString()),
      new TextEncoder().encode(this.#depth.toString()),
      new TextEncoder().encode(this.#parentFingerprint.toString()),
      new TextEncoder().encode(this.#index.toString()),
      this.#chainCode,
    ];
    if (this.#privateKey) {
      set.push(new TextEncoder().encode("0"));
      set.push(new Uint8Array(this.#privateKey));
    } else {
      set.push(new Uint8Array(this.publicKey));
    }
    return base58check.encode(typedArraySmartConcat(set));
  }

  toWIF(): Promise<string> {
    if (!this.#privateKey) throw new TypeError("Missing private key");
    return wif.encode(this.#network.wif, this.#privateKey, true);
  }

  clearPrivateKey(): void {
    this.#privateKey?.fill(0);
    this.#privateKey = undefined;
  }

  // https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#child-key-derivation-ckd-functions
  async derive(index: number): Promise<HdNode> {
    if (!this.#chainCode) throw new TypeError("Missing chain code");
    if (this.#chainCode.length !== 32)
      throw new TypeError("Chain code must be 32 bytes");
    if (!Number.isInteger(index) || index < 0 || index > 0xffffffff)
      throw new RangeError("Child index must be a uint32");
    if (this.#depth >= 255)
      throw new RangeError("Maximum BIP32 depth reached");
    const isHardened = index >= HIGHEST_BIT;
    const data = new Uint8Array(37);
    if (isHardened) {
      const privateKey = this.#privateKey;
      if (!privateKey)
        throw new TypeError("Missing private key for hardened child key");
      data.set(privateKey, 1);
    } else {
      data.set(this.publicKey);
    }
    data[33] = index >>> 24;
    data[34] = (index >>> 16) & 0xff;
    data[35] = (index >>> 8) & 0xff;
    data[36] = index & 0xff;
    const hash = (await createHMAC(createSHA512(), this.#chainCode))
      .update(data)
      .digest("binary");

    const privateKey = hash.subarray(0, 32);
    const chainCode = hash.subarray(32);
    const deriveNext = (): Promise<HdNode> => {
      if (index === 0xffffffff)
        throw new RangeError("No valid child index remains");
      return this.derive(index + 1);
    };
    // if parse256(privateKey) >= n, proceed with the next value for i
    if (!privateKeyVerify(privateKey)) return deriveNext();
    const fingerprint = await this.fingerprint;
    const parentFingerprint = (
      (fingerprint[0] << 24) |
      (fingerprint[1] << 16) |
      (fingerprint[2] << 8) |
      fingerprint[3]
    ) >>> 0;
    // Private parent key -> private child key

    if (!this.isNeutered) {
      const parentPrivateKey = this.#privateKey;
      if (!parentPrivateKey) throw new TypeError("Missing private key");
      // ki = parse256(privateKey) + kpar (mod n)
      const ki = privateKeyTweakAdd(parentPrivateKey, privateKey);
      // In case ki == 0, proceed with the next value for i
      if (ki == null) return deriveNext();
      return new HdNode(
        ki,
        undefined,
        chainCode,
        this.#network,
        this.#depth + 1,
        index,
        parentFingerprint,
      );
    }

    const childPoint = Point.BASE
      .multiply(etc.bytesToNumberBE(privateKey))
      .add(Point.fromBytes(this.publicKey));
    if (childPoint.is0()) return deriveNext();
    return new HdNode(
      undefined,
      childPoint.toBytes(true),
      chainCode,
      this.#network,
      this.#depth + 1,
      index,
      parentFingerprint,
    );
  }

  deriveHardened(index: number): Promise<HdNode> {
    // Only derives hardened private keys by default
    if (!Number.isInteger(index) || index < 0 || index >= HIGHEST_BIT)
      throw new RangeError("Hardened child index must be a uint31");
    return this.derive(index + HIGHEST_BIT);
  }

  async derivePath(path: string): Promise<HdNode> {
    let splitPath = path.split("/");
    if (splitPath[0] === "m") {
      if (this.#depth !== 0)
        throw new TypeError("Expected master, got child");
      splitPath = splitPath.slice(1);
    }

    let prevHd: HdNode = this;

    for (const indexString of splitPath) {
      const hardened = indexString.endsWith("'");
      const indexText = hardened ? indexString.slice(0, -1) : indexString;
      if (!/^\d+$/.test(indexText))
        throw new TypeError("Invalid derivation path");
      const index = Number(indexText);
      prevHd = hardened
        ? await prevHd.deriveHardened(index)
        : await prevHd.derive(index);
    }
    return prevHd;
  }

  async fromBase58(
    string: base58String,
    network: network = networks.leofcoin,
  ): Promise<HdNode> {
    let buffer = (await base58check.decode(string)).data;

    // @ts-ignore
    network = network || networks.leofcoin;

    const result = typedArraySmartDeconcat(buffer);
    if (result.length !== 6 && result.length !== 7)
      throw new TypeError("Invalid extended key");

    const parseNumber = (frame: Uint8Array, max: number): number => {
      const text = new TextDecoder().decode(frame);
      if (!/^(0|[1-9]\d*)$/.test(text))
        throw new TypeError("Invalid extended key metadata");
      const value = Number(text);
      if (!Number.isSafeInteger(value) || value > max)
        throw new TypeError("Invalid extended key metadata");
      return value;
    };

    const version = parseNumber(result[0], 0xffffffff);
    const depth = parseNumber(result[1], 0xff);
    const parentFingerprint = parseNumber(result[2], 0xffffffff);
    const index = parseNumber(result[3], 0xffffffff);

    const chainCode = result[4];

    if (!chainCode || chainCode.length !== 32)
      throw new TypeError("Invalid chain code");
    if (version !== network.bip32.private && version !== network.bip32.public)
      throw new TypeError("Invalid network version");

    if (depth === 0) {
      if (parentFingerprint !== 0)
        throw new TypeError("Invalid parent fingerprint");
    }
    if (depth === 0 && index !== 0) throw new TypeError("Invalid index");

    if (version === network.bip32.private) {
      const privateKey = result[6];
      if (
        result.length !== 7 ||
        result[5].length !== 1 ||
        result[5][0] !== 0x30 ||
        privateKey.length !== 32 ||
        !privateKeyVerify(privateKey)
      )
        throw new TypeError("Invalid private key");
      return new HdNode(
        privateKey,
        undefined,
        chainCode,
        network,
        depth,
        index,
        parentFingerprint,
      );
    }
    const publicKey = result[5];
    if (
      result.length !== 6 ||
      publicKey.length !== 33 ||
      !publicKeyVerify(publicKey)
    )
      throw new TypeError("Invalid public key");
    return new HdNode(
      undefined,
      publicKey,
      chainCode,
      network,
      depth,
      index,
      parentFingerprint,
    );
  }
}
