import MultiHDNode from './multi-node.js';
import HDAccount from './hd-account.js';
declare class MultiWallet extends MultiHDNode {
    constructor(network: any, hdnode?: MultiWallet);
    get id(): any;
    get multiWIF(): Promise<string>;
    get neutered(): HDAccount;
    /**
     * @param {number} account - account to return chain for
     * @return internal(addressIndex), external(addressIndex)
     */
    account(index: any): HDAccount;
    fromAccount(privateKey: Uint8Array, depth: number, network: any): Promise<HDAccount>;
    /**
     * m / purpose' / coin_type' / account' / change / aadress_index
     *
     * see https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
     */
    derivePath(path: any): Promise<MultiWallet>;
    derive(index: any): Promise<MultiWallet>;
}
export { MultiWallet as default };
