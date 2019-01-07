import * as bs58Check from 'bs58check';
import HDWallet from './hd-wallet';
import MultiSignature from './../node_modules/multi-signature/src/index.js';
import { decode as decodeWIF } from 'wif';
import varint from 'varint';
import AES from 'crypto-js/aes.js';
import ENC from 'crypto-js/enc-utf8.js';
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
		this._prefix = `m/44'/280'/${depth}'/`;
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

	get multiWIF() {
		return this.ifNotLocked(() => this.encode())
	}

	get wif() {
		return this.ifNotLocked(() => this.hdnode ? this.hdnode.toWIF() : this.decode(this.multiWIF).wif.privateKey)
	}

	get neutered() {
		const neutered = this.ifNotLocked(() => new MultiWallet('leofcoin:olivia', this.hdnode.neutered()))
		if (neutered) this._neutered = neutered;
		return this._neutered
	}

	lock(key, multiWIF) {
		if (!multiWIF) multiWIF = this.multiWIF;
		this.encrypted = AES.encrypt(multiWIF.toString('hex'), key).toString();
		delete this.hdnode;
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

	import(multiWIF) {
		this.fromPrivateKey(this.decode(multiWIF).wif.privateKey);
	}

	encode() {
		const buffer = Buffer.concat([
			Buffer.from(varint.encode(this.version)),
			Buffer.from(varint.encode(this.multiCodec)),
			Buffer.from(this.hdnode.toWIF())
		]);
		return encode(buffer);
	}

	decode(bs58) {
		let buffer = decode(bs58);
		const version = varint.decode(buffer);
		buffer = buffer.slice(varint.decode.bytes)
		const codec = varint.decode(buffer);
		const wif = decodeWIF(buffer.slice(varint.decode.bytes).toString());
		if (version !== this.version) throw TypeError('Invalid version');
		if (this.multiCodec !== codec) throw TypeError('Invalid multiCodec');
		return { version, codec, wif };
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
		return new HDAccount(new MultiWallet(this.network, this.hdnode), index);
	}

	/**
	 * m / purpose' / coin_type' / account' / change / aadress_index
	 *
	 * see https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
	 */
	derivePath(path) {
		return new MultiWallet(this.network, this.hdnode.derivePath(path))
	}

	derive(index) {
		return new MultiWallet(this.network, this.hdnode.derive(index));
	}
}
