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
  multiTxHash: number;
  payments: {
    version: number;
    unspent: number;
  };
  coin_type?: number;
  wif: number;
  multiCodec: number;
  bip32: { public: number; private: number };
  testnet: network;
};

class MultiWallet extends MultiHDNode {
  constructor(network, hdnode?: HdNode) {
    super(network, hdnode);
  }

  get id() {
    return base58check.encode(
      typedArraySmartConcat([
        new TextEncoder().encode(this.version.toString()),
        this.account(0).hdnode.neutered.publicKey,
      ])
    );
  }

  get multiWIF() {
    return this.toMultiWif();
  }

  get neutered() {
    return new HDAccount(this.networkName, this, this.hdnode.depth);
  }

  /**
   * @param {number} account - account to return chain for
   * @return internal(addressIndex), external(addressIndex)
   */
  account(index): HDAccount {
    return new HDAccount(this.networkName, this, index);
  }

  async fromAccount(privateKey: Uint8Array, depth: number, network) {
    const node = await new MultiWallet(network).fromPrivateKey(privateKey);
    return new HDAccount(node, depth);
  }

  /**
   * m / purpose' / coin_type' / account' / change / aadress_index
   *
   * see https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
   */
  async derivePath(path) {
    return new MultiWallet(
      this.networkName,
      await this.hdnode.derivePath(path)
    );
  }

  async derive(index) {
    return new MultiWallet(this.networkName, await this.hdnode.derive(index));
  }
}

export { MultiWallet as default };
