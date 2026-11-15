import base58check from "@vandeurenglenn/base58check";
import base58 from "@vandeurenglenn/base58";
import multiWif from "@leofcoin/multi-wif";
import HDWallet from "./hd-wallet.js";
import HdNode from "./hd-node.js";
import MultiSignature from "multi-signature";
import { BinaryReader } from "@leofcoin/binary";
import networks from "./networks.js";
import { decrypt, encrypt } from "@leofcoin/identity-utils";
import typedArraySmartConcat from "@vandeurenglenn/typed-array-smart-concat";
import typedArraySmartDeconcat from "@vandeurenglenn/typed-array-smart-deconcat";
import { assertPasswordLength } from "./password.js";
import type { network } from "./index.js";

class MultiHDNode extends HDWallet {
  #encrypted!: string | undefined;

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
    this.assertUnlocked();
    const buffer = (await base58check.decode(id)).data;
    const reader = new BinaryReader(buffer);
    const version = reader.readFrame(true);
    const publicKey = reader.readFrame(true);
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
    assertPasswordLength(password, "Wallet password");
    this.assertUnlocked();
    const { data } = await base58check.decode(encrypted);
    const decrypted = await decrypt(password, data);
    await this.fromMultiWif(decrypted);
  }

  async export(password: string): Promise<string> {
    assertPasswordLength(password, "Wallet password");
    return base58check.encode(await encrypt(password, await this.toMultiWif()));
  }

  async lock(password: string): Promise<void> {
    assertPasswordLength(password, "Wallet password");
    if (this.locked) return;
    const node = this.hdnode;
    const encrypted = await this.export(password);
    const publicNode = node.neutered;
    node.clearPrivateKey();
    this.#encrypted = encrypted;
    this.hdnode = publicNode;
    this.locked = true;
  }

  async unlock(password: string): Promise<void> {
    assertPasswordLength(password, "Wallet password");
    if (!this.locked || !this.#encrypted)
      throw new Error("Wallet is not locked");
    const { data } = await base58check.decode(this.#encrypted);
    const multiWifValue = await decrypt(password, data);
    const { network, privateKey, chainCode } =
      await this.#decodeMultiWif(multiWifValue);
    const node = new HdNode().fromPrivateKey(privateKey, chainCode, network);
    this.network = network;
    this.multiCodec = network.multiCodec;
    this.locked = false;
    this.hdnode = node;
  }

  async fromMultiWif(encoded: string): Promise<void> {
    this.assertUnlocked();
    const { network, privateKey, chainCode } =
      await this.#decodeMultiWif(encoded);
    this.assertUnlocked();
    const node = new HdNode().fromPrivateKey(privateKey, chainCode, network);
    this.network = network;
    this.multiCodec = network.multiCodec;
    this.hdnode = node;
  }

  async #decodeMultiWif(
    encoded: string,
  ): Promise<{
    network: network;
    privateKey: Uint8Array;
    chainCode: Uint8Array | undefined;
  }> {
    const frames = typedArraySmartDeconcat(base58.decode(encoded));
    if (frames.length !== 3 && frames.length !== 4)
      throw new Error("invalid MultiWIF");
    const { version, codec, privateKey } = await multiWif.decode(encoded);
    const chainCode = frames[3];
    if (chainCode && chainCode.length !== 32)
      throw new Error("invalid chain code");
    const supportedNetworks: network[] = Object.values(networks);
    const candidate = supportedNetworks.find(
      (supported) =>
        supported.multiCodec === codec ||
        supported.testnet?.multiCodec === codec,
    );
    const network =
      candidate?.multiCodec === codec ? candidate : candidate?.testnet;

    if (!network) throw new Error("invalid codec");
    if (version !== network.version) throw new Error("invalid version");
    return { network, privateKey, chainCode };
  }

  async toMultiWif(): Promise<string> {
    const privateKey = this.privateKey;
    if (!privateKey) throw new TypeError("Missing private key");
    const chainCode = this.hdnode.chainCode;
    if (chainCode && chainCode.length !== 32)
      throw new TypeError("Invalid chain code");
    const frames = [
      new TextEncoder().encode(this.network.version.toString()),
      new TextEncoder().encode(this.network.multiCodec.toString()),
      privateKey,
    ];
    if (chainCode) frames.push(chainCode);
    return base58.encode(typedArraySmartConcat(frames));
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
