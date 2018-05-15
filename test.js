const test = require('tape');
const MultiHDWallet = require('./');
const { encode, decode } = require('bs58');
const { mnemonic, privateKey, multiWIF, hash, signature, publicKey, pub, address } = {
	mnemonic: 'benefit garlic virtual final all poet lawsuit pact moral taste differ rubber',
	privateKey: '5BycwKbGxPkhDsZrdDMSshKkt8iStj1e9SKtLK7drxP9eYGCbLy1DfEs9VR4LnFyzMw4pa1nEzp9UPDMrfqkWgPryHD6xm8MBC7kZJgmeYiqFiTs',
	multiWIF: '66VHEYyaFkpxkntCNEcbpmftfrdQn6D34Q5gdvRpdfjVcyyarzTMwuGioP8HePksYMKghoW2w6cqGQJqq9mkchAm9f8By4nzGE6H7nkrzBBPPRoYU8CBsEH',
	hash: encode(new Buffer('00000000000000000000000000000000')),
	publicKey: '5Bz3dFZxdrX51hVBCEz3wimqhfvrxBrLuFSbVBEwdELYE8RdenWCYUjE6BeTWcaW5DoMLPhoM8Q6CiknDyNUaV571rzPW2Ypv7YmxqBenB9r2W49',
	signature: 'LPiDvJPSZ5GXgvTyCBD6WPcNDb65J4AGi5',
	pub: 'sbKq6LxyaCkqMi14bHdhcj67PRk4ymQSbqo55rxk4Zq6',
	address: 'oRBxBtoWiVGQomJSfQgWFHWLbGYGVqxvoL'
};

const before = tape => {
	tape.plan(1);
	return new MultiHDWallet('olivia');
};
/**
 * @test
 * @module MultiHDWallet
 * @extends HDWallet
 */
test('MultiHDWallet can generate', tape => {
	const hdnode = before(tape);
	hdnode.generate();
	tape.ok(true);
});

test('MultiHDWallet can load from saved', tape => {
	const hdnode = before(tape);
	hdnode.load(privateKey);
	const saved = hdnode.save();
	tape.equal(saved, privateKey);
});

test('MultiHDWallet can recover using mnemonic', tape => {
	const hdnode = before(tape);
	hdnode.recover(mnemonic);
	const saved = hdnode.save();
	tape.equal(saved, privateKey);
});

test('MultiHDWallet can export to MultiWIF', tape => {
	const hdnode = before(tape);
	hdnode.load(privateKey);
	const exported = hdnode.export();
	tape.equal(exported, multiWIF);
});

test('MultiHDWallet can import from MultiWIF', tape => {
	const hdnode = before(tape);
	hdnode.import(multiWIF);
	const saved = hdnode.save();
	tape.equal(saved, privateKey);
});

test('MultiHDWallet can export publicKey', tape => {
	const hdnode = before(tape);
	hdnode.load(privateKey);
	tape.equal(publicKey, hdnode.publicKey);
});

test('MultiHDWallet can import privateKey', tape => {
	const hdnode = before(tape);
	hdnode.load(privateKey);
	tape.equal(privateKey, hdnode.privateKey);
});

test('MultiHDWallet can sign', tape => {
	const hdnode = before(tape);
	hdnode.load(privateKey);
	const child = hdnode.derive('m/0\'/0/0');
	tape.equal(signature, child.sign(hash, child.address));
});

test('MultiHDWallet can verify', tape => {
	const hdnode = before(tape);
	hdnode.load(privateKey);
	const child = hdnode.derive('m/0\'/0/0');
	const verified = child.verify(signature, hash, child.address);
	tape.equal(verified, true);
});

test('bob can verify alice\'s signature', tape => {
	const hdnode = before(tape);
	hdnode.generate(); // bob
	const verified = hdnode.verify(signature, hash, address);
	tape.equal(verified, true);
});
