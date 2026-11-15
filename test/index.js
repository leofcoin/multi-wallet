import MultiWallet from "../exports/index.js";
import config from "./config.js";
import assert from "node:assert/strict";
import test from "node:test";
import base58 from "@vandeurenglenn/base58";
const { encode, decode } = base58;

const originalConsoleLog = console.log;
console.log = (...args) => {
  if (typeof args[0] === "string" && args[0].startsWith("[decode]")) return;
  originalConsoleLog(...args);
};

test("basic wallet functionality", async () => {
  const wallet = new MultiWallet("leofcoin");
  const generated = await wallet.generate();
  assert.ok(generated, "generate wallet");
});

test("basic wallet functionality", async () => {
  const wallet = new MultiWallet("leofcoin:olivia");
  const generated = await wallet.generate();
  assert.ok(generated, "generate wallet");
});

for (const key of Object.keys(config)) {
  const { mnemonic, bs58, multiWIF, hash, signature, address, encrypted, id } =
    config[key];

  test(key, async () => {
    let hdnode = new MultiWallet(key);
    await hdnode.recover(mnemonic, "", key);

    let account = await hdnode.account(0);
    assert.equal(await hdnode.save(), bs58, "recover using mnemonic");

    hdnode = new MultiWallet(key);
    await hdnode.load(bs58, key);
    assert.equal(await hdnode.toMultiWif(), multiWIF, "export to MultiWIF");

    hdnode = new MultiWallet(key);
    await hdnode.fromMultiWif(multiWIF);
    assert.equal(await hdnode.toMultiWif(), multiWIF, "import from multiWif");

    hdnode = new MultiWallet(key);
    await hdnode.load(bs58, key);
    assert.equal(await hdnode.save(), bs58, "load from saved");

    hdnode = new MultiWallet(key);
    await hdnode.recover(mnemonic);
    let external = await hdnode.account(0).external(0);
    assert.equal(await external.address, address, "has correct address");

    hdnode = new MultiWallet(key);
    await hdnode.load(bs58, key);
    const alice = await hdnode.account(0).external(0);
    const signed = await alice.sign(hash);
    assert.ok(signed?.length > 0, "alice can sign");

    hdnode = new MultiWallet(key);
    await hdnode.load(bs58, key);
    external = await hdnode.account(0).external(0);
    assert.equal(
      await external.neutered.verify(signed, hash, alice.publicKey.slice(1)),
      true,
      "bob can verify",
    );

    hdnode = new MultiWallet(key);
    await hdnode.fromPublicKey(alice.publicKey, null, key);
    assert.equal(
      await hdnode.verify(signed, hash),
      true,
      "bob can verify alice's signature using Alice's publicKey",
    );

    hdnode = new MultiWallet(key);
    await hdnode.fromMultiWif(multiWIF);
    assert.deepEqual(await hdnode.multiWIF, multiWIF, "can load from multiWIF");

    external = await hdnode.account(0).external(0);
    assert.equal(
      await external.address,
      address,
      "has correct address loading from WIF",
    );
    account = await hdnode.account(0);
    assert.notEqual(
      (await account.internal(0)).publicKey,
      (await account.external(0)).publicKey,
      "create internal/external chains",
    );

    hdnode = new MultiWallet(key);
    await hdnode.fromMultiWif(multiWIF);
    const exported = await hdnode.export("");
    hdnode = new MultiWallet(key);
    await hdnode.import("", exported);
    assert.deepEqual(await hdnode.multiWIF, multiWIF, "export");

    hdnode = new MultiWallet(key);
    await hdnode.import("", encrypted);
    assert.equal(await hdnode.multiWIF, multiWIF, "import");

    hdnode = new MultiWallet(key);
    await hdnode.fromMultiWif(multiWIF);
    await hdnode.lock("");
    assert.ok(!hdnode.privateKey, "lock");

    await hdnode.unlock("");
    assert.equal(await hdnode.multiWIF, multiWIF, "unlock");

    assert.equal(await hdnode.id, id, "id");
  });
}
