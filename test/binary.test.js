import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import base58check from '@vandeurenglenn/base58check';
import { encodeFrames } from '@leofcoin/binary';
import MultiWallet from '../exports/index.js';
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
  }
});

test('legacy padded length prefixes retain the same public key and canonical ID', async () => {
  const fixture = config.leofcoin;
  const { data } = await base58check.decode(fixture.id);
  assert.deepEqual(Array.from(data.slice(0, 3)), [1, 48, 33]);
  const padded = new Uint8Array([129, 0, 48, 161, 0, ...data.slice(3)]);
  const wallet = new MultiWallet('leofcoin');
  await wallet.fromId(await base58check.encode(padded));
  assert.equal(await wallet.id, fixture.id);
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

test('dependency graph and generated entry points do not import varint', async () => {
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  const lock = JSON.parse(await readFile(new URL('../package-lock.json', import.meta.url), 'utf8'));
  assert.equal(manifest.dependencies['@leofcoin/binary'], '^1.0.1');
  for (const [name, value] of Object.entries(lock.packages)) {
    assert.ok(!name.endsWith('/varint'), name);
    assert.ok(!/^(git\+|git:|github:|file:)/.test(value.resolved ?? ''), name);
  }
  for (const entry of ['index', 'multi-node', 'hd-account']) {
    const source = await readFile(new URL(`../exports/${entry}.js`, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /from ["']varint["']|import ["']varint["']/);
  }
});

test('packed archive includes built public runtime and declarations', () => {
  const [packed] = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: fileURLToPath(new URL('..', import.meta.url)), encoding: 'utf8'
  }));
  const files = new Set(packed.files.map(({ path }) => path));
  for (const entry of ['exports/index.js', 'exports/index.d.ts', 'exports/multi-node.js'])
    assert.ok(files.has(entry), entry);
});
