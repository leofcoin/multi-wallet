import MultiWallet from '../exports/index.js'
import { PqWallet } from '../exports/index.js'

declare const wallet: MultiWallet
declare const encoded: string
declare const pqWallet: PqWallet
const account = wallet.hdnode.fromBase58(encoded, wallet.network)
const pqAddress: Promise<string> = pqWallet.address
void account
void pqAddress
