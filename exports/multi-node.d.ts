import HDWallet from './hd-wallet.js';
import { network } from './index.js';
declare class MultiHDNode extends HDWallet {
    #private;
    constructor(network: network | string, hdnode: any);
    get id(): any;
    get multiWIF(): Promise<string>;
    fromId(id: any): Promise<void>;
    import(password: any, encrypted: any): Promise<void>;
    export(password: any): Promise<any>;
    lock(password: any): Promise<void>;
    unlock(password: any): Promise<void>;
    fromMultiWif(string: any): Promise<void>;
    toMultiWif(): Promise<string>;
    sign(hash: any): any;
    verify(multiSignature: any, hash: any): any;
}
export { MultiHDNode as default };
