const defaultConfig = {
  mnemonic: 'fame vacuum enter address sweet entire anxiety ceiling symptom crowd rebuild interest expose chef frown charge year worth state tunnel valid crack very abandon',
  hash: Buffer.alloc(32, 1),
  id: 'oeQvcdmYGuEJFM1qoFpyEg5DK8km4hZzXocrZm43h6ag516WqHUnBMoDb',
  bs58: '8Z2pzsENgFWWQZrLUJ5RiTjkXH4yrpUrJvwDhjEv5cippx1Xo7KNngehNWArMeEfJRBLU7owGpeUEBtFEhSWn4hU1VKD7NUgL3sngiMHWgosMeB2uKovyZn8QL5',
  multiWIF: 'n7xap9czUWhSnRUst6ozkjKo7f4Em7FoL3U58N8xjDaiHiDvfoAG',
  signature: '12KMWV9azTnSJoWvLpRY4s4rDbzEDLDfKiP8Ud3VnSnVojf8p6wAi9tbL5UVbvUXsQt1cMfDqmSUSR572bz3Ka1PfQMm',
  address: 'YTqz6xb5emRgGFhjoTSQVfhKL2mfeZ6eks3git4HVDJty9aWeZCwg',  	
  encrypted: '33tQRKcHfQZLDxPPKYWCxMUh39mt6KGXYZuPw5ZPLLffTYY2D7xRqe8mLRUmwWSZLGQG9ubJX4evZuuYYdYqwoYEhsvjW8ricoLG1YeSuz5RXyNq2SqczcB14rg5otcTHA4Y6HF1TBFuxVN4B99WRpXh'
}

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
    bs58: '2iF1MDW8JiZjT8ApgGEB5WC74kUU8S3nAKggB79ciHh5H6SxhrzhvJpwDxrEHE7yA1eiYsBDR8EV3TfMoP13inL6dLN2RmV7D34C1kd3sXkRCvPddzPHQB9vKD',
    multiWIF: 'n7xap9eJXHnKrMvT8BaimqnjGaW8HcbKJUCoqeDAYFmxdXYQseAt',
    signature: '12Kk4WqsrfSXYfYUJ2q4xNitmfLdkeKPyp427XFVMvYb79NmCBb6j3rP3WQQC11EWdAS84tnZhTBTsV4tC6k7f9vdC9M',
    address: '0x1fc84aac3fcd9a183f65d8d62dd5427b497df8d8',
    encrypted: '33tQRKcVXEfF4DAhgH5sRD3QdidrNsuK9JFkQkyWn6WU6d14bHAT8MYwCPoffbX2ufkCBYe1p6KpcWp86VnBoH7xKHGnhNY46Th6AgH9H8h9k6Zf3jrDv7JUVKxyTK84WwUDAMbPrLZ8msWUczZ2KC5o'
  },
  'ethereum:kovan': {
    ...defaultConfig,
    multiWIF: 'n7xap9eJXHnKrMvT8BaimqnjGaW8HcbKJUCoqeDAYFmxdXYQseAt',
    bs58: '2iF1MDW8JiZjT8ApgGEB5WC74kUU8S3nAKggB79ciHh5H6SxhrzhvJpwDxrEHE7yA1eiYsBDR8EV3TfMoP13inL6dLN2RmV7D34C1kd3sXkRCvPddzPHQB9vKD',
    publicKey: '027d0711e03fd2f64afe5b797c802cc90d82750bd40ff3863684e738feed812d9a',
    signature: '12Kk6m5AoEKryPdpd74DciMhZdGaZ2wzzbpWw1kpc1a2JXEfL56wmSr4qiqFes5CGxuBs72GfsjK5NRSFoFg6628MDDh',
    address: '0xbd7d8adc287b3c924ce46d7507a73cab11c30e96',
    encrypted: '33tQRKccjuUZbN2NEUFuduQKiRyUA8HSJh4LscVg6gfKRdCWyQLLk5P4C93KWv4Lw7wEJxGzWVJs4gyKfTXiURZqB89GFppGVpTP4FFTRtaoAxfZXvfKTELoaMkGp6ENgCwWevXAkzNBaT35qMpHiUs4'
  }
}
