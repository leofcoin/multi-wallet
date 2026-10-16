import base58check from "@vandeurenglenn/base58check";
import multiWif from "@leofcoin/multi-wif";
import HDWallet from "./hd-wallet.js";
import MultiSignature from "multi-signature";
import { BinaryReader } from "@leofcoin/binary";
import networks from "./networks.js";
import { decrypt, encrypt } from "@leofcoin/identity-utils";
import typedArraySmartConcat from "@vandeurenglenn/typed-array-smart-concat";
import { network } from "./index.js";

class MultiHDNode extends HDWallet {
  #encrypted: Uint8Array;

  constructor(network: network | string, hdnode) {
    super(network, hdnode);
  }

  get id() {
    return base58check.encode(
      typedArraySmartConcat([
        new TextEncoder().encode(this.version.toString()),
        this.account(0).hdnode.neutered.publicKey,
      ]),
    );
  }

  get multiWIF() {
    return this.toMultiWif();
  }

  async fromId(id) {
    const buffer = (await base58check.decode(id)).data;
    const reader = new BinaryReader(buffer);
    // IDs contain two framed fields: textual version and compressed public key.
    // Keep legacy padded length prefixes readable without changing generated IDs.
    const version = reader.readFrame(false);
    const publicKey = reader.readFrame(false);
    const expectedVersion = new TextEncoder().encode(this.version.toString());
    if (
      reader.remaining !== 0 ||
      version.length !== expectedVersion.length ||
      !version.every((byte, index) => byte === expectedVersion[index]) ||
      publicKey.length !== 33
    ) throw new Error("invalid wallet ID");
    await this.fromPublicKey(publicKey, null, this.networkName);
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
      if (c.multiCodec === codec) return c;
      else if (c.testnet && c.testnet.multiCodec === codec) return c.testnet;
      else return p;
    }, networks["leofcoin"]);

    if (version !== this.network.version) throw new Error("invalid version");
    return this.fromPrivateKey(privateKey, undefined, this.network);
  }

  toMultiWif() {
    return multiWif.encode(
      this.network.version,
      this.network.multiCodec,
      this.privateKey,
    );
  }

  sign(hash: any): any {
    return new MultiSignature(this.version, this.network.multiCodec).sign(
      hash,
      this.privateKey,
    );
  }

  verify(multiSignature, hash): any {
    const publicKey =
      this.publicKey?.length === 33 ? this.publicKey.slice(1) : this.publicKey;
    return new MultiSignature(this.version, this.network.multiCodec).verify(
      multiSignature,
      hash,
      publicKey,
    );
  }
}

export { MultiHDNode as default };
