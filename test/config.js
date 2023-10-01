const defaultConfig = {
  mnemonic: 'fame vacuum enter address sweet entire anxiety ceiling symptom crowd rebuild interest expose chef frown charge year worth state tunnel valid crack very abandon',
  hash: Buffer.alloc(32, 1),
  id: 'oeQvcdmYGuEJFM1qoFpyEg5DK8km4hZzXocrZm43h6ag516WqHUnBMoDb',
  bs58: '8Z2pzsENgFWWQZrLUJ5RiTjkXGgycgvhoe1Etc6gJvucCa8eEiJbLrw4hCH8rVkKi1j3F6tNfWEFo3qrGFJR8ZAyPgKeEKMfTgQD4JQoSJmNjLZMYZYJW7Fy8w2',
  multiWIF: 'n7xap9czUWhSnRUst6ozkjKo7f4Em7FoL3U58N8xjDaiHiDvfoAG',
  signature: '12KMX7SbhBaPdM8HTLZoCmhBXvm8p6ackiwG4tzgc6TazFjFfqpgwFAPBNaE4tjoBqWFkTupGkmrbPqomhicfKjsyWU2',
  address: 'YTqzHv8wH5u3JhPKeYhRmnJfojAu4FnXminDYkCfvXrP5PMwLs3W4',  	
  encrypted: '33tQRKcS8UhJSPCY7Ujebj8phq9oGdS91fi17FVfYZAkAhbupuUVqskVRqULCUrmiz9jcDZTcjUEvoGN7pe7dtyjjy6WxUQJR8aXkFLXV8z7MkWLYUxnt3crpWHqPfMyJP8TuFv5LgQhNcD7SR3p5kpa'
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
    encrypted: '33tQRKcFAQBADix9845paFbBxNWV2M7mKZFboJK8q2Spi5ebeSWk1X5EM1vZugbpCbqYrkipr2rLDTddwvVhFQrSRKVNQ9B7S3GhZ1B59B49ivJomuTCwPEGYnTPdzNMj5rEgNKUCtMcuGpa6PVgqZHW'
  },
  ethereum: {
    ...defaultConfig,
    bs58: '2iF1MDW8JiZjT8ApgGEB5WC74NUDzsuGsPhs3xur2UUSuDZQJrDG6bCFv58j8jnNkZMVXwcc6i23uRGPMEuQDFqUpLo9NeUEqZUZbp8yVVFnuJiGsikonwHGMp',
    multiWIF: 'n7xap9eJXHnKrMvT8BaimqnjGaW8HcbKJUCoqeDAYFmxdXYQseAt',
    signature: '12Kk4Wt5D5eQmX9i75wBvMZjBo4X9yW6JjD8z9aW8y4grHGA5i4gX85TgxoqAcZBKLTsZA4LoqNCVvbWabum8wbxWYuG',
    address: '0x12e1e9e36ece772fe2fe913e0c57e4080ba65163',
    encrypted: '33tQRKcVXEfF4DAhgH5sRD3QdidrNsuK9JFkQkyWn6WU6d14bHAT8MYwCPoffbX2ufkCBYe1p6KpcWp86VnBoH7xKHGnhNY46Th6AgH9H8h9k6Zf3jrDv7JUVKxyTK84WwUDAMbPrLZ8msWUczZ2KC5o'
  },
  'ethereum:kovan': {
    ...defaultConfig,
    multiWIF: 'n7xap9eJXHnKrMvT8BaimqnjGaW8HcbKJUCoqeDAYFmxdXYQseAt',
    bs58: '2iF1MDW8JiZjT8ApgGEB5WC74NUDzsuGsPhs3xur2UUSuDZQJrDG6bCFv58j8jnNkZMVXwcc6i23uRGPMEuQDFqUpLo9NeUEqZUZbp8yVVFnuJiGsikonwHGMp',
    publicKey: '027d0711e03fd2f64afe5b797c802cc90d82750bd40ff3863684e738feed812d9a',
    signature: '12Kk7PNBVx7pHwFBjdCUkcz2sx3V9oJxRcNeXHi1RfF7V3JnBozTzY7rh1vz7qLTbPXS1DGs6s4hEMC8ztzFRqkcfKKx',
    address: '0xb3db319f241bb64c18424be9b91f14b8a1eea620',
    encrypted: '33tQRKccjuUZbN2NEUFuduQKiRyUA8HSJh4LscVg6gfKRdCWyQLLk5P4C93KWv4Lw7wEJxGzWVJs4gyKfTXiURZqB89GFppGVpTP4FFTRtaoAxfZXvfKTELoaMkGp6ENgCwWevXAkzNBaT35qMpHiUs4'
  }
}
