import bs58Check from 'bs58check';
import HDWallet from './hd-wallet.js';
import MultiSignature from 'multi-signature';
import varint from 'varint';
import networks from './networks.js'
import { encrypt, decrypt } from '@leofcoin/utils'

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
		const buffer = Buffer.concat([
			Buffer.from(varint.encode(this.multiCodec)),
			Buffer.from(this.account(0).node.neutered.publicKey, 'hex')
		]);
		return bs58Check.encode(buffer)
	}

	get multiWIF() {
		return this.ifNotLocked(() => this.encode())
	}

	get neutered() {
		const neutered = this.ifNotLocked(() => new MultiWallet(this.networkName, this.hdnode.neutered()))
		if (neutered) this._neutered = neutered;
		return this._neutered
	}

	fromId(id) {
		let buffer = bs58Check.decode(id)
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
		const decrypted = await decrypt(cipher, key, iv)
		this.import(decrypted);
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
	import(multiWIF) {
		const { bs58, version, multiCodec } = this.decode(multiWIF)
		this.network = Object.values(networks).reduce((p, c) => {
			if (c.multiCodec===multiCodec) return c
			else if (c.testnet && c.testnet.multiCodec === multiCodec) return c.testnet
			else return p
		}, networks['leofcoin'])
		this.load(bs58, this.networkName)
	}

	/**
	 * @return base58Check encoded string
	 */
	encode() {
		const buffer = Buffer.concat([
			Buffer.from(varint.encode(this.version)),
			Buffer.from(varint.encode(this.multiCodec)),
			bs58Check.decode(this.save())
		]);
		return bs58Check.encode(buffer);
	}

	decode(bs58) {
		let buffer = bs58Check.decode(bs58);
		const version = varint.decode(buffer);
		buffer = buffer.slice(varint.decode.bytes)
		const multiCodec = varint.decode(buffer);
		buffer = buffer.slice(varint.decode.bytes)
		bs58 = bs58Check.encode(buffer)
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
