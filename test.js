const test = require('tape');
const MultiHDWallet = require('./');
const { encode, decode } = require('bs58');
const { mnemonic, bs58, multiWIF, hash, signature, publicKey, pub, address, chainCode } = {
	mnemonic: 'noble section royal vintage space tool devote tag also fluid alone electric',
	bs58: '5BycwKbGxPkhDsZrdDUcTgQf9exz41y6ASPMgbYigHxtVARLTmUd67zibeKDCNBzqzjdSmER7AHLH22nf7toiUxGpMCAEo8UYmyQKzfWfzcFUVfJ',
	multiWIF: '12nSSi35DyW2iMZCUj1Nk2hLaP9S1uVSyziSvGT6uJQD9rNRvj87mXaacmtbePPNfSFjjmnzzJcYHsHTs',
	hash: Buffer.alloc(32, 1),
	publicKey: '033f2870261a1f6e2a4a82ceb2032432c4fd606e818caab4ed9e8ec29f3c6d21ff',
	signature: '12KN9pRvs96voUUS2SuTSwgfGCrTcpm8TyoaQN9Dx8aHKeYKV8QzJ8EXxreUrCeraSFwtPk8MUQSjP6cF1mpXQwUwcyV',
	pub: '03eadd67d69c020878c1cd7b35e0c2bbb847b48edbbb9858468e8065dcb3106c1d',
	address: '7K3pFGxGchyvW7LT2wpzVMZgHcRfmPRKXQKChPyY2GoQ5R9PSc'
};

const before = tape => {
	tape.plan(1);
	return new MultiHDWallet('leofcoin:olivia');
};
/**
 * @test
 * @module MultiHDWallet
 * @extends HDWallet
 */
test('MultiHDWallet can generate', tape => {
	const hdnode = before(tape);
	const generated = hdnode.generate();
	tape.ok(true);
});

test('MultiHDWallet can export to MultiWIF', tape => {
	const hdnode = before(tape);
	hdnode.load(bs58);
	hdnode.export();
	tape.equal(hdnode.export(), multiWIF);
});

test('MultiHDWallet can import from multiWif', tape => {
	const hdnode = before(tape);
	hdnode.import(multiWIF);
	tape.equal(hdnode.export(), multiWIF);
});

test('MultiHDWallet can load from saved', tape => {
	const hdnode = before(tape);
	hdnode.load(bs58)
	tape.equal(hdnode.save(), bs58);
});

test('MultiHDWallet can recover using mnemonic', tape => {
	const hdnode = before(tape);
	hdnode.recover(mnemonic);
	tape.equal(hdnode.save(), bs58);
});

test('MultiHDWallet can sign', tape => {
	const hdnode = before(tape);
	hdnode.load(bs58);
	const account = hdnode.account(0)
	const external = account.external(0)
	const neutered = external.neutered;
	console.log(external.privateKey);
	tape.equal(signature, external.sign(hash));
});

test('MultiHDWallet can verify', tape => {
	let hdnode = before(tape);
	hdnode.load(bs58);
	const account = hdnode.account(0);
	const neutered = account.external(0).neutered;
	const verified = neutered.verify(signature, hash, publicKey);
	tape.equal(verified, true);
});

test('bob can verify alice\'s signature using Alice\'s address', tape => {
	const hdnode = before(tape);
	hdnode.fromAddress(address, null, 'leofcoin:olivia');
	const verified = hdnode.verify(signature, hash);
	tape.equal(verified, true);
});

test('bob can verify alice\'s signature using Alice\'s publicKey', tape => {
	const hdnode = before(tape);
	hdnode.fromPublicKey(publicKey, null, 'leofcoin:olivia');
	const verified = hdnode.verify(signature, hash);
	tape.equal(verified, true);
});

test('MultiHDWallet can create internal/external chains', tape => {
	const hdnode = before(tape);
	hdnode.load(bs58);
	const account = hdnode.account(0);

	tape.notEqual(account.internal(0).publicKey, account.external(0).publicKey);
})
