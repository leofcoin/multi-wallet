import MultiHDNode from './multi-node.js';
export default class HDAccount extends MultiHDNode {
    /**
     * @param {number} depth - acount depth
     */
    constructor(network: any, hdnode: any, depth?: number);
    get neutered(): import("./hd-node.js").default;
    /**
     * @param {number} index - address index
     */
    internal(index?: number): Promise<import("./hd-node.js").default>;
    /**
     * @param {number} index - address index
     */
    external(index?: number): Promise<import("./hd-node.js").default>;
}
