import { generateMnemonic, mnemonicToSeed } from 'bip39';
import bip32 from 'bip32'
import networks from './networks';
import { fromNetworkString } from './network-utils.js';
import bs58check from 'bs58check';
import createKeccakHash from 'keccak';
import { publicKeyConvert } from 'secp256k1'
import ecc from 'tiny-secp256k1'

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
		// override testnet coin_type
		let coin_type = this.hdnode.network.coin_type
		if (coin_type === 1 && this.networkName.split(':')[0] === 'ethereum') coin_type = 60
		if (coin_type === 60) {
			let buffer = ecc.pointFromScalar(this.hdnode.__D, false)
			buffer = Buffer.from(publicKeyConvert(buffer, false)).slice(1)
			let hash = createKeccakHash('keccak256').update(buffer).digest()
			return hash.slice(-20).toString('hex')
		}
		return encode(this.neutered.publicKeyBuffer)
	}

	get accountAddress() {
		return this.ifNotLocked(() => encode(this.hdnode.publicKeyBuffer))
	}

	get isTestnet() {
		if (typeof network === 'string')
			this.hdnode.network = fromNetworkString(network);

		return Boolean(this.hdnode.network.coin_type === 1)
	}

	constructor(network, hdnode) {
		if (typeof network === 'string') {
			this.networkName = network
			this.network = fromNetworkString(network)
		} else if (typeof network === 'object')
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

	async generate(network) {
		network = this.validateNetwork(network);
		const mnemonic = generateMnemonic();
		const seed = await mnemonicToSeed(mnemonic);
		this.defineHDNode(bip32.fromSeed(seed, network));
		return mnemonic; // userpw
	}

	/**
   * recover using mnemonic (recovery word list)
   */
	async recover(mnemonic, network) {
		network = this.validateNetwork(network);
		const seed = await mnemonicToSeed(mnemonic);
		this.defineHDNode(bip32.fromSeed(seed, network));
	}

	load(base58, network) {
		network = this.validateNetwork(network);
		this.defineHDNode(bip32.fromBase58(base58, network));
	}

	save() {
		return this.hdnode.toBase58();
	}

	fromAddress(address, chainCode, network) {
		network = this.validateNetwork(network);
		// if (network.coin_type === 60) {
		// 	address = Buffer.from(address, 'hex')
		// } else {
			address = decode(address);
		// }

		if (!chainCode || chainCode && !Buffer.isBuffer(chainCode)) chainCode = address.slice(1)
		this.defineHDNode(bip32.fromPublicKey(address, chainCode, network))
	}

	fromPublicKey(hex, chainCode, network) {
		network = this.validateNetwork(network);
		if (!Buffer.isBuffer(hex)) hex = Buffer.from(hex, 'hex');
		if (!chainCode || chainCode && !Buffer.isBuffer(chainCode)) chainCode = hex.slice(1)
		this.defineHDNode(bip32.fromPublicKey(hex, chainCode, network))
	}
}
