import { b as base58check } from './base58check-8a065f2e.js';
import multiWif from '@leofcoin/multi-wif';
import HDWallet from './hd-wallet.js';
import MultiSignature from 'multi-signature';
import networks from './networks.js';
import { decrypt, encrypt } from '@leofcoin/identity-utils';
import typedArraySmartConcat from '@vandeurenglenn/typed-array-smart-concat';
import '@vandeurenglenn/base58';
import '@leofcoin/crypto';
import '@vandeurenglenn/typed-array-concat';
import './hd-node.js';
import '@leofcoin/mnemonic';
import 'hash-wasm';

const MSB$1 = 0x80;
const REST$1 = 0x7F;
const MSBALL = ~REST$1;
const INT = Math.pow(2, 31);
const encode = (num, out, offset) => {
    if (Number.MAX_SAFE_INTEGER && num > Number.MAX_SAFE_INTEGER) {
        encode.bytes = 0;
        throw new RangeError('Could not encode varint');
    }
    out = out || [];
    offset = offset || 0;
    const oldOffset = offset;
    while (num >= INT) {
        out[offset++] = (num & 0xFF) | MSB$1;
        num /= 128;
    }
    while (num & MSBALL) {
        out[offset++] = (num & 0xFF) | MSB$1;
        num >>>= 7;
    }
    out[offset] = num | 0;
    encode.bytes = offset - oldOffset + 1;
    return out;
};

const MSB = 0x80;
const REST = 0x7F;
const decode = (buf, offset) => {
    offset = offset || 0;
    const l = buf.length;
    let counter = offset;
    let result = 0;
    let shift = 0;
    let b;
    do {
        if (counter >= l || shift > 49) {
            decode.bytes = 0;
            throw new RangeError('Could not decode varint');
        }
        b = buf[counter++];
        result += shift < 28
            ? (b & REST) << shift
            : (b & REST) * Math.pow(2, shift);
        shift += 7;
    } while (b >= MSB);
    decode.bytes = counter - offset;
    return result;
};

const N1 = Math.pow(2, 7);
const N2 = Math.pow(2, 14);
const N3 = Math.pow(2, 21);
const N4 = Math.pow(2, 28);
const N5 = Math.pow(2, 35);
const N6 = Math.pow(2, 42);
const N7 = Math.pow(2, 49);
const N8 = Math.pow(2, 56);
const N9 = Math.pow(2, 63);
var encodingLength = (value) => (value < N1 ? 1
    : value < N2 ? 2
        : value < N3 ? 3
            : value < N4 ? 4
                : value < N5 ? 5
                    : value < N6 ? 6
                        : value < N7 ? 7
                            : value < N8 ? 8
                                : value < N9 ? 9
                                    : 10);

var index = {
    encode,
    decode,
    encodingLength
};

class MultiHDNode extends HDWallet {
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
    async fromId(id) {
        let buffer = (await base58check.decode(id)).data;
        index.decode(buffer);
        buffer = buffer.slice(index.decode.bytes);
        this.fromPublicKey(buffer, null, this.networkName);
    }
    async import(password, encrypted) {
        const { prefix, data } = await base58check.decode(encrypted);
        const decrypted = await decrypt(password, data);
        await this.fromMultiWif(decrypted);
    }
    async export(password) {
        return base58check.encode(await encrypt(password, await this.toMultiWif()));
    }
    async lock(password) {
        // todo redefine hdnode
        this.#encrypted = await this.export(password);
        this.locked = true;
    }
    async unlock(password) {
        const { prefix, data } = await base58check.decode(this.#encrypted);
        await decrypt(password, data);
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
}

export { MultiHDNode as default };
