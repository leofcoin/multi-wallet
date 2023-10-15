const leofcoinOlivia = {
	messagePrefix: '\u0019Leofcoin Signed Message:',
	version: 1,
	pubKeyHash: 0x73, // o
	scriptHash: 0x76, // p
	multiTxHash: 0x8b4125, // omtx
	payments: {
		version: 0,
		unspent: 0x1fa443d7 // ounsp
	},
	wif: 0x7D, // s
	multiCodec: 0x7c4,
	bip32: { public: 0x13BBF2D5, private: 0x13BBCBC5 }
}

const bitcoinTestnet = {
	messagePrefix: '\x18Bitcoin Signed Message:\n',
	version: 1,
	bech32: 'tb',
	pubKeyHash: 0x6f,
	scriptHash: 0xc4,
	wif: 0xef,
	bip32: {
		public: 0x043587cf,
		private: 0x04358394
	},
	multiCodec: 0
}

export default {
	'leofcoin:olivia': leofcoinOlivia,
  'bitcoin:testnet': bitcoinTestnet
}
