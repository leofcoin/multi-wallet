export default {
  'leofcoin:olivia': {
    name: 'ol',
  	messagePrefix: '\u0019Leofcoin Signed Message:',
  	pubKeyHash: 0x73, // o
  	scriptHash: 0x76, // p
  	payments: {
      unspent: 0x1fa443d7 // ounsp
    },
  	wif: 0x7D, // s
  	multiCodec: 0x7c4,
  	bip32: { public: 0x13BBF2D5, private: 0x13BBCBC5 }
  },
  'bitcoin:testnet': {
  	messagePrefix: '\x18Bitcoin Signed Message:\n',
  	bech32: 'tb',
  	pubKeyHash: 0x6f,
  	scriptHash: 0xc4,
  	wif: 0xef,
  	bip32: {
  		public: 0x043587cf,
  		private: 0x04358394
  	}
  }

}
