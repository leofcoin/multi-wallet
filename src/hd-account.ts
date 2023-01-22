import MultiHDNode from './multi-node.js'
export default class HDAccount extends MultiHDNode {
	/**
	 * @param {number} depth - acount depth
	 */
	constructor(network, hdnode, depth: number = 0) {		
		super(network, hdnode);
		this.hdnode = hdnode;
		this.depth = depth;
		this._prefix = `m/44'/${hdnode.network.coin_type}'/${depth}'/`;
	}

	get neutered() {
		return this.hdnode.neutered
	}

	/**
	 * @param {number} index - address index
	 */
	async internal(index: number = 0) {
		return this.hdnode.derivePath(`${this._prefix}1/${index}`)
	}

	/**
	 * @param {number} index - address index
	 */
	async external(index: number = 0) {
		return this.hdnode.derivePath(`${this._prefix}0/${index}`)
	}
}