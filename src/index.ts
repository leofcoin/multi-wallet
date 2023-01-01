import base58check from '@vandeurenglenn/base58check';
import HDWallet from './hd-wallet.js';
import MultiSignature from 'multi-signature';
import varint from 'varint';
import networks from './networks.js'
import { encrypt, decrypt } from '@leofcoin/crypto'
import typedArraySmartConcat from '@vandeurenglenn/typed-array-smart-concat'
import typedArraySmartDeconcat from '@vandeurenglenn/typed-array-smart-deconcat'

export default class MultiWallet extends HDWallet {
	#encrypted: Uint8Array

	constructor(network: network, hdnode) {
		super(network, hdnode);
	}

	get id() {
		return base58check.encode(typedArraySmartConcat([
			new TextEncoder().encode(this.version.toString()),
			this.account(0).hdnode.neutered.publicKey
		]))
	}

	get multiWIF() {
		return this.ifNotLocked(async () => this.encode())
	}

	get neutered() {		
		return new HDAccount(this.networkName, this, this.hdnode.depth)
	}

	async fromId(id) {
		let buffer = (await base58check.decode(id)).data
		const codec = varint.decode(buffer)
		buffer = buffer.slice(varint.decode.bytes)
		this.fromPublicKey(buffer, null, this.networkName)
	}

	async lock(multiWIF) {
		if (!multiWIF) multiWIF = this.multiWIF;		
		this.#encrypted = await encrypt(multiWIF);
		this.locked = true;
		return this.#encrypted
	}

	async unlock({key, iv, cipher}) {
		const decrypted = await decrypt({cipher, key, iv})		
		await this.import(new TextDecoder().decode(decrypted));
		this.locked = false;
	}

	export() {
		return this.encode();
	}

	/**
	 * encodes the multiWIF and loads wallet from bs58
	 *
	 * @param {multiWIF} multiWIF - note a multiWIF is not the same as a wif
	 */
	async import(multiWIF) {		
		const { bs58, version, multiCodec } = await this.decode(multiWIF)
		this.network = Object.values(networks).reduce((p, c) => {
			if (c.multiCodec===multiCodec) return c
			else if (c.testnet && c.testnet.multiCodec === multiCodec) return c.testnet
			else return p
		}, networks['leofcoin'])
		await this.load(bs58, this.networkName)
	}

	/**
	 * @return base58Check encoded string
	 */
	async encode() {
		const {data, prefix} = await base58check.decode(await this.save())
		return base58check.encode(typedArraySmartConcat([
			new TextEncoder().encode(this.version.toString()),
			new TextEncoder().encode(this.multiCodec.toString()),
			prefix,
			data,
		]));
	}

	async decode(bs58) {		
		let [version, multiCodec, prefix, data] = typedArraySmartDeconcat((await base58check.decode(bs58)).data)
		version = Number(new TextDecoder().decode(version))
		multiCodec = Number(new TextDecoder().decode(multiCodec))		
		
		bs58 = await base58check.encode(data, prefix)
		if (version !== this.version) throw TypeError('Invalid version');
		if (this.multiCodec !== multiCodec) throw TypeError('Invalid multiCodec');
		return { version, multiCodec, bs58 };
	}

	sign(hash) {
		return new MultiSignature(this.version, this.network.multiCodec)
			.sign(hash, this.privateKey);

	}

	verify(multiSignature, hash) {
		return new MultiSignature(this.version, this.network.multiCodec)
			.verify(multiSignature, hash, this.publicKey)
	}

	/**
	 * @param {number} account - account to return chain for
	 * @return { internal(addressIndex), external(addressIndex) }
	 */
	account(index) {
		return new HDAccount(this.networkName, this, index);
	}

	/**
	 * m / purpose' / coin_type' / account' / change / aadress_index
	 *
	 * see https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
	 */
	async derivePath(path) {		
		return new MultiWallet(this.networkName, await this.hdnode.derivePath(path))
	}

	async derive(index) {
		return new MultiWallet(this.networkName, await this.hdnode.derive(index));
	}

	

	async fromAccount(privateKey: Uint8Array, depth: number, network) {
		const node = await new MultiWallet(network).fromPrivateKey(privateKey)
		return new HDAccount(node, depth);
	}
}
// TODO: multihash addresses
class HDAccount extends MultiWallet {
	/**
	 * @param {number} depth - acount depth
	 */
	constructor(network, hdnode, depth = 0) {		
		super(network, hdnode);
		this.hdnode = hdnode;
		this.depth = depth;
		this._prefix = `m/44'/${hdnode.network.coin_type}'/${depth}'/`;
	}

	/**
	 * @param {number} index - address index
	 */
	async internal(index = 0) {
		return this.hdnode.derivePath(`${this._prefix}1/${index}`)
	}

	/**
	 * @param {number} index - address index
	 */
	async external(index = 0) {
		return this.hdnode.derivePath(`${this._prefix}0/${index}`)
	}
}
