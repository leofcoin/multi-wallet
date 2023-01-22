import testnets from './testnets.js';

// https://en.bitcoin.it/wiki/List_of_address_prefixes
/**
 * Main network
 * @return {messagePrefix, pubKeyHash, scriptHash, wif, bip32}
 */
const leofcoin = {
    messagePrefix: '\u0019Leofcoin Signed Message:',
    version: 1,
    pubKeyHash: 0x30,
    scriptHash: 0x37,
    multiTxHash: 0x3adeed,
    payments: {
        version: 0,
        unspent: 0x0d6e0327 // Lunsp
    },
    coin_type: 640,
    wif: 0x3F,
    multiCodec: 0x3c4,
    bip32: { public: 0x13BBF2D4, private: 0x13BBCBC4 },
    testnet: testnets['leofcoin:olivia']
};
const bitcoin = {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    version: 1,
    bech32: 'bc',
    pubKeyHash: 0x00,
    multiCodec: 0x00,
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
    version: 1,
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
    bip32: {
        public: 0x019da462,
        private: 0x019d9cfe
    },
    bech32: '',
    multiCodec: 0
};
const ethereum = {
    messagePrefix: '\x19Ethereum Signed Message:\n',
    version: 1,
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    bip32: {
        private: 0x0488ADE4, public: 0x0488B21E
    },
    coin_type: 60,
    wif: 0x45,
    multiCodec: 0x3c5
};
/**
 * Our & supported networks
 * @return {leofcoin, olivia}
 */
var networks = {
    leofcoin,
    bitcoin,
    litecoin,
    ethereum
};

export { networks as default };
