import assert from "node:assert/strict";
import test from "node:test";
import { randomBytes } from "node:crypto";
import { ml_dsa87 } from "@noble/post-quantum/ml-dsa.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256, sha512 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { mnemonicToSeed, validateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { PqWallet, PQ_NETWORK, PQ_SCHEME } from "../exports/index.js";

const utf8 = new TextEncoder();
const chainId = `lfc:${"12".repeat(32)}`;
const otherChainId = `lfc:${"34".repeat(32)}`;

test("PQ wallet derives the same account keys and identifiers as the chain scheme", () => {
  const seed = randomBytes(64);
  const original = seed.slice();
  const accountIndex = 7;
  const wallet = PqWallet.fromSeed(seed, accountIndex);
  const derived = hkdf(
    sha512,
    seed,
    utf8.encode(`leofcoin:${PQ_SCHEME}`),
    utf8.encode(`${PQ_NETWORK}\0${accountIndex}`),
    32,
  );
  const expected = ml_dsa87.keygen(derived);

  try {
    assert.deepEqual(seed, original);
    assert.equal(wallet.accountIndex, accountIndex);
    assert.equal(
      wallet.selectedAccount,
      `lfc-pq1:${bytesToHex(expected.publicKey)}`,
    );
    assert.equal(
      wallet.id,
      `lfc-pq-id-v1-${bytesToHex(sha256(expected.publicKey))}`,
    );
    assert.throws(() => new PqWallet(-1), /uint32/);
    assert.throws(() => PqWallet.fromSeed(seed.subarray(1)), /64-byte/);
  } finally {
    wallet.destroy();
    expected.secretKey.fill(0);
    derived.fill(0);
    seed.fill(0);
    original.fill(0);
  }
});

test("PQ wallet uses 24-word BIP39 recovery and chain-bound ML-DSA signatures", async () => {
  const wallet = new PqWallet(3);
  await assert.rejects(wallet.generate(), /passphrase is required/);
  await assert.rejects(wallet.generate(""), /passphrase is required/);
  const bip39Passphrase = "bip39-passphrase";
  const mnemonic = await wallet.generate(bip39Passphrase);
  assert.equal(mnemonic.split(" ").length, 24);
  assert.equal(validateMnemonic(mnemonic, wordlist), true);

  const seed = await mnemonicToSeed(mnemonic, "bip39-passphrase");
  const recovered = new PqWallet(3);
  try {
    await assert.rejects(
      recovered.recover(mnemonic, ""),
      /passphrase is required/,
    );
    await recovered.recover(mnemonic, bip39Passphrase);
    assert.equal(recovered.selectedAccount, wallet.selectedAccount);
    await assert.rejects(
      recovered.recover("abandon ".repeat(11) + "abandon", bip39Passphrase),
      /Invalid BIP39 mnemonic/,
    );
    recovered.bindChainId(chainId);
    const digest = randomBytes(32);
    const signature = await recovered.sign(digest);
    const keySeed = hkdf(
      sha512,
      seed,
      utf8.encode(`leofcoin:${PQ_SCHEME}`),
      utf8.encode(`${PQ_NETWORK}\0${recovered.accountIndex}`),
      32,
    );
    const keyPair = ml_dsa87.keygen(keySeed);
    try {
      assert.equal(
        ml_dsa87.verify(signature, digest, keyPair.publicKey, {
          context: utf8.encode(`Leofcoin:${PQ_SCHEME}:${chainId}`),
        }),
        true,
      );
      assert.equal(
        ml_dsa87.verify(signature, digest, keyPair.publicKey, {
          context: utf8.encode(`Leofcoin:${PQ_SCHEME}:${otherChainId}`),
        }),
        false,
      );
    } finally {
      keyPair.secretKey.fill(0);
      keySeed.fill(0);
      digest.fill(0);
    }
    await assert.rejects(recovered.sign(new Uint8Array(31)), /32-byte/);
    assert.throws(() => recovered.bindChainId(otherChainId), /another chain/);
  } finally {
    seed.fill(0);
    wallet.destroy();
    recovered.destroy();
  }
});

test("encrypted PQ backups round-trip account indices and locking clears signing access", async () => {
  const wallet = new PqWallet(11);
  const bip39Passphrase = "separate-bip39-passphrase";
  await wallet.generate(bip39Passphrase);
  const account = wallet.selectedAccount;
  await assert.rejects(wallet.export(""), /non-empty/);
  await assert.rejects(wallet.export(undefined), /non-empty/);
  await assert.rejects(wallet.lock(""), /non-empty/);
  assert.equal(wallet.locked, false);
  const backup = await wallet.export("correct horse battery staple");
  const restored = new PqWallet();
  try {
    await restored.import("correct horse battery staple", backup);
    assert.equal(restored.accountIndex, 11);
    assert.equal(restored.selectedAccount, account);
    await assert.rejects(
      restored.import("wrong password", backup),
    );
    await assert.rejects(restored.import("", backup), /non-empty/);
    assert.equal(restored.selectedAccount, account);
    restored.bindChainId(chainId);
    await restored.lock("correct horse battery staple");
    assert.equal(restored.selectedAccount, account);
    await assert.rejects(restored.sign(new Uint8Array(32)), /live private key/);
    await assert.rejects(restored.unlock("wrong password"));
    await restored.load("correct horse battery staple");
    assert.equal(restored.locked, false);
    assert.equal(restored.selectedAccount, account);
    await assert.rejects(restored.generate(), /passphrase is required/);
    assert.equal((await restored.generate(bip39Passphrase)).split(" ").length, 24);
    await assert.rejects(restored.load(undefined, true), /explicitly generated/);
  } finally {
    wallet.destroy();
    restored.destroy();
  }
});


