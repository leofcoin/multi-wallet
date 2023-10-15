/**
 * Our & supported networks
 * @return {leofcoin, olivia}
 */
declare const _default: {
    leofcoin: {
        messagePrefix: string;
        version: number;
        pubKeyHash: number;
        scriptHash: number;
        multiTxHash: number;
        payments: {
            version: number;
            unspent: number;
        };
        coin_type: number;
        wif: number;
        multiCodec: number;
        bip32: {
            public: number;
            private: number;
        };
        testnet: {
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
    };
    bitcoin: {
        messagePrefix: string;
        version: number;
        bech32: string;
        pubKeyHash: number;
        multiCodec: number;
        scriptHash: number;
        wif: number;
        coin_type: number;
        bip32: {
            public: number;
            private: number;
        };
        testnet: {
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
    litecoin: {
        messagePrefix: string;
        version: number;
        pubKeyHash: number;
        scriptHash: number;
        wif: number;
        bip32: {
            public: number;
            private: number;
        };
        bech32: string;
        multiCodec: number;
    };
    ethereum: {
        messagePrefix: string;
        version: number;
        pubKeyHash: number;
        scriptHash: number;
        bip32: {
            private: number;
            public: number;
        };
        coin_type: number;
        wif: number;
        multiCodec: number;
    };
};
export default _default;
