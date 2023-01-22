import MultiHDNode from './multi-node.js';
import '@vandeurenglenn/base58check';
import '@leofcoin/multi-wif';
import './hd-wallet.js';
import './hd-node.js';
import '@leofcoin/mnemonic';
import 'hash-wasm';
import './networks.js';
import 'multi-signature';
import 'varint';
import '@leofcoin/crypto';
import '@vandeurenglenn/typed-array-smart-concat';

class HDAccount extends MultiHDNode {
    /**
     * @param {number} depth - acount depth
     */
    constructor(network, hdnode, depth = 0) {
        super(network, hdnode);
        this.hdnode = hdnode;
        this.depth = depth;
        this._prefix = `m/44'/${hdnode.network.coin_type}'/${depth}'/`;
    }
    get neutered() {
        return this.hdnode.neutered;
    }
    /**
     * @param {number} index - address index
     */
    async internal(index = 0) {
        return this.hdnode.derivePath(`${this._prefix}1/${index}`);
    }
    /**
     * @param {number} index - address index
     */
    async external(index = 0) {
        return this.hdnode.derivePath(`${this._prefix}0/${index}`);
    }
}

export { HDAccount as default };
