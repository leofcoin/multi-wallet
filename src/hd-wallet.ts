import HdNode from './hd-node.js';
import base58check from '@vandeurenglenn/base58check';
import Mnemonic from '@leofcoin/mnemonic'
import { createKeccak } from  'hash-wasm'
import networks from './networks.js';

const fromNetworkString = network => {
  const parts = network.split(':');
  network = networks[parts[0]]
  if (parts[1]) {
    if (network[parts[1]]) network = network[parts[1]];

    network.coin_type = 1
  }
	return network;
}

const publicKeyToEthereumAddress = async (publicKeyBuffer) => {
  const hasher = await createKeccak(256)
  hasher.update(publicKeyBuffer)

  const hash = hasher.digest()
  return `0x${hash.slice(-40).toString()}`
}

export default class HDWallet {
	hdnode: HdNode
	networkName: string
	version: number
	locked: boolean
	network: network
	multiCodec: number	

	get privateKey() {
		return this.ifNotLocked(() => this.hdnode.privateKey)
	}

	get publicKey() {
		return this.hdnode.publicKey
	}


	async ethereumAddress() {
		const address = await publicKeyToEthereumAddress(this.publicKey)
		return address
	}

	leofcoinAddress() {
		return base58check.encode(this.publicKey)
	}

	get address(): Promise<address | hexEncodedAddress> {
		return this.getAddressForCoin()
	}

	async getAddressForCoin(coin_type?: number): Promise<any> {
		if (!coin_type) coin_type = this.network.coin_type
		if (coin_type === 1) {
			if (this.networkName?.split(':')[0] === 'ethereum') coin_type = 60
			if (this.networkName?.split(':')[0] === 'leofcoin') coin_type = 640
		}
		// if (coin_type === 0) return this.bitcoinAddress
		if (coin_type === 60) return this.ethereumAddress()
		if (coin_type === 640) return this.leofcoinAddress()
	}

	get accountAddress(): Promise<undefined | Uint8Array> {
		return this.ifNotLocked(async () => base58check.encode(this.hdnode.publicKey))
	}

	get isTestnet(): boolean {
		return this.network.coin_type === 1
	}

	constructor(network: string | network, hdnode: any) {
		if (typeof network === 'string') {
			this.networkName = network
			this.network = fromNetworkString(network)
		} else if (typeof network === 'object')
      this.network = network

		this.multiCodec = this.network.multiCodec;
		this.version = 0x00
    if (hdnode) this.defineHDNode(hdnode);
	}

	ifNotLocked(fn: Function, params?: string[]) {
		if (this.locked) return
		return params ? fn(...params) : fn()
	}

	async defineHDNode(value: HdNode) {
		Object.defineProperty(this, 'hdnode', {
			configurable: false,
			writable: false,
			value: await value
		});
	}

	validateNetwork(network: network) {
		if (!network && !this.network) return console.error(`expected network to be defined`);
		if (!network && this.network) network = this.network;
		if (typeof network === 'string') network = fromNetworkString(network);
		if (typeof network !== 'object') return console.error('network not found');
		return network;
	}

	async generate(password: any, network: any) {
		network = this.validateNetwork(network);
		const mnemonic = await new Mnemonic().generate(512)
		const seed = await new Mnemonic().seedFromMnemonic(mnemonic, password, 512);
		await this.defineHDNode(await (new HdNode()).fromSeed(new Uint8Array(seed), network));
		return mnemonic;
	}

	/**
   * recover using mnemonic (recovery word list)
   */
	async recover(mnemonic: any, password: any, network: any) {
		network = this.validateNetwork(network || password);
		const seed = await new Mnemonic().seedFromMnemonic(mnemonic, password, 512);
		let node = new HdNode()
		node = await node.fromSeed(new Uint8Array(seed), network)
		await this.defineHDNode(await node.fromSeed(new Uint8Array(seed), network));
	}

	async load(base58: any, network: string) {
		network = this.validateNetwork(network);
		await this.defineHDNode(await (new HdNode()).fromBase58(base58, network));
	}

	save() {
		return this.hdnode.toBase58();
	}

	async fromAddress(address: string | any[] | Uint8Array, chainCode: any, network: any): Promise<void> {
		network = this.validateNetwork(network);
		address = (await base58check.decode(address)).data;
		if (!chainCode || chainCode && !Buffer.isBuffer(chainCode)) chainCode = address.slice(1)
		await this.defineHDNode(await (new HdNode()).fromPublicKey(address, chainCode, network))
	}

	async fromPublicKey(hex: string | any[] | Uint8Array, chainCode: any, network: string): Promise<this> {
		network = this.validateNetwork(network);		
		if (!chainCode || chainCode) chainCode = hex.slice(1)
		let node = new HdNode()
		node = await node.fromPublicKey(hex, chainCode, network)
		await this.defineHDNode(node)
		return this
	}

	async fromPrivateKey(privateKey: Uint8Array, chainCode?: Uint8Array, network?: network)  {
		await this.defineHDNode(await (new HdNode()).fromPrivateKey(privateKey, chainCode, network))
	}
}
