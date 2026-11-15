import MultiHDNode from './multi-node.js';
import type MultiWallet from './index.js';
import type { network } from './index.js';

export default class HDAccount extends MultiHDNode {
  depth: number = 0;
  _prefix: string;
  wallet: MultiWallet;
  /**
   * @param {number} depth - acount depth
   */
  constructor(
    network: string | network,
    wallet: MultiWallet,
    depth: number = 0,
  ) {
    super(network, wallet.hdnode);
    this.wallet = wallet;
    this.depth = depth;
    this._prefix = `m/44'/${wallet.network.coin_type}'/${depth}'/`;
  }

  get neutered(): HDAccount {
    return this.wallet.neutered;
  }

  /**
   * @param {number} index - address index
   */
  async internal(index: number = 0): Promise<MultiWallet> {
    return this.wallet.derivePath(`${this._prefix}1/${index}`);
  }

  /**
   * @param {number} index - address index
   */
  async external(index: number = 0): Promise<MultiWallet> {
    return this.wallet.derivePath(`${this._prefix}0/${index}`);
  }
}
