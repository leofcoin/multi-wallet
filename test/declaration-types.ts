import MultiWallet from '../exports/index.js'

declare const wallet: MultiWallet
declare const encoded: string
const account = wallet.hdnode.fromBase58(encoded, wallet.network)
void account
