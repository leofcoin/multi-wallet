import randombytes from 'randombytes'
SUBTLE_IMPORT

const generateAesKey = async (length = 256) => {
  const key = await subtle.generateKey({
    name: 'AES-CBC',
    length
  }, true, ['encrypt', 'decrypt']);

  return key;
}

const importAesKey = async (exported, format = 'raw', length = 256) => {
  return await subtle.importKey(format, exported, {
    name: 'AES-CBC',
    length
  }, true, ['encrypt', 'decrypt'])
}

const exportAesKey = async (key, format = 'raw') => {
  return await subtle.exportKey(format, key)
}

const encryptAes = async (uint8Array, key, iv) => subtle.encrypt({
    name: 'AES-CBC',
    iv,
  }, key, uint8Array)

const decryptAes = async (uint8Array, key, iv) => subtle.decrypt({
    name: 'AES-CBC',
    iv,
  }, key, uint8Array)

const uint8ArrayToHex = uint8Array =>
  [...uint8Array].map(x => x.toString(16).padStart(2, '0')).join('')

const arrayBufferToHex = arrayBuffer =>
  uint8ArrayToHex(new Uint8Array(arrayBuffer))

const hexToUint8Array = hex =>
  new Uint8Array(hex.match(/[\da-f]{2}/gi).map(x => parseInt(x, 16)))

export const encrypt = async string => {
  const ec = new TextEncoder();
  const key = await generateAesKey();
  const iv = await randombytes(16);

  const ciphertext = await encryptAes(ec.encode(string), key, iv)
  const exported = await exportAesKey(key)

  return {
    key: arrayBufferToHex(exported),
    iv: iv.toString('hex'),
    cipher: arrayBufferToHex(ciphertext)
  }
}

export const decrypt = async (cipher, key, iv) => {
  if (!key.type) key = await importAesKey(hexToUint8Array(key))
  cipher = new Uint8Array(hexToUint8Array(cipher))
  iv = new Uint8Array(hexToUint8Array(iv))

  const dec = new TextDecoder();
  const plaintext = await subtle.decrypt({
   name: 'AES-CBC',
   iv,
  }, key, cipher);

  return dec.decode(plaintext);
};
