import secp256k1 from 'secp256k1'
import typedArraySmartConcat from '@vandeurenglenn/typed-array-smart-concat'
import typedArraySmartDeconcat from '@vandeurenglenn/typed-array-smart-deconcat'
import networks from './networks.js'
import { createRIPEMD160, createHMAC, createSHA512 } from 'hash-wasm'
import { createHash } from '@leofcoin/crypto'
import base58check from '@vandeurenglenn/base58check'
import wif from '@leofcoin/wif'
const HIGHEST_BIT = 0x80000000

const  {publicKeyCreate, publicKeyVerify, privateKeyVerify, privateKeyTweakAdd, ecdh} = secp256k1
export default class HdNode {
  #privateKey: Uint8Array
  #publicKey: Uint8Array
  #chainCode: Uint8Array
  #network: network
  #depth: number
  #index: number
  #parentFingerprint: number

  constructor(privateKey?: Uint8Array, publicKey?: Uint8Array, chainCode?: Uint8Array, network?: network, depth = 0, index = 0, parentFingerprint = 0x00000000) {
    this.init(privateKey, publicKey, chainCode, network, depth, index, parentFingerprint)
  }

  init(privateKey?: Uint8Array, publicKey?: Uint8Array, chainCode?: Uint8Array, network?: network, depth = 0, index = 0, parentFingerprint = 0x00000000) {    
    this.#privateKey = privateKey
    this.#publicKey = publicKey
    this.#chainCode = chainCode
    this.#network = network || networks.leofcoin
    this.#depth = depth
    this.#index = index
    this.#parentFingerprint = parentFingerprint
  }

  get network() {
    return this.#network
  }

  get publicKey() {
    this.#publicKey = this.#publicKey || publicKeyCreate(this.#privateKey, true)
    return this.#publicKey
  }

  get privateKey() {
    return this.#privateKey
  }
  
  get identifier() {
    return this.hash160(this.publicKey)
  }
  get fingerprint() {
    return (async () => (await this.identifier).subarray(0, 4))()
  }

  async hash160(data) {
    const hash = await createHash(data, 'SHA-256')
    return (await createRIPEMD160()).update(new Uint8Array(hash)).digest('binary')
  }

  get isNeutered() {
    return this.#privateKey === undefined
  }

  get neutered() {
    return new HdNode(undefined, this.#publicKey, this.#chainCode, this.#network, this.#depth, this.#index, this.#parentFingerprint);
  }

  fromPrivateKey(privateKey: Uint8Array, chainCode, network): HdNode {
    if (!privateKeyVerify(privateKey)) throw new TypeError('Private key not in range [1, n)');

    return new HdNode(privateKey, publicKeyCreate(privateKey, true), chainCode, network);
  }

  fromPublicKey(publicKey: Uint8Array, chainCode, network): HdNode {
    
    // verify the X coordinate is a point on the curve
    if (!publicKeyVerify(publicKey)) throw new TypeError('Point is not on the curve')

    return new HdNode(undefined, publicKey, chainCode, network);
  }

  async fromSeed(seed: Uint8Array, network) {
    if (seed.length < 16)
        throw new TypeError('Seed should be at least 128 bits');
    if (seed.length > 64)
        throw new TypeError('Seed should be at most 512 bits');
    
    let hash = (await createHMAC(createSHA512(), new TextEncoder().encode('Bitcoin seed')))
    .update(seed)
    .digest('binary')

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
    ]
    if (!this.isNeutered) {
      set.push(new TextEncoder().encode('0'))
      set.push(new Uint8Array(this.privateKey))
    } else {              
      set.push(new Uint8Array(this.publicKey))
    }
    return base58check.encode(typedArraySmartConcat(set));
  }
  
  toWIF() {
    if (!this.#privateKey) throw new TypeError('Missing private key');
    return wif.encode(this.#network.wif, this.#privateKey, true);
  }

  // https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#child-key-derivation-ckd-functions
  async derive(index: number): Promise<HdNode> {
    const isHardened = index >= HIGHEST_BIT;
    let data: Uint8Array
    // Hardened child
    if (isHardened) {
      if (this.isNeutered)
          throw new TypeError('Missing private key for hardened child key');
      // data = 0x00 || ser256(kpar) || ser32(index)
      data = typedArraySmartConcat([
        new TextEncoder().encode('0'),
        this.privateKey,
        new TextEncoder().encode(index.toString())
      ])
    }
    else {
      data = typedArraySmartConcat([                  
        this.publicKey,
        new TextEncoder().encode(index.toString())
      ])
    }
    const hash = (await createHMAC(createSHA512(), this.#chainCode))
      .update(data)
      .digest('binary')
    
    const privateKey = hash.subarray(0, 32);
    const chainCode = hash.subarray(32);
    // if parse256(privateKey) >= n, proceed with the next value for i
    if (!privateKeyVerify(privateKey)) return this.derive(index + 1);
    // Private parent key -> private child key
    
    if (!this.isNeutered) {
      // ki = parse256(privateKey) + kpar (mod n)                
      const ki = privateKeyTweakAdd(this.privateKey, privateKey)
      // In case ki == 0, proceed with the next value for i
      if (ki == null) return this.derive(index + 1);
      return new HdNode(ki, null, chainCode, this.#network, this.#depth + 1, index, (await this.fingerprint)[0])
    }
    
    function hashfn (x, y) {
      const pubKey = new Uint8Array(33)
      pubKey[0] = (y[31] & 1) === 0 ? 0x02 : 0x03
      pubKey.set(x, 1)
      return pubKey
    }
    const Ki = ecdh(this.publicKey, chainCode, { hashfn }, new Uint8Array(33))
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
      if (this.#parentFingerprint) throw new TypeError('Expected master, got child');
      splitPath = splitPath.slice(1);
    }

    let prevHd = this
    

    for (const indexString of splitPath) {
      let index

      if (indexString.slice(-1) === `'`) {
        index = parseInt(indexString.slice(0, -1), 10);
        prevHd = await prevHd.deriveHardened(index);        
      }
      else {
        index = parseInt(indexString, 10);
        prevHd = await prevHd.derive(index);
      }
    }
    return prevHd
  }

  async fromBase58(string: base58String, network: network): Promise<HdNode> {
    let buffer = (await base58check.decode(string)).data;

    network = network || networks.leofcoin;
    // 4 bytes: version bytes
    let [version, depth, parentFingerprint, index, chainCode, k, privateKey] = typedArraySmartDeconcat(buffer)

    version = Number(new TextDecoder().decode(version))
    depth = Number(new TextDecoder().decode(depth))
    parentFingerprint = Number(new TextDecoder().decode(parentFingerprint))
    index = Number(new TextDecoder().decode(index))
    k = privateKey ? 0 : k

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
      return new HdNode(privateKey, undefined, chainCode, network, depth, index, parentFingerprint)
    }
    this.init(undefined, k, chainCode, network, depth, index, parentFingerprint)
    return new HdNode(undefined, k, chainCode, network, depth, index, parentFingerprint)
  }
  
}