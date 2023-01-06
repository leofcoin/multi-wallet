declare type network = {
  messagePrefix: string,
  pubKeyHash: number,  
  scriptHash: number,
  wif: number,
  bip32: {
    public: number,
    private: number
  },  
	multiCodec: number,
	coin_type?: number,
  version: number,
  testnet?: network
}

declare interface leofcoinNetwork extends network {
  multiTxHash: number,
  payments: {
		version: number,
		unspent: number
	},  
  testnet?: leofcoinNetwork
}

declare interface bitcoinNetwork extends network {
  bech32: string,  
  testnet?: bitcoinNetwork
}

declare module '@leofcoin/multi-wallet' {
  id: string
}