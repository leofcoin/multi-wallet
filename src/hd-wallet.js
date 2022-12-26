import {BIP32Factory} from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { fromNetworkString } from './network-utils.js';
import bs58check from 'bs58check';
import Mnemonic from '@leofcoin/mnemonic'

import { publicKeyToEthereumAddress } from './utils.js';

const bip32 = BIP32Factory(ecc)
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

	async ethereumAddress() {
		const address = await publicKeyToEthereumAddress(this.publicKeyBuffer)
		return address
	}

	get leofcoinAddress() {
		return bs58check.encode(this.neutered.publicKeyBuffer)
	}

	get address() {
		return this.getAddressForCoin()
	}

	async getAddressForCoin(coin_type) {
		if (!coin_type) coin_type = this.hdnode.network.coin_type
		if (coin_type === 1) {
			if (this.networkName?.split(':')[0] === 'ethereum') coin_type = 60
			if (this.networkName?.split(':')[0] === 'leofcoin') coin_type = 640
		}
		// if (coin_type === 0) return this.bitcoinAddress
		if (coin_type === 60) return this.ethereumAddress()
		if (coin_type === 640) return this.leofcoinAddress
	}

	get accountAddress() {
		return this.ifNotLocked(() => bs58check.encode(this.hdnode.publicKeyBuffer))
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
		const mnemonic = await new Mnemonic().generate(512)
		const seed = await new Mnemonic().seedFromMnemonic(mnemonic, password, 512);
		this.defineHDNode(bip32.fromSeed(Buffer.from(seed, 'arrayBuffer'), network));
		return mnemonic;
	}

	/**
   * recover using mnemonic (recovery word list)
   */
	async recover(mnemonic, password, network) {
		network = this.validateNetwork(network, password);
		const seed = await new Mnemonic().seedFromMnemonic(mnemonic, password, 512);
		this.defineHDNode(bip32.fromSeed(Buffer.from(seed, 'arrayBuffer'), network));
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
			address = bs58check.decode(address);
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
