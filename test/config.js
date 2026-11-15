const defaultConfig = {
  hash: Buffer.alloc(32, 1),
  id: 'oeQvcdmYGuEJFM1qoFpyEg5DK8km4hZzXocrZm43h6ag516WqHUnBMoDb',
  bs58: '8Z2pzsENgFWWQZrLUJ5RiTjkXGgycgvhoe1Etc6gJvucCa8eEiJbLrw4hCH8rVkKi1j3F6tNfWEFo3qrGFJR8ZAyPgKeEKMfTgQD4JQoSJmNjLZMYZYJW7Fy8w2',
  multiWIF: '22AH9RHAxUNJuo1gju2nL9YoezgDXgRj5U71t3cjXiRCM6dCkqogfgWKnWCS2SZ1kmdp1q7j3iVcrSFXhMLsHZs2rrRwJqFxXj',
  address: 'YTqyccgartsa5yZ9CTKfg5jAiSgBNpiXMsucefqfXbL7udhCSSdp3',
};

export default {
  // bitcoin: {
  //   ...defaultConfig,
  // 	bs58: '2iF1MDW8JiZjT8ApgGEB5WC74kUU8S3nAKggB79ciHh5H6SxhrzhvJpwDxrEHE7yA1eiYsBDR8EV3TfMoP13inL6dLN2RmV7D34C1kd3sXkRCvPddzPHQB9vKD',
  // 	multiWIF: '3KKwBbkRXZPJW4gXDqvhgQhL1hjhMXiyKg63x3L6S3TykWC2EL',
  // 	signature: '113YRRW9wuMKCwKtc6JVwPyjNVe3zkrhdGdtgz2SKWqtbMVjgR2QecjAtRxzSoVRypsjSSKys7uxY4yo7ZyunGXoKm',
  // 	address: '16QWx1pftDPH55fWCQUi36oJDVQbEHzom',
  // 	encrypted: '76wovGfK4uoFmvPpuEJnLSyAJNk69SEm7urMZNoftj3kqKH27pQzedBXkfczx6x4RL7BVdRoExvEkuD75jWc4fBrQympuDL5NnVg6A1sv9twKBscGAxvD77cnumoPGBtGztjtQoMfhXKLvfg6rvBp'
  // },
  leofcoin: {
    ...defaultConfig,
  },
  'leofcoin:peach': {
    ...defaultConfig,
  },
  ethereum: {
    ...defaultConfig,
    bs58: '2iF1MDW8JiZjT8ApgGEB5WC74NUDzsuGsPhs3xur2UUSuDZQJrDG6bCFv58j8jnNkZMVXwcc6i23uRGPMEuQDFqUpLo9NeUEqZUZbp8yVVFnuJiGsikonwHGMp',
    multiWIF: '22AH9RHCgBebR1SHSmMNnuSDZZFmuUoPFF4nksFmapuSkAZuhSrreNnEwNjGssPuPCco1M54Eyb1kvbJ22TB2S6ms8vQZExnv5',
    address: '0x4998d3437d43303c1b0e7fc215c68468e8d980d9',
  },
  'ethereum:kovan': {
    ...defaultConfig,
    multiWIF: '22AH9RHCgBebR1SHSmMNnuSDZZFmuUoPFF4nksFmapuSkAZuhSrreNnEwNjGssPuPCco1M54Eyb1kvbJ22TB2S6ms8vQZExnv5',
    bs58: '2iF1MDW8JiZjT8ApgGEB5WC74NUDzsuGsPhs3xur2UUSuDZQJrDG6bCFv58j8jnNkZMVXwcc6i23uRGPMEuQDFqUpLo9NeUEqZUZbp8yVVFnuJiGsikonwHGMp',
    publicKey:
      '027d0711e03fd2f64afe5b797c802cc90d82750bd40ff3863684e738feed812d9a',
    address: '0x4998d3437d43303c1b0e7fc215c68468e8d980d9',
  },
};
