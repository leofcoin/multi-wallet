// https://en.bitcoin.it/wiki/List_of_address_prefixes
// Dogecoin BIP32 is a proposed standard: https://bitcointalk.org/index.php?topic=409731

// usage:
// networks['bitcoin']['testnet']
// networks.bitcoin.testnet
import testnets from './testnets.js';
/**
 * Main network
 * @return {messagePrefix, pubKeyHash, scriptHash, wif, bip32}
 */
const leofcoin = {
	messagePrefix: '\u0019Leofcoin Signed Message:',
	pubKeyHash: 0x30, // L
	scriptHash: 0x37, // P
	multiTxHash: 0x3adeed, // Lmtx
	payments: {
		version: 0,
		unspent: 0x0d6e0327 // Lunsp
	},
	coin_type: 640,
	wif: 0x3F, // S
	multiCodec: 0x3c4,
	bip32: { public: 0x13BBF2D4, private: 0x13BBCBC4 },
	testnet: testnets['leofcoin:olivia']
};

const bitcoin = {
	messagePrefix: '\x18Bitcoin Signed Message:\n',
	bech32: 'bc',
	pubKeyHash: 0x00,
	scriptHash: 0x05,
	wif: 0x80,
	coin_type: 0,
	bip32: {
		public: 0x0488b21e, private: 0x0488ade4
	},
	testnet: testnets['bitcoin:testnet']
};

const litecoin = {
	messagePrefix: '\x19Litecoin Signed Message:\n',
	pubKeyHash: 0x30,
	scriptHash: 0x32,
	wif: 0xb0,
	bip32: {
		public: 0x019da462,
		private: 0x019d9cfe
	}
};

const ethereum = {
	messagePrefix: '\x19Ethereum Signed Message:\n',
	pubKeyHash: 0x30,
	scriptHash: 0x32,
	bip32: {
		private: 0x0488ADE4, public: 0x0488B21E
	},
	coin_type: 60,
	wif: 0x45,//E
	multiCodec: 0x3c5
}

/**
 * Our & supported networks
 * @return {leofcoin, olivia}
 */
export default {
	leofcoin,
	bitcoin,
	litecoin,
	ethereum
};
