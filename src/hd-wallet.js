import { generateMnemonic, mnemonicToSeed } from 'bip39';
import bip32 from 'bip32'
import networks from './networks';
import { fromNetworkString } from './network-utils.js';
import bs58check from 'bs58check';

const { encode, decode } = bs58check;
export default class HDWallet {

	get chainCodeBuffer() {
		return this.ifNotLocked(() => this.hdnode.chainCode)
	}

	get chainCode() {
		return this.ifNotLocked(() => this.chainCodeBuffer.toString('hex'))
	}

	get privateKeyBuffer() {
		return this.ifNotLocked(() => this.hdnode.privateKey)
	}

	get privateKey() {
		return this.ifNotLocked(() => this.privateKeyBuffer.toString('hex'))
	}

	get publicKeyBuffer() {
		return this.ifNotLocked(() => this.hdnode.publicKey)
	}

	get publicKey() {
		return this.ifNotLocked(() => this.publicKeyBuffer.toString('hex'))
	}

	get address() {
		return encode(this.neutered.publicKeyBuffer)
	}

	get accountAdress() {
		return this.ifNotLocked(() => encode(this.hdnode.publicKeyBuffer))
	}

	constructor(network, hdnode) {
		if (typeof network === 'string')
			this.network = fromNetworkString(network);
		else if (typeof network === 'object')
      this.network = network;

    if (hdnode) this.defineHDNode(hdnode);
	}

	ifNotLocked(fn, params) {
		if (!this.locked) return fn(params);
		return null
	}

	defineHDNode(value) {
		Object.defineProperty(this, 'hdnode', {
			configurable: false,
			writable: false,
			value: value
		});
	}

	validateNetwork(network) {
		if (!network && !this.network) return console.error(`expected network to be defined`);
		if (!network && this.network) network = this.network;
		if (typeof network === 'string') network = fromNetworkString(network);
		if (typeof network !== 'object') return console.error('network not found');
		return network;
	}

	generate(network) {
		network = this.validateNetwork(network);
		const mnemonic = generateMnemonic();
		const seed = mnemonicToSeed(mnemonic);
		this.defineHDNode(bip32.fromSeed(seed, network));
		return mnemonic; // userpw
	}

	/**
   * recover using mnemonic (recovery word list)
   */
	recover(mnemonic, network) {
		network = this.validateNetwork(network);
		const seed = mnemonicToSeed(mnemonic);
		this.defineHDNode(bip32.fromSeed(seed, network));
	}

	load(base58, network) {
		network = this.validateNetwork(network);
		this.defineHDNode(bip32.fromBase58(base58, network));
	}

	save() {
		return this.hdnode.toBase58();
	}

	fromAddress(bs58, chainCode, network) {
		network = this.validateNetwork(network);
		bs58 = decode(bs58);
		if (!chainCode || chainCode && !Buffer.isBuffer(chainCode)) chainCode = bs58.slice(1)
		this.defineHDNode(bip32.fromPublicKey(bs58, chainCode, network))
	}

	fromPublicKey(hex, chainCode, network) {
		network = this.validateNetwork(network);
		if (!Buffer.isBuffer(hex)) hex = Buffer.from(hex, 'hex');
		if (!chainCode || chainCode && !Buffer.isBuffer(chainCode)) chainCode = hex.slice(1)
		this.defineHDNode(bip32.fromPublicKey(hex, chainCode, network))
	}

	fromPrivateKey(hex, chainCode, network) {
		network = this.validateNetwork(network);
		if (!Buffer.isBuffer(hex)) hex = Buffer.from('hex');
		this.defineHDNode(bip32.fromPrivateKey(hex, hex, network))
	}
}
