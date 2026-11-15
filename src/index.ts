import base58check from '@vandeurenglenn/base58check';
import typedArraySmartConcat from '@vandeurenglenn/typed-array-smart-concat';
import MultiHDNode from './multi-node.js';
import HDAccount from './hd-account.js';
import HdNode from './hd-node.js';

export declare type network = {
  messagePrefix: string;
  version: number;
  pubKeyHash: number;
  scriptHash: number;
  multiTxHash?: number;
  payments?: {
    version: number;
    unspent: number;
  };
  coin_type?: number;
  wif: number;
  multiCodec: number;
  bip32: { public: number; private: number };
  testnet?: network;
};

class MultiWallet extends MultiHDNode {
  constructor(network: string | network, hdnode?: HdNode) {
    super(network, hdnode);
  }

  get id(): Promise<string> {
    return base58check.encode(
      typedArraySmartConcat([
        new TextEncoder().encode(this.version.toString()),
        this.publicKey,
      ])
    );
  }

  get multiWIF(): Promise<string> {
    return this.toMultiWif();
  }

  get neutered(): HDAccount {
    const network = this.networkName ?? this.network;
    const neuteredWallet = new MultiWallet(network, this.hdnode.neutered);
    return new HDAccount(
      network,
      neuteredWallet,
      this.hdnode.depth,
    );
  }

  /**
   * @param {number} account - account to return chain for
   * @return internal(addressIndex), external(addressIndex)
   */
  account(index: number): HDAccount {
    return new HDAccount(this.networkName ?? this.network, this, index);
  }

  async fromAccount(
    privateKey: Uint8Array,
    depth: number,
    network: string | network,
  ): Promise<HDAccount> {
    const wallet = new MultiWallet(network);
    await wallet.fromPrivateKey(privateKey);
    return new HDAccount(wallet.network, wallet, depth);
  }

  /**
   * m / purpose' / coin_type' / account' / change / aadress_index
   *
   * see https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
   */
  async derivePath(path: string): Promise<MultiWallet> {
    return new MultiWallet(
      this.networkName ?? this.network,
      await this.hdnode.derivePath(path)
    );
  }

  async derive(index: number): Promise<MultiWallet> {
    return new MultiWallet(
      this.networkName ?? this.network,
      await this.hdnode.derive(index),
    );
  }
}

export { MultiWallet as default };
export {
  default as PqWallet,
  PQ_ADDRESS_PREFIX,
  PQ_NETWORK,
  PQ_PUBLIC_KEY_BYTES,
  PQ_SCHEME,
  PQ_SIGNATURE_BYTES,
} from './pq-wallet.js';
