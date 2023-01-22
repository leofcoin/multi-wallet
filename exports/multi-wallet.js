import base58check from '@vandeurenglenn/base58check';
import multiWif from '@leofcoin/multi-wif';
import HDWallet from './hd-wallet.js';
import MultiSignature from 'multi-signature';
import varint from 'varint';
import networks from './networks.js';
import { encrypt, decrypt } from '@leofcoin/crypto';
import typedArraySmartConcat from '@vandeurenglenn/typed-array-smart-concat';
import HDAccount from './hd-account.js';
import './hd-node.js';
import '@leofcoin/mnemonic';
import 'hash-wasm';

class MultiWallet extends HDWallet {
    #encrypted;
    constructor(network, hdnode) {
        super(network, hdnode);
    }
    get id() {
        return base58check.encode(typedArraySmartConcat([
            new TextEncoder().encode(this.version.toString()),
            this.account(0).hdnode.neutered.publicKey
        ]));
    }
    get multiWIF() {
        return this.toMultiWif();
    }
    get neutered() {
        return new HDAccount(this.networkName, this, this.hdnode.depth);
    }
    async fromId(id) {
        let buffer = (await base58check.decode(id)).data;
        varint.decode(buffer);
        buffer = buffer.slice(varint.decode.bytes);
        this.fromPublicKey(buffer, null, this.networkName);
    }
    async lock(multiWIF) {
        if (!multiWIF)
            multiWIF = this.multiWIF;
        this.#encrypted = await encrypt(multiWIF);
        this.locked = true;
        return this.#encrypted;
    }
    async unlock({ key, iv, cipher }) {
        const decrypted = await decrypt({ cipher, key, iv });
        await this.fromMultiWif(new TextDecoder().decode(decrypted));
        this.locked = false;
    }
    fromMultiWif(string) {
        const { version, codec, privateKey } = multiWif.decode(string);
        this.network = Object.values(networks).reduce((p, c) => {
            if (c.multiCodec === codec)
                return c;
            else if (c.testnet && c.testnet.multiCodec === codec)
                return c.testnet;
            else
                return p;
        }, networks['leofcoin']);
        if (version !== this.network.version)
            throw new Error('invalid version');
        return this.fromPrivateKey(privateKey, undefined, this.network);
    }
    toMultiWif() {
        return multiWif.encode(this.network.version, this.network.multiCodec, this.privateKey);
    }
    sign(hash) {
        return new MultiSignature(this.version, this.network.multiCodec)
            .sign(hash, this.privateKey);
    }
    verify(multiSignature, hash) {
        return new MultiSignature(this.version, this.network.multiCodec)
            .verify(multiSignature, hash, this.publicKey);
    }
    /**
     * @param {number} account - account to return chain for
     * @return internal(addressIndex), external(addressIndex)
     */
    account(index) {
        return new HDAccount(this.networkName, this, index);
    }
    /**
     * m / purpose' / coin_type' / account' / change / aadress_index
     *
     * see https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
     */
    async derivePath(path) {
        return new MultiWallet(this.networkName, await this.hdnode.derivePath(path));
    }
    async derive(index) {
        return new MultiWallet(this.networkName, await this.hdnode.derive(index));
    }
    async fromAccount(privateKey, depth, network) {
        const node = await new MultiWallet(network).fromPrivateKey(privateKey);
        return new HDAccount(node, depth);
    }
}

export { MultiWallet as default };
