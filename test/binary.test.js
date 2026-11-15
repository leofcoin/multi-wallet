import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import base58check from '@vandeurenglenn/base58check';
import { encodeFrames } from '@leofcoin/binary';
import multiWif from '@leofcoin/multi-wif';
import { mnemonicToSeed, validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import HdNode from '../exports/hd-node.js';
import MultiWallet, {
  DEFAULT_SECURE_PASSWORD_LENGTH,
  generateSecurePassword,
  MIN_PASSWORD_LENGTH,
} from '../exports/index.js';
import config from './config.js';

test('existing wallet IDs import as watch-only wallets without changing their bytes', async () => {
  for (const [network, fixture] of Object.entries(config)) {
    const original = new MultiWallet(network);
    await original.load(fixture.bs58, network);
    assert.equal(await original.id, fixture.id);
    const imported = new MultiWallet(network);
    await imported.fromId(fixture.id);
    assert.deepEqual(imported.publicKey, original.publicKey);
    assert.equal(imported.privateKey, undefined);
    assert.equal(await imported.id, fixture.id);
    await assert.rejects(imported.hdnode.derive(0), /Missing chain code/);
  }
});

test('wallet IDs reject non-canonical padded length prefixes', async () => {
  const fixture = config.leofcoin;
  const { data } = await base58check.decode(fixture.id);
  assert.deepEqual(Array.from(data.slice(0, 3)), [1, 48, 33]);
  const padded = new Uint8Array([129, 0, 48, 161, 0, ...data.slice(3)]);
  const wallet = new MultiWallet('leofcoin');
  await wallet.load(fixture.bs58, 'leofcoin');
  const originalPublicKey = wallet.publicKey.slice();
  await assert.rejects(
    wallet.fromId(await base58check.encode(padded)),
    /Non-canonical varint/,
  );
  assert.deepEqual(wallet.publicKey, originalPublicKey);
});

test('invalid ID fields reject without modifying an existing wallet', async () => {
  const wallet = new MultiWallet('leofcoin');
  await wallet.load(config.leofcoin.bs58, 'leofcoin');
  const publicKey = wallet.publicKey.slice();
  const version = new TextEncoder().encode('0');
  const invalidKey = new Uint8Array(33);
  const payloads = [
    new Uint8Array(),
    new Uint8Array([128]),
    new Uint8Array(100).fill(255),
    encodeFrames([version]),
    encodeFrames([version, publicKey, new Uint8Array()]),
    encodeFrames([new TextEncoder().encode('1'), publicKey]),
    encodeFrames([new TextEncoder().encode('00'), publicKey]),
    encodeFrames([version, publicKey.slice(1)]),
    encodeFrames([version, invalidKey]),
    new Uint8Array([1, 48, 33, ...publicKey.slice(0, -1)])
  ];
  for (const payload of payloads) {
    await assert.rejects(wallet.fromId(await base58check.encode(payload)));
    assert.deepEqual(wallet.publicKey, publicKey);
  }
});

test('ID imports retain signature verification with the original public key', async () => {
  const original = new MultiWallet('leofcoin');
  await original.load(config.leofcoin.bs58, 'leofcoin');
  const imported = new MultiWallet('leofcoin');
  await imported.fromId(await original.id);
  const hash = new Uint8Array(32).fill(17);
  const signature = await original.sign(hash);
  assert.equal(await imported.verify(signature, hash), true);
  assert.equal(await imported.verify(signature, new Uint8Array(32).fill(18)), false);
});

test('locking clears in-memory private-key material and restores it only after unlock', async () => {
  const wallet = new MultiWallet('leofcoin');
  await wallet.load(config.leofcoin.bs58, 'leofcoin');
  const originalNode = wallet.hdnode;
  const privateKey = originalNode.privateKey;
  const expectedPrivateKey = privateKey.slice();

  await assert.rejects(wallet.lock('short'), /at least 12/);
  await wallet.lock('correct horse battery staple');

  assert.ok(privateKey.every((byte) => byte === 0));
  assert.equal(originalNode.privateKey, undefined);
  assert.equal(wallet.hdnode.privateKey, undefined);
  assert.equal(wallet.privateKey, undefined);
  assert.equal(wallet.locked, true);

  const saved = new MultiWallet('leofcoin');
  await saved.load(await wallet.save(), 'leofcoin');
  assert.equal(saved.privateKey, undefined);

  await assert.rejects(wallet.unlock('incorrect but sufficiently long'));
  assert.equal(wallet.locked, true);
  assert.equal(wallet.hdnode.privateKey, undefined);
  assert.equal(wallet.privateKey, undefined);
  await assert.rejects(wallet.fromMultiWif(config.leofcoin.multiWIF), /locked/);
  assert.throws(() => {
    wallet.hdnode = originalNode;
  }, /locked/);

  await wallet.unlock('correct horse battery staple');
  assert.deepEqual(wallet.privateKey, expectedPrivateKey);
  assert.equal(wallet.locked, false);
});

test('neutered wallets and accounts do not retain the original private node', async () => {
  const wallet = new MultiWallet('leofcoin');
  await wallet.load(config.leofcoin.bs58, 'leofcoin');

  for (const neutered of [wallet.neutered, wallet.account(0).neutered]) {
    assert.notEqual(neutered.wallet, wallet);
    assert.notEqual(neutered.hdnode, wallet.hdnode);
    assert.equal(neutered.privateKey, undefined);
    assert.equal(neutered.hdnode.privateKey, undefined);
    assert.throws(() => neutered.sign(new Uint8Array(32)), /Missing private key/);
  }
});

test('watch-only child derivation matches private child derivation', async () => {
  const wallet = new MultiWallet('leofcoin');
  await wallet.load(config.leofcoin.bs58, 'leofcoin');
  const privateChild = await wallet.hdnode.derive(7);
  const publicChild = await wallet.hdnode.neutered.derive(7);

  assert.deepEqual(publicChild.publicKey, privateChild.publicKey);
});

test('raw keys do not receive synthetic BIP32 chain codes', async () => {
  const privateKey = new Uint8Array(32);
  privateKey[31] = 1;
  const wallet = new MultiWallet('bitcoin');
  await wallet.fromPrivateKey(privateKey);

  assert.equal(wallet.hdnode.chainCode, undefined);
  await assert.rejects(wallet.hdnode.derive(0), /Missing chain code/);

  const rawMultiWif = await wallet.toMultiWif();
  const importedPrivateKey = new MultiWallet('bitcoin');
  await importedPrivateKey.fromMultiWif(rawMultiWif);
  assert.equal(importedPrivateKey.hdnode.chainCode, undefined);
  assert.equal(await importedPrivateKey.toMultiWif(), rawMultiWif);
  await assert.rejects(importedPrivateKey.hdnode.derive(0), /Missing chain code/);

  const watchOnly = new MultiWallet('bitcoin');
  await watchOnly.fromPublicKey(wallet.publicKey, undefined, 'bitcoin');
  assert.equal(watchOnly.hdnode.chainCode, undefined);
  await assert.rejects(watchOnly.hdnode.derive(0), /Missing chain code/);
});

test('saved wallet imports reject malformed private keys without changing state', async () => {
  const wallet = new MultiWallet('leofcoin');
  await wallet.load(config.leofcoin.bs58, 'leofcoin');
  const originalPrivateKey = wallet.privateKey.slice();
  const malformed = encodeFrames([
    new TextEncoder().encode(wallet.network.bip32.private.toString()),
    new TextEncoder().encode('0'),
    new TextEncoder().encode('0'),
    new TextEncoder().encode('0'),
    new Uint8Array(32),
    new TextEncoder().encode('0'),
    new Uint8Array(32),
  ]);

  await assert.rejects(
    wallet.load(await base58check.encode(malformed), 'leofcoin'),
    /Invalid private key/,
  );
  assert.deepEqual(wallet.privateKey, originalPrivateKey);
});

test('generated mnemonics use 256-bit BIP39 entropy and validate', async () => {
  const wallet = new MultiWallet('leofcoin');
  await assert.rejects(wallet.generate(), /at least 12/);
  await assert.rejects(wallet.generate(''), /at least 12/);
  await assert.rejects(wallet.generate('short'), /at least 12/);
  await assert.rejects(wallet.generate('A1b2-C3d4_E'), /at least 12/);
  const passphrase = 'A1b2-C3d4_E5';
  const mnemonic = await wallet.generate(passphrase);
  const generatedPrivateKey = wallet.privateKey.slice();
  await wallet.recover(mnemonic, passphrase);

  assert.equal(mnemonic.split(' ').length, 24);
  assert.equal(validateMnemonic(mnemonic, wordlist), true);
  assert.deepEqual(wallet.privateKey, generatedPrivateKey);
});

test('mnemonic recovery matches the official BIP39 seed vector', async () => {
  const mnemonic =
    'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
  const seed = await mnemonicToSeed(mnemonic, 'TREZOR');
  assert.equal(
    Buffer.from(seed).toString('hex'),
    'c55257c360c07c72029aebc1b53c05ed0362ada38ead3e3e9efa3708e53495531f09a6987599d18264c1e1c92f2cf141630c7a3c4ab7c81b2f001698e7463b04',
  );

  const wallet = new MultiWallet('bitcoin');
  const walletPassphrase = 'TREZOR passphrase';
  await assert.rejects(wallet.recover(mnemonic), /at least 12/);
  await assert.rejects(wallet.recover(mnemonic, ''), /at least 12/);
  await assert.rejects(wallet.recover(mnemonic, 'TREZOR'), /at least 12/);
  await wallet.recover(mnemonic, walletPassphrase);
  const walletSeed = await mnemonicToSeed(mnemonic, walletPassphrase);
  const expected = await new HdNode().fromSeed(
    walletSeed,
    wallet.network,
  );
  assert.deepEqual(wallet.privateKey, expected.privateKey);
  assert.deepEqual(wallet.hdnode.chainCode, expected.chainCode);

  const originalPrivateKey = wallet.privateKey.slice();
  await assert.rejects(
    wallet.recover(
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon',
      walletPassphrase,
    ),
    /Invalid BIP39 mnemonic/,
  );
  assert.deepEqual(wallet.privateKey, originalPrivateKey);
});

test('seed derivation follows the BIP32 master key and chain-code vector', async () => {
  const seed = Uint8Array.from(
    '000102030405060708090a0b0c0d0e0f'.match(/.{2}/g),
    (byte) => Number.parseInt(byte, 16),
  );
  const node = await new HdNode().fromSeed(
    seed,
    new MultiWallet('bitcoin').network,
  );

  assert.equal(
    Buffer.from(node.privateKey).toString('hex'),
    'e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35',
  );
  assert.equal(
    Buffer.from(node.chainCode).toString('hex'),
    '873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508',
  );

  const hardened = await node.derive(0x80000000);
  assert.equal(
    Buffer.from(hardened.privateKey).toString('hex'),
    'edb2e14f9ee77d26dd93b4ecede8d16ed408ce149b6cd80b0715a2d911a0afea',
  );
  assert.equal(
    Buffer.from(hardened.chainCode).toString('hex'),
    '47fdacbd0f1097043b78c63c20c34ef4ed9a111d980047ad16282c7ae6236141',
  );

  const normal = await hardened.derive(1);
  assert.equal(
    Buffer.from(normal.privateKey).toString('hex'),
    '3c6cb8d0f6a264c91ea8b5030fadaa8e538b020f0a387421a12de9319dc93368',
  );
  assert.equal(
    Buffer.from(normal.chainCode).toString('hex'),
    '2a7857631386ba23dacac34180dd1983734e444fdbf774041578e9b6adb37c19',
  );
  const neuteredChild = await hardened.neutered.derive(1);
  assert.deepEqual(neuteredChild.publicKey, normal.publicKey);
});

test('BIP32 chain codes survive MultiWIF and encrypted wallet exports', async () => {
  const wallet = new MultiWallet('leofcoin');
  await wallet.recover(
    'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    'test BIP39 passphrase',
    'leofcoin',
  );
  const chainCode = wallet.hdnode.chainCode;
  const multiWifValue = await wallet.toMultiWif();
  const decodedMultiWif = await multiWif.decode(multiWifValue);
  assert.deepEqual(decodedMultiWif.privateKey, wallet.privateKey);

  const restoredFromSave = new MultiWallet('leofcoin');
  await restoredFromSave.load(await wallet.save(), 'leofcoin');
  assert.deepEqual(restoredFromSave.hdnode.chainCode, chainCode);

  const restoredFromMultiWif = new MultiWallet('leofcoin');
  await restoredFromMultiWif.fromMultiWif(multiWifValue);
  assert.deepEqual(restoredFromMultiWif.hdnode.chainCode, chainCode);
  assert.deepEqual(
    (await restoredFromMultiWif.hdnode.derive(3)).publicKey,
    (await wallet.hdnode.derive(3)).publicKey,
  );

  await assert.rejects(wallet.export('short'), /at least 12/);
  const encrypted = await wallet.export('test wallet password');
  const restoredFromEncrypted = new MultiWallet('leofcoin');
  await assert.rejects(
    restoredFromEncrypted.import('short', encrypted),
    /at least 12/,
  );
  await restoredFromEncrypted.import('test wallet password', encrypted);
  assert.deepEqual(restoredFromEncrypted.hdnode.chainCode, chainCode);
});

test('secure password generator returns passwords that meet the wallet minimum', () => {
  const password = generateSecurePassword();
  assert.equal(Array.from(password).length, DEFAULT_SECURE_PASSWORD_LENGTH);
  assert.match(password, /^[A-Za-z0-9_-]+$/);
  assert.equal(Array.from(generateSecurePassword(16)).length, 16);
  assert.throws(
    () => generateSecurePassword(MIN_PASSWORD_LENGTH - 1),
    /between 12 and 1024/,
  );
  assert.throws(() => generateSecurePassword(12.5), /between 12 and 1024/);
});

test('MultiWIF import rejects unknown network codecs without changing the wallet', async () => {
  const wallet = new MultiWallet('leofcoin');
  await wallet.load(config.leofcoin.bs58, 'leofcoin');
  const originalPrivateKey = wallet.privateKey.slice();
  const invalidMultiWif = await multiWif.encode(
    1,
    999,
    originalPrivateKey,
  );

  await assert.rejects(wallet.fromMultiWif(invalidMultiWif), /invalid codec/);
  assert.deepEqual(wallet.privateKey, originalPrivateKey);
  assert.equal(wallet.network.multiCodec, 0x3c4);
});

test('Ethereum address derivation matches the standard private-key-one vector', async () => {
  const privateKey = new Uint8Array(32);
  privateKey[31] = 1;
  const wallet = new MultiWallet('ethereum');
  await wallet.fromPrivateKey(privateKey);

  assert.equal(
    await wallet.ethereumAddress(),
    '0x7e5f4552091a69125d5dfcb7b8c2659029395bdf',
  );
});

test('test network selection does not mutate the configured main network', () => {
  const testnet = new MultiWallet('ethereum:kovan');
  const mainnet = new MultiWallet('ethereum');

  assert.equal(testnet.network.coin_type, 1);
  assert.equal(mainnet.network.coin_type, 60);
});

test('dependency graph and generated entry points do not import varint', async () => {
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  const lock = JSON.parse(await readFile(new URL('../package-lock.json', import.meta.url), 'utf8'));
  assert.equal(
    manifest.dependencies['@leofcoin/binary'],
    lock.packages[''].dependencies['@leofcoin/binary'],
  );
  for (const [name, value] of Object.entries(lock.packages)) {
    assert.ok(!name.endsWith('/varint'), name);
    assert.ok(!/^(git\+|git:|github:|file:)/.test(value.resolved ?? ''), name);
  }
  for (const entry of ['index', 'multi-node', 'hd-account', 'pq-wallet']) {
    const source = await readFile(new URL(`../exports/${entry}.js`, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /from ["']varint["']|import ["']varint["']/);
  }
});

test('packed archive includes built public runtime and declarations', () => {
  const [packed] = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: fileURLToPath(new URL('..', import.meta.url)), encoding: 'utf8'
  }));
  const files = new Set(packed.files.map(({ path }) => path));
  for (const entry of ['exports/index.js', 'exports/index.d.ts', 'exports/multi-node.js', 'exports/pq-wallet.js'])
    assert.ok(files.has(entry), entry);
});
