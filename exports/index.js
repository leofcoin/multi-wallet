import base58check from '@vandeurenglenn/base58check';
import multiWif from '@leofcoin/multi-wif';
import secp256k1 from 'secp256k1';
import typedArraySmartConcat from '@vandeurenglenn/typed-array-smart-concat';
import typedArraySmartDeconcat from '@vandeurenglenn/typed-array-smart-deconcat';
import { createRIPEMD160, createHMAC, createSHA512, createKeccak } from 'hash-wasm';
import { createHash, encrypt, decrypt } from '@leofcoin/crypto';
import wif from '@leofcoin/wif';
import Mnemonic from '@leofcoin/mnemonic';
import MultiSignature from 'multi-signature';
import varint from 'varint';

const leofcoinOlivia = {
    messagePrefix: '\u0019Leofcoin Signed Message:',
    version: 1,
    pubKeyHash: 0x73,
    scriptHash: 0x76,
    multiTxHash: 0x8b4125,
    payments: {
        version: 0,
        unspent: 0x1fa443d7 // ounsp
    },
    wif: 0x7D,
    multiCodec: 0x7c4,
    bip32: { public: 0x13BBF2D5, private: 0x13BBCBC5 }
};
const bitcoinTestnet = {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    version: 1,
    bech32: 'tb',
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
    bip32: {
        public: 0x043587cf,
        private: 0x04358394
    },
    multiCodec: 0
};
var testnets = {
    'leofcoin:olivia': leofcoinOlivia,
    'bitcoin:testnet': bitcoinTestnet
};

// https://en.bitcoin.it/wiki/List_of_address_prefixes
/**
 * Main network
 * @return {messagePrefix, pubKeyHash, scriptHash, wif, bip32}
 */
const leofcoin = {
    messagePrefix: '\u0019Leofcoin Signed Message:',
    version: 1,
    pubKeyHash: 0x30,
    scriptHash: 0x37,
    multiTxHash: 0x3adeed,
    payments: {
        version: 0,
        unspent: 0x0d6e0327 // Lunsp
    },
    coin_type: 640,
    wif: 0x3F,
    multiCodec: 0x3c4,
    bip32: { public: 0x13BBF2D4, private: 0x13BBCBC4 },
    testnet: testnets['leofcoin:olivia']
};
const bitcoin = {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    version: 1,
    bech32: 'bc',
    pubKeyHash: 0x00,
    multiCodec: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
    coin_type: 0,
    bip32: {
        public: 0x0488b21e, private: 0x0488ade4
    },
    testnet: testnets['bitcoin:testnet']
};
const litecoin = {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    version: 1,
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
    bip32: {
        public: 0x019da462,
        private: 0x019d9cfe
    },
    bech32: '',
    multiCodec: 0
};
const ethereum = {
    messagePrefix: '\x19Ethereum Signed Message:\n',
    version: 1,
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    bip32: {
        private: 0x0488ADE4, public: 0x0488B21E
    },
    coin_type: 60,
    wif: 0x45,
    multiCodec: 0x3c5
};
/**
 * Our & supported networks
 * @return {leofcoin, olivia}
 */
var networks = {
    leofcoin,
    bitcoin,
    litecoin,
    ethereum
};

const HIGHEST_BIT = 0x80000000;
const { publicKeyCreate, publicKeyVerify, privateKeyVerify, privateKeyTweakAdd, ecdh } = secp256k1;
class HdNode {
    #privateKey;
    #publicKey;
    #chainCode;
    #network;
    #depth;
    #index;
    #parentFingerprint;
    constructor(privateKey, publicKey, chainCode, network, depth = 0, index = 0, parentFingerprint = 0x00000000) {
        this.init(privateKey, publicKey, chainCode, network, depth, index, parentFingerprint);
    }
    init(privateKey, publicKey, chainCode, network, depth = 0, index = 0, parentFingerprint = 0x00000000) {
        this.#privateKey = privateKey;
        this.#publicKey = publicKey;
        this.#chainCode = chainCode;
        this.#network = network || networks.leofcoin;
        this.#depth = depth;
        this.#index = index;
        this.#parentFingerprint = parentFingerprint;
    }
    get network() {
        return this.#network;
    }
    get publicKey() {
        this.#publicKey = this.#publicKey || publicKeyCreate(this.#privateKey, true);
        return this.#publicKey;
    }
    get privateKey() {
        return this.#privateKey;
    }
    get identifier() {
        return this.hash160(this.publicKey);
    }
    get fingerprint() {
        return (async () => (await this.identifier).subarray(0, 4))();
    }
    async hash160(data) {
        const hash = await createHash(data, 'SHA-256');
        return (await createRIPEMD160()).update(new Uint8Array(hash)).digest('binary');
    }
    get isNeutered() {
        return this.#privateKey === undefined;
    }
    get neutered() {
        return new HdNode(undefined, this.#publicKey, this.#chainCode, this.#network, this.#depth, this.#index, this.#parentFingerprint);
    }
    fromPrivateKey(privateKey, chainCode, network) {
        if (!privateKeyVerify(privateKey))
            throw new TypeError('Private key not in range [1, n)');
        return new HdNode(privateKey, publicKeyCreate(privateKey, true), chainCode, network);
    }
    fromPublicKey(publicKey, chainCode, network) {
        // verify the X coordinate is a point on the curve
        if (!publicKeyVerify(publicKey))
            throw new TypeError('Point is not on the curve');
        return new HdNode(undefined, publicKey, chainCode, network);
    }
    async fromSeed(seed, network) {
        if (seed.length < 16)
            throw new TypeError('Seed should be at least 128 bits');
        if (seed.length > 64)
            throw new TypeError('Seed should be at most 512 bits');
        let hash = (await createHMAC(createSHA512(), new TextEncoder().encode('Bitcoin seed')))
            .update(seed)
            .digest('binary');
        const privateKey = hash.subarray(0, 32);
        const chainCode = hash.subarray(32);
        return this.fromPrivateKey(privateKey, chainCode, network);
    }
    async toBase58() {
        const network = this.#network || networks.leofcoin;
        let version = !this.isNeutered
            ? network.bip32.private
            : network.bip32.public;
        const set = [
            new TextEncoder().encode(version.toString()),
            new TextEncoder().encode(this.#depth.toString()),
            new TextEncoder().encode(this.#parentFingerprint.toString()),
            new TextEncoder().encode(this.#index.toString()),
            this.#chainCode
        ];
        if (!this.isNeutered) {
            set.push(new TextEncoder().encode('0'));
            set.push(new Uint8Array(this.privateKey));
        }
        else {
            set.push(new Uint8Array(this.publicKey));
        }
        return base58check.encode(typedArraySmartConcat(set));
    }
    toWIF() {
        if (!this.#privateKey)
            throw new TypeError('Missing private key');
        return wif.encode(this.#network.wif, this.#privateKey, true);
    }
    // https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#child-key-derivation-ckd-functions
    async derive(index) {
        const isHardened = index >= HIGHEST_BIT;
        let data;
        // Hardened child
        if (isHardened) {
            if (this.isNeutered)
                throw new TypeError('Missing private key for hardened child key');
            // data = 0x00 || ser256(kpar) || ser32(index)
            data = typedArraySmartConcat([
                new TextEncoder().encode('0'),
                this.privateKey,
                new TextEncoder().encode(index.toString())
            ]);
        }
        else {
            data = typedArraySmartConcat([
                this.publicKey,
                new TextEncoder().encode(index.toString())
            ]);
        }
        const hash = (await createHMAC(createSHA512(), this.#chainCode))
            .update(data)
            .digest('binary');
        const privateKey = hash.subarray(0, 32);
        const chainCode = hash.subarray(32);
        // if parse256(privateKey) >= n, proceed with the next value for i
        if (!privateKeyVerify(privateKey))
            return this.derive(index + 1);
        // Private parent key -> private child key
        if (!this.isNeutered) {
            // ki = parse256(privateKey) + kpar (mod n)                
            const ki = privateKeyTweakAdd(this.privateKey, privateKey);
            // In case ki == 0, proceed with the next value for i
            if (ki == null)
                return this.derive(index + 1);
            return new HdNode(ki, null, chainCode, this.#network, this.#depth + 1, index, (await this.fingerprint)[0]);
        }
        function hashfn(x, y) {
            const pubKey = new Uint8Array(33);
            pubKey[0] = (y[31] & 1) === 0 ? 0x02 : 0x03;
            pubKey.set(x, 1);
            return pubKey;
        }
        const Ki = ecdh(this.publicKey, chainCode, { hashfn }, new Uint8Array(33));
        // const Ki = new Uint8Array(ecc.pointAddScalar(this.publicKey, IL, true));
        // In case Ki is the point at infinity, proceed with the next value for i
        if (Ki === null)
            return this.derive(index + 1);
        return new HdNode(undefined, Ki, chainCode, this.#network, this.#depth + 1, index, (await this.fingerprint)[0]);
    }
    deriveHardened(index) {
        // Only derives hardened private keys by default
        return this.derive(index + HIGHEST_BIT);
    }
    async derivePath(path) {
        let splitPath = path.split('/');
        if (splitPath[0] === 'm') {
            if (this.#parentFingerprint)
                throw new TypeError('Expected master, got child');
            splitPath = splitPath.slice(1);
        }
        let prevHd = this;
        for (const indexString of splitPath) {
            let index;
            if (indexString.slice(-1) === `'`) {
                index = parseInt(indexString.slice(0, -1), 10);
                prevHd = await prevHd.deriveHardened(index);
            }
            else {
                index = parseInt(indexString, 10);
                prevHd = await prevHd.derive(index);
            }
        }
        return prevHd;
    }
    async fromBase58(string, network) {
        let buffer = (await base58check.decode(string)).data;
        network = network || networks.leofcoin;
        // 4 bytes: version bytes
        let [version, depth, parentFingerprint, index, chainCode, k, privateKey] = typedArraySmartDeconcat(buffer);
        version = Number(new TextDecoder().decode(version));
        depth = Number(new TextDecoder().decode(depth));
        parentFingerprint = Number(new TextDecoder().decode(parentFingerprint));
        index = Number(new TextDecoder().decode(index));
        k = privateKey ? 0 : k;
        if (version !== network.bip32.private && version !== network.bip32.public)
            throw new TypeError('Invalid network version');
        if (depth === 0) {
            if (parentFingerprint !== 0)
                throw new TypeError('Invalid parent fingerprint');
        }
        if (depth === 0 && index !== 0)
            throw new TypeError('Invalid index');
        if (version === network.bip32.private) {
            if (k !== 0x00)
                throw new TypeError('Invalid private key');
            return new HdNode(privateKey, undefined, chainCode, network, depth, index, parentFingerprint);
        }
        this.init(undefined, k, chainCode, network, depth, index, parentFingerprint);
        return new HdNode(undefined, k, chainCode, network, depth, index, parentFingerprint);
    }
}

const fromNetworkString = network => {
    const parts = network.split(':');
    network = networks[parts[0]];
    if (parts[1]) {
        if (network[parts[1]])
            network = network[parts[1]];
        network.coin_type = 1;
    }
    return network;
};
const publicKeyToEthereumAddress = async (publicKeyBuffer) => {
    const hasher = await createKeccak(256);
    hasher.update(publicKeyBuffer);
    const hash = hasher.digest();
    return `0x${hash.slice(-40).toString()}`;
};
class HDWallet {
    hdnode;
    networkName;
    version;
    locked;
    network;
    multiCodec;
    get privateKey() {
        return this.ifNotLocked(() => this.hdnode.privateKey);
    }
    get publicKey() {
        return this.hdnode.publicKey;
    }
    async ethereumAddress() {
        const address = await publicKeyToEthereumAddress(this.publicKey);
        return address;
    }
    leofcoinAddress() {
        return base58check.encode(this.publicKey);
    }
    get address() {
        return this.getAddressForCoin();
    }
    async getAddressForCoin(coin_type) {
        if (!coin_type)
            coin_type = this.network.coin_type;
        if (coin_type === 1) {
            if (this.networkName?.split(':')[0] === 'ethereum')
                coin_type = 60;
            if (this.networkName?.split(':')[0] === 'leofcoin')
                coin_type = 640;
        }
        // if (coin_type === 0) return this.bitcoinAddress
        if (coin_type === 60)
            return this.ethereumAddress();
        if (coin_type === 640)
            return this.leofcoinAddress();
    }
    get accountAddress() {
        return this.ifNotLocked(async () => base58check.encode(this.hdnode.publicKey));
    }
    get isTestnet() {
        return this.network.coin_type === 1;
    }
    constructor(network, hdnode) {
        if (typeof network === 'string') {
            this.networkName = network;
            this.network = fromNetworkString(network);
        }
        else if (typeof network === 'object')
            this.network = network;
        this.multiCodec = this.network.multiCodec;
        this.version = 0x00;
        if (hdnode)
            this.defineHDNode(hdnode);
    }
    ifNotLocked(fn, params) {
        if (this.locked)
            return;
        return params ? fn(...params) : fn();
    }
    async defineHDNode(value) {
        Object.defineProperty(this, 'hdnode', {
            configurable: false,
            writable: false,
            value: await value
        });
    }
    validateNetwork(network) {
        if (!network && !this.network)
            return console.error(`expected network to be defined`);
        if (!network && this.network)
            network = this.network;
        if (typeof network === 'string')
            network = fromNetworkString(network);
        if (typeof network !== 'object')
            return console.error('network not found');
        return network;
    }
    async generate(password, network) {
        network = this.validateNetwork(network);
        const mnemonic = await new Mnemonic().generate(512);
        const seed = await new Mnemonic().seedFromMnemonic(mnemonic, password, 512);
        await this.defineHDNode(await (new HdNode()).fromSeed(new Uint8Array(seed), network));
        return mnemonic;
    }
    /**
   * recover using mnemonic (recovery word list)
   */
    async recover(mnemonic, password, network) {
        network = this.validateNetwork(network || password);
        const seed = await new Mnemonic().seedFromMnemonic(mnemonic, password, 512);
        let node = new HdNode();
        node = await node.fromSeed(new Uint8Array(seed), network);
        await this.defineHDNode(await node.fromSeed(new Uint8Array(seed), network));
    }
    async load(base58, network) {
        network = this.validateNetwork(network);
        await this.defineHDNode(await (new HdNode()).fromBase58(base58, network));
    }
    save() {
        return this.hdnode.toBase58();
    }
    async fromAddress(address, chainCode, network) {
        network = this.validateNetwork(network);
        address = (await base58check.decode(address)).data;
        if (!chainCode || chainCode && !Buffer.isBuffer(chainCode))
            chainCode = address.slice(1);
        await this.defineHDNode(await (new HdNode()).fromPublicKey(address, chainCode, network));
    }
    async fromPublicKey(hex, chainCode, network) {
        network = this.validateNetwork(network);
        if (!chainCode || chainCode)
            chainCode = hex.slice(1);
        let node = new HdNode();
        node = await node.fromPublicKey(hex, chainCode, network);
        await this.defineHDNode(node);
        return this;
    }
    async fromPrivateKey(privateKey, chainCode, network) {
        await this.defineHDNode(await (new HdNode()).fromPrivateKey(privateKey, chainCode, network));
    }
}

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
// TODO: multihash addresses
class HDAccount extends MultiWallet {
    /**
     * @param {number} depth - acount depth
     */
    constructor(network, hdnode, depth = 0) {
        super(network, hdnode);
        this.hdnode = hdnode;
        this.depth = depth;
        this._prefix = `m/44'/${hdnode.network.coin_type}'/${depth}'/`;
    }
    /**
     * @param {number} index - address index
     */
    async internal(index = 0) {
        return this.hdnode.derivePath(`${this._prefix}1/${index}`);
    }
    /**
     * @param {number} index - address index
     */
    async external(index = 0) {
        return this.hdnode.derivePath(`${this._prefix}0/${index}`);
    }
}

export { MultiWallet as default };
