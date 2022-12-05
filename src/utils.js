import secp256k1 from 'secp256k1'
import { createKeccak } from 'hash-wasm'

const { publicKeyConvert } = secp256k1

export const publicKeyToEthereumAddress = async (publicKeyBuffer) => {
  let uncompressed = publicKeyConvert(publicKeyBuffer, false)
  const hasher = await createKeccak(256)
  hasher.update(uncompressed)

  const hash = hasher.digest()
  return `0x${hash.slice(-40).toString('hex')}`
}

export const publicKeyToAddress = async (publicKeyBuffer, target = 'ethereum') => {
  // let uncompressed = publicKeyConvert(publicKeyBuffer, false)
  // const hash = createKeccakHash('keccak256').update(Buffer.from(uncompressed.slice(1))).digest()
  // return `0x${hash.slice(-20).toString('hex')}`
}