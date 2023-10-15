declare const _default: {
    'leofcoin:olivia': {
        messagePrefix: string;
        version: number;
        pubKeyHash: number;
        scriptHash: number;
        multiTxHash: number;
        payments: {
            version: number;
            unspent: number;
        };
        wif: number;
        multiCodec: number;
        bip32: {
            public: number;
            private: number;
        };
    };
    'bitcoin:testnet': {
        messagePrefix: string;
        version: number;
        bech32: string;
        pubKeyHash: number;
        scriptHash: number;
        wif: number;
        bip32: {
            public: number;
            private: number;
        };
        multiCodec: number;
    };
};
export default _default;
