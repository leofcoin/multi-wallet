import * as bs58Check from 'bs58check';
import HDWallet from './hd-wallet';
import MultiSignature from 'multi-signature';
import varint from 'varint';
import AES from 'crypto-js/aes.js';
import sha512 from 'crypto-js/sha512.js';
import ENC from 'crypto-js/enc-utf8.js';
import networks from './networks.js'
const { encode, decode } = bs58Check;

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
		return encode(buffer)
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
		let buffer = decode(id)
		const codec = varint.decode(buffer)
		buffer = buffer.slice(varint.decode.bytes)
		this.fromPublicKey(buffer, null, this.networkName)
	}

	lock(key, multiWIF) {
		if (!multiWIF) multiWIF = this.multiWIF;
		this.encrypted = AES.encrypt(multiWIF.toString('hex'), key).toString();
		this.locked = true;
	}

	unlock(key, encrypted) {
		if (!encrypted) encrypted = this.encrypted;
		this.import(AES.decrypt(encrypted, key).toString(ENC));
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
			decode(this.save())
		]);
		return encode(buffer);
	}

	decode(bs58) {
		let buffer = decode(bs58);
		const version = varint.decode(buffer);
		buffer = buffer.slice(varint.decode.bytes)
		const multiCodec = varint.decode(buffer);
		buffer = buffer.slice(varint.decode.bytes)
		bs58 = encode(buffer)
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
