import base58check from "@vandeurenglenn/base58check";
import multiWif from "@leofcoin/multi-wif";
import HDWallet from "./hd-wallet.js";
import MultiSignature from "multi-signature";
import { BinaryReader } from "@leofcoin/binary";
import networks from "./networks.js";
import { decrypt, encrypt } from "@leofcoin/identity-utils";
import typedArraySmartConcat from "@vandeurenglenn/typed-array-smart-concat";
import type { network } from "./index.js";

class MultiHDNode extends HDWallet {
  #encrypted!: string;

  constructor(network: network | string, hdnode?: HDWallet["hdnode"]) {
    super(network, hdnode);
  }

  get id(): Promise<string> {
    return base58check.encode(
      typedArraySmartConcat([
        new TextEncoder().encode(this.version.toString()),
        this.publicKey,
      ]),
    );
  }

  get multiWIF(): Promise<string> {
    return this.toMultiWif();
  }

  async fromId(id: string): Promise<void> {
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
    )
      throw new Error("invalid wallet ID");
    await this.fromPublicKey(publicKey, undefined, this.network);
  }

  async import(password: string, encrypted: string): Promise<void> {
    const { data } = await base58check.decode(encrypted);
    const decrypted = await decrypt(password, data);
    await this.fromMultiWif(decrypted);
  }

  async export(password: string): Promise<string> {
    return base58check.encode(await encrypt(password, await this.toMultiWif()));
  }

  async lock(password: string): Promise<void> {
    // todo redefine hdnode
    this.#encrypted = await this.export(password);
    this.locked = true;
  }

  async unlock(password: string): Promise<void> {
    const { data } = await base58check.decode(this.#encrypted);

    await decrypt(password, data);
    this.locked = false;
  }

  async fromMultiWif(encoded: string): Promise<void> {
    const { version, codec, privateKey } = await multiWif.decode(encoded);
    const supportedNetworks: network[] = Object.values(networks);
    this.network = supportedNetworks.reduce<network>((selected, candidate) => {
      if (candidate.multiCodec === codec) return candidate;
      if (candidate.testnet?.multiCodec === codec) return candidate.testnet;
      return selected;
    }, networks.leofcoin);

    if (version !== this.network.version) throw new Error("invalid version");
    await this.fromPrivateKey(privateKey, undefined, this.network);
  }

  toMultiWif(): Promise<string> {
    const privateKey = this.privateKey;
    if (!privateKey) throw new TypeError("Missing private key");
    return multiWif.encode(
      this.network.version,
      this.network.multiCodec,
      privateKey,
    );
  }

  sign(hash: Uint8Array): Promise<Uint8Array> {
    const privateKey = this.privateKey;
    if (!privateKey) throw new TypeError("Missing private key");
    return new MultiSignature(this.version, this.network.multiCodec).sign(
      hash,
      privateKey,
    );
  }

  verify(multiSignature: Uint8Array, hash: Uint8Array): Promise<boolean> {
    const publicKey = this.publicKey;
    return new MultiSignature(this.version, this.network.multiCodec).verify(
      multiSignature,
      hash,
      publicKey.length === 33 ? publicKey.slice(1) : publicKey,
    );
  }
}

export { MultiHDNode as default };
