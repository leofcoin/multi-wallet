import MultiWallet from '../exports/index.js'
import { PqWallet } from '../exports/index.js'

declare const wallet: MultiWallet
declare const encoded: string
declare const pqWallet: PqWallet
const account = wallet.hdnode.fromBase58(encoded, wallet.network)
const pqAddress: Promise<string> = pqWallet.address
const generatedMnemonic: Promise<string> = wallet.generate('test BIP39 passphrase')
// @ts-expect-error Mnemonic generation requires an explicit passphrase.
wallet.generate()
// @ts-expect-error Mnemonic recovery requires an explicit passphrase.
wallet.recover(encoded)
void account
void pqAddress
void generatedMnemonic
