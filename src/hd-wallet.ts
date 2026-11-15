import HdNode from './hd-node.js';
import base58check from '@vandeurenglenn/base58check';
import Mnemonic from '@leofcoin/mnemonic';
import { createKeccak } from 'hash-wasm';
import networks from './networks.js';
import type { network } from './index.js';

const isNetwork = (value: unknown): value is network =>
  typeof value === 'object' &&
  value !== null &&
  'version' in value &&
  'multiCodec' in value;

const fromNetworkString = (networkName: string): network => {
  const [name, variant] = networkName.split(':');
  if (!Object.hasOwn(networks, name)) throw new TypeError('network not found');
  let selectedNetwork: network = networks[name as keyof typeof networks];

  if (variant) {
    const variantNetwork = Reflect.get(selectedNetwork, variant);
    if (isNetwork(variantNetwork)) selectedNetwork = variantNetwork;
    selectedNetwork.coin_type = 1;
  }
  return selectedNetwork;
};

const publicKeyToEthereumAddress = async (
  publicKeyBuffer: Uint8Array,
): Promise<string> => {
  const hasher = await createKeccak(256);
  hasher.update(publicKeyBuffer);

  const hash = hasher.digest();
  return `0x${hash.slice(-40).toString()}`;
};

export default class HDWallet {
  hdnode!: HdNode;
  networkName: string | undefined;
  version: number;
  locked = false;
  network: network;
  multiCodec: number;

  get privateKey(): Uint8Array | undefined {
    return this.ifNotLocked(() => this.hdnode.privateKey);
  }

  get publicKey(): Uint8Array {
    return this.hdnode.publicKey;
  }

  async ethereumAddress(): Promise<string> {
    const address = await publicKeyToEthereumAddress(this.publicKey);
    return address;
  }

  leofcoinAddress(): Promise<string> {
    return base58check.encode(this.publicKey);
  }

  get address(): Promise<string | undefined> {
    return this.getAddressForCoin();
  }

  async getAddressForCoin(coin_type?: number): Promise<string | undefined> {
    if (coin_type === undefined) coin_type = this.network.coin_type;

    if (coin_type === 1) {
      if (this.networkName?.split(':')[0] === 'ethereum') coin_type = 60;
      if (this.networkName?.split(':')[0] === 'leofcoin') coin_type = 640;
    }
    // if (coin_type === 0) return this.bitcoinAddress
    if (coin_type === 60) return this.ethereumAddress();
    if (coin_type === 640) return this.leofcoinAddress();
    // if (coin_type === 0) return this.bitcoinAddress()
  }

  get accountAddress(): Promise<string> | undefined {
    return this.ifNotLocked(async () =>
      base58check.encode(this.hdnode.publicKey)
    );
  }

  get isTestnet(): boolean {
    return this.network.coin_type === 1;
  }

  constructor(network: string | network, hdnode?: HdNode) {
    if (typeof network === 'string') {
      this.networkName = network;
      this.network = fromNetworkString(network);
    } else {
      this.networkName = undefined;
      this.network = network;
    }

    this.multiCodec = this.network.multiCodec;
    this.version = 0x00;
    if (hdnode) this.hdnode = hdnode;
  }

  ifNotLocked<T>(fn: () => T): T | undefined {
    if (this.locked) return undefined;
    return fn();
  }

  async defineHDNode(value: HdNode): Promise<void> {
    Object.defineProperty(this, 'hdnode', {
      configurable: false,
      writable: false,
      value: await value,
    });
  }

  validateNetwork(network?: string | network): network {
    if (typeof network === 'string') return fromNetworkString(network);
    if (network) return network;
    if (this.network) return this.network;
    throw new TypeError('network not found');
  }

  async generate(
    password = '',
    network?: string | network,
  ): Promise<string> {
    const resolvedNetwork = this.validateNetwork(network);
    const mnemonic = await new Mnemonic({}).generate(512);
    const seed = await new Mnemonic({}).seedFromMnemonic(mnemonic, password, 512);
    this.hdnode = await new HdNode().fromSeed(
      new Uint8Array(seed),
      resolvedNetwork,
    );
    return mnemonic;
  }

  /**
   * recover using mnemonic (recovery word list)
   */
  async recover(
    mnemonic: string,
    password = '',
    network?: string | network,
  ): Promise<void> {
    const resolvedNetwork = this.validateNetwork(network);
    const seed = await new Mnemonic({}).seedFromMnemonic(mnemonic, password, 512);
    this.hdnode = await new HdNode().fromSeed(
      new Uint8Array(seed),
      resolvedNetwork,
    );
  }

  async load(encoded: string, network?: string | network): Promise<void> {
    this.hdnode = await new HdNode().fromBase58(
      encoded,
      this.validateNetwork(network),
    );
  }

  save(): Promise<string> {
    return this.hdnode.toBase58();
  }

  async fromAddress(
    address: string | readonly number[] | Uint8Array,
    chainCode: Uint8Array | undefined,
    network?: string | network,
  ): Promise<void> {
    const publicKey = typeof address === 'string'
      ? (await base58check.decode(address)).data
      : new Uint8Array(address);
    this.hdnode = await new HdNode().fromPublicKey(
      publicKey,
      chainCode ?? publicKey.slice(1),
      this.validateNetwork(network),
    );
  }

  async fromPublicKey(
    publicKey: Uint8Array,
    chainCode: Uint8Array | undefined,
    network: string | network,
  ): Promise<this> {
    this.hdnode = await new HdNode().fromPublicKey(
      publicKey,
      chainCode ?? publicKey.slice(1),
      this.validateNetwork(network),
    );
    return this;
  }

  async fromPrivateKey(
    privateKey: Uint8Array,
    chainCode?: Uint8Array,
    network?: string | network,
  ): Promise<void> {
    this.hdnode = await new HdNode().fromPrivateKey(
      privateKey,
      chainCode,
      this.validateNetwork(network),
    );
  }
}
