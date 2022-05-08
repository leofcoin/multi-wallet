import * as bip32 from 'bip32'
import networks from './networks';
import { fromNetworkString } from './network-utils.js';
import bs58check from 'bs58check';
import createKeccakHash from 'keccak';
import ecc from 'tiny-secp256k1'
import Mnemonic from '@leofcoin/mnemonic'
// import { createHash } from 'crypto'
// import { createHash as _createHash } from './hash'

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

	get ethereumAddress() {
		const buffer = ecc.pointFromScalar(this.hdnode.__D, false)
		let hash = createKeccakHash('keccak256').update(buffer.slice(1)).digest()
		return `0x${hash.slice(-20).toString('hex')}`
	}

	// async bitcoinAddress() {
	// 	const chainCode = this.privateKeyBuffer
	//
	// 	const node = bip32.fromPrivateKey(this.privateKeyBuffer, chainCode, networks['bitcoin'])
	// 	let buffer = await _createHash(node.publicKey, 'SHA-256')
	// 	buffer = createHash('ripemd160').update(buffer).digest()
	// 	// buffer = Buffer.from(`0x00${buffer.toString('hex')}`, 'hex')
	// 	// buffer = createHash('sha256').update(buffer).digest()
	// 	// const mainHash = buffer
	// 	// buffer = createHash('sha256').update(buffer).digest()
	// 	// const checksum = buffer.toString('hex').substring(0, 8)
	// 	// return base58.encode(Buffer.concat([mainHash, Buffer.from(checksum, 'hex')]))
	// 	const payload = Buffer.allocUnsafe(21)
	//   payload.writeUInt8(networks['bitcoin'].pubKeyHash, 0)
	//   buffer.copy(payload, 1)
	//
  // 	return encode(payload)
	// }

	get leofcoinAddress() {
		return encode(this.neutered.publicKeyBuffer)
	}

	get address() {
		return this.getAddressForCoin()
	}

	getAddressForCoin(coin_type) {
		if (!coin_type) coin_type = this.hdnode.network.coin_type
		if (coin_type === 1) {
			if (this.networkName?.split(':')[0] === 'ethereum') coin_type = 60
			if (this.networkName?.split(':')[0] === 'leofcoin') coin_type = 640
		}
		// if (coin_type === 0) return this.bitcoinAddress
		if (coin_type === 60) return this.ethereumAddress
		if (coin_type === 640) return this.leofcoinAddress
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

	async generate(password, network) {
		network = this.validateNetwork(network);
		const mnemonic = new Mnemonic().generate()
		const seed = new Mnemonic().seedFromMnemonic(mnemonic, password);
		this.defineHDNode(bip32.fromSeed(seed, network));
		return mnemonic;
	}

	/**
   * recover using mnemonic (recovery word list)
   */
	async recover(mnemonic, password, network) {
		network = this.validateNetwork(network, password);
		const seed = new Mnemonic().seedFromMnemonic(mnemonic, password);
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
