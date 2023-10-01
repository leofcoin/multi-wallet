import base58check from '@vandeurenglenn/base58check';
import multiWif from '@leofcoin/multi-wif'
import HDWallet from './hd-wallet.js';
import MultiSignature from 'multi-signature';
import varint from 'varint';
import networks from './networks.js'
import { decrypt, encrypt } from "@leofcoin/identity-utils";
import typedArraySmartConcat from '@vandeurenglenn/typed-array-smart-concat'
import typedArraySmartDeconcat from '@vandeurenglenn/typed-array-smart-deconcat'

class MultiHDNode extends HDWallet {
	#encrypted: Uint8Array

	constructor(network: network | string, hdnode) {
		super(network, hdnode);
	}

	get id() {
		return base58check.encode(typedArraySmartConcat([
			new TextEncoder().encode(this.version.toString()),
			this.account(0).hdnode.neutered.publicKey
		]))
	}

	get multiWIF() {
		return this.toMultiWif()
	}

	async fromId(id) {
		let buffer = (await base58check.decode(id)).data
		const codec = varint.decode(buffer)
		buffer = buffer.slice(varint.decode.bytes)
		this.fromPublicKey(buffer, null, this.networkName)
	}

	async lock(password, multiWIF) {
		if (!multiWIF) multiWIF = this.multiWIF;		
		this.#encrypted = await encrypt(password, multiWIF);
		this.locked = true;
		return base58check.encode(this.#encrypted)
	}

	async unlock(password, encrypted) {
		const { prefix, data } = await base58check.decode(encrypted)
		const decrypted = await decrypt(password, data)		
		await this.fromMultiWif(decrypted);
		this.locked = false;
	}

	fromMultiWif(string) {
		const { version, codec, privateKey } = multiWif.decode(string)
		this.network = Object.values(networks).reduce((p, c) => {
			if (c.multiCodec === codec) return c
			else if (c.testnet && c.testnet.multiCodec === codec) return c.testnet
			else return p
		}, networks['leofcoin'])

		if (version !== this.network.version) throw new Error('invalid version')
		return this.fromPrivateKey(privateKey, undefined, this.network)
	}

	toMultiWif() {
		return multiWif.encode(this.network.version, this.network.multiCodec, this.privateKey)
	}

	sign(hash: any): any {
		return new MultiSignature(this.version, this.network.multiCodec)
			.sign(hash, this.privateKey);

	}

	verify(multiSignature, hash): any {
		return new MultiSignature(this.version, this.network.multiCodec)
			.verify(multiSignature, hash, this.publicKey)
	}
}

export { MultiHDNode as default }