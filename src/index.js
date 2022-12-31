import bs58Check from '@vandeurenglenn/base58check';
import HDWallet from './hd-wallet.js';
import MultiSignature from 'multi-signature';
import varint from 'varint';
import networks from './networks.js'
import { encrypt, decrypt } from '@leofcoin/crypto'
import typedArraySmartConcat from '@vandeurenglenn/typed-array-smart-concat'
import typedArraySmartDeconcat from '@vandeurenglenn/typed-array-smart-deconcat'

const numberToHex = number => {
	number = number.toString(16);
	if (number.length % 2 === 1) number = '0' + number;
	return number;
}

// TODO: multihash addresses
class HDAccount {
	/**
	 * @param {number} depth - acount depth
	 */
	constructor(node, depth = 0) {
		this.node = node;
		this.depth = depth;
		this._prefix = `m/44'/${node.network.coin_type}'/${depth}'/`;
	}

	/**
	 * @param {number} index - address index
	 */
	internal(index = 0) {
		return this.node.derivePath(`${this._prefix}1/${index}`)
	}

	/**
	 * @param {number} index - address index
	 */
	external(index = 0) {
		return this.node.derivePath(`${this._prefix}0/${index}`)
	}
}

export default class MultiWallet extends HDWallet {
	constructor(network, hdnode) {
		super(network, hdnode);
		this.multiCodec = this.network.multiCodec;
		this.version = 0x00
	}

	get id() {
		return bs58Check.encode(typedArraySmartConcat([
			new TextEncoder().encode(this.multiCodec),
			new Uint8Array(this.account(0).node.neutered.publicKey)
		]), this.version)
	}

	get multiWIF() {
		return this.ifNotLocked(async () => this.encode())
	}

	get neutered() {
		const neutered = this.ifNotLocked(() => new MultiWallet(this.networkName, this.hdnode.neutered()))
		if (neutered) this._neutered = neutered;
		return this._neutered
	}

	async fromId(id) {
		let buffer = (await bs58Check.decode(id)).data
		const codec = varint.decode(buffer)
		buffer = buffer.slice(varint.decode.bytes)
		this.fromPublicKey(buffer, null, this.networkName)
	}

	async lock(multiWIF) {
		if (!multiWIF) multiWIF = this.multiWIF;
		this.encrypted = await encrypt(multiWIF.toString('hex'));
		this.locked = true;
		return this.encrypted
	}

	async unlock({key, iv, cipher}) {
		const decrypted = await decrypt({cipher, key, iv})
		await this.import(decrypted);
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
		const {data, prefix} = await bs58Check.decode(await this.save())
		return bs58Check.encode(typedArraySmartConcat([
			new TextEncoder().encode(this.version),
			new TextEncoder().encode(this.multiCodec),
			prefix,
			data,
		]));
	}

	async decode(bs58) {
		let [version, multiCodec, prefix, data] = typedArraySmartDeconcat((await bs58Check.decode(bs58)).data)
		version = Number(new TextDecoder().decode(version))
		multiCodec = Number(new TextDecoder().decode(multiCodec))
		
		bs58 = await bs58Check.encode(data, prefix)
		if (version !== this.version) throw TypeError('Invalid version');
		if (this.multiCodec !== multiCodec) throw TypeError('Invalid multiCodec');
		return { version, multiCodec, bs58 };
	}

	sign(hash) {
		return new MultiSignature(this.version, this.network.multiCodec)
			.sign(hash, this.privateKeyBuffer);

	}

	verify(multiSignature, hash) {
		return new MultiSignature(this.version, this.network.multiCodec)
			.verify(multiSignature, hash, this.publicKeyBuffer)
	}

	/**
	 * @param {number} account - account to return chain for
	 * @return { internal(addressIndex), external(addressIndex) }
	 */
	account(index) {
		return new HDAccount(new MultiWallet(this.networkName, this.hdnode), index);
	}

	/**
	 * m / purpose' / coin_type' / account' / change / aadress_index
	 *
	 * see https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
	 */
	derivePath(path) {
		return new MultiWallet(this.networkName, this.hdnode.derivePath(path))
	}

	derive(index) {
		return new MultiWallet(this.networkName, this.hdnode.derive(index));
	}
}
