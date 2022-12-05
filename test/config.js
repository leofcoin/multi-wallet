const defaultConfig = {
  mnemonic: 'toss raccoon life category million canvas clip insect such announce control zero dignity chronic illegal fit around erode toy great forward design album attract inner cement bar purpose winter host load middle mad candy fury rail become spirit weather curious wet bring slide action differ tube album',
  hash: Buffer.alloc(32, 1)
}

export default {
  // bitcoin: {
  //   ...defaultConfig,
  // 	bs58: 'xprv9s21ZrQH143K38o2RFVY3j9rFY1kJDLaAuQBqRUTz8R3XE8eFL6ahdQLf4BSRnyHaoa2MSn99vzzHRpUN6ruF2ezM12moFvtfUAhaK5LKL5',
  // 	multiWIF: '11xprv9s21ZrQH143K38o2RFVY3j9rFY1kJDLaAuQBqRUTz8R3XE8eFL6ahdQLf4BSRnyHaoa2MSn99vzzHRpUN6ruF2ezM12moFvtfUAhaM84xTq',
  // 	publicKey: '030ae5bc1afa5e2d94d5e7cb39157648cf57c38f8b26378b81162ae07197b78764',
  // 	signature: '11qRcGgNth7wkFibctEJzAX2mJzx5r6f4GdE3bjosgFj3ZnpvDoi8vkfnSHEojLn4zc5XwkrkaTPFShxbxkEagYa6',
  // 	address: '16QWx1pftDPH55fWCQUi36oJDVQbEHzom',
  // 	encrypted: 'U2FsdGVkX19pTdzjkePfwuWFHVmPbYwKKwIY2iOnXnYVI5vzEPQBSRSd1z/qi3S+ViEV/Dl+6a+Z53nRcbjydyxu0DXTqkHF5wSmq6bg2qrkZOeU2EUCni2Zku8XmbyA8kY9sEMbLNAkLQPeKs29mzskI5jSx92emaH+LpFVlPmdIyErtBMD7kwUoVp2XxZX'
  // },
  leofcoin: {
    ...defaultConfig,
  	bs58: '5BycwBHaGerBsZZjFYTsMxEH7W8mcdPrVk34FRCbN5TkmnVmUqkRBs2YC3m3urJ7Pk81Em4qk2XKAo1QF4itSWjXs7G1DfrJJWA29vf9De5uZM1w',
  	multiWIF: '1EyinruShNm71XE1Z8NF6nczwRViYwabkk8XK7jMZ9XAaNN8oxtoe9iF4k1vsnfL1tgGrCi19KxnteRvPDBB45pt29MhaiBs8f1kz5DTfzbuacvpKuas',
  	publicKey: '024e439b2a1c1bac6cb0aab661762eadf5fa006405233a1c80650cf077056c72da',
  	signature: '12KMWrmjBDe21fsTDpQxn8WLqeZdxVXrdz23TYRANyYTjQUPfvBXgc5ykB7abz7TSC7aeyFtWyBxUvSAWGndQ5Fm5ntE',
  	address: '5UxWE1jKYxSNF67wbMCGhGmGVuAQpzcdYKibSjkwZy8RdfGriT',
  	encrypted: {
      key: 'a2fec968ca0543d125835e07f5a71a7fd046dbdc0b27e8137430fdecdae4fd74',
      iv: '2de96aaa748eadfd56a514fb004f669b',
      cipher: '42169c866bb9577b86f8c33cae402573ae2ec880a6889d85422a050ed0800a753bb286b38cdc52b2003745b8fb4c44775e9b41ce59cff6104b7d072a2b90f6bd4749bd72f1240485e56ab8b60e079fd227153f51b058c185d67fb854bf75632fca7debf6d1d6b65160d736535e15983addad214d6df51d01a854c4932b4e1b6f'
    }
  },
  'leofcoin:olivia': {
    ...defaultConfig,
  	bs58: '5BycwBHaGerBsZZjFYTsMxEH7W8mcdPrVk34FRCbN5TkmnVmUqkRBs2YC3m3urJ7Pk81Em4qk2XKAo1QF4itSWjXs7G1DfrJJWA29vf9De5uZM1w',
  	multiWIF: '1EyinruShNm71XE1Z8NF6nczwRViYwabkk8XK7jMZ9XAaNN8oxtoe9iF4k1vsnfL1tgGrCi19KxnteRvPDBB45pt29MhaiBs8f1kz5DTfzbuacvpKuas',
  	publicKey: '024e439b2a1c1bac6cb0aab661762eadf5fa006405233a1c80650cf077056c72da',
  	signature: '12KMWrmjBDe21fsTDpQxn8WLqeZdxVXrdz23TYRANyYTjQUPfvBXgc5ykB7abz7TSC7aeyFtWyBxUvSAWGndQ5Fm5ntE',
  	address: '5UxWE1jKYxSNF67wbMCGhGmGVuAQpzcdYKibSjkwZy8RdfGriT',
  	encrypted: {
      key: '521461d00b9f2c053d3078c7dbdf0a1b8c565c9046df50318759c5a77a14c2ab',
      iv: '509c21f50b8e6f41f3facc684f43e026',
      cipher: '86113b311650b992a0bacce303f451a5b1088e6bdac11a9012118961cb538db16f0f952109420e526aace36a09d8756ed6d185474e8048cdc9e3d4fb6441bb7c1cf5e1e5ccc6d6c08135329246e40dc02c3749bcdb69aed3e3bc2de85545545415b0d185708e5360db48c610b21897e0116cb9af09b5b06b5b4363e841a0ab72'
    }
  },
  ethereum: {
    ...defaultConfig,
    bs58: 'xprv9s21ZrQH143K3NswZZYC5qTKQNe6cMk8L1GtX2jBV8qYmaJztLr5CPPzytEDW79rBgKBUUtUtqb8LN29CMf6UKU2s8RPsitZWW8mQYkxp8Q',
    multiWIF: '1F3rcHQfLnBJNa1nxNSAtF3vCEVStVCSanp6Fi5CrtKBMSoxRR3nkCcsp4Fq7HKsvTUncBLjbJERZo625UnX8CRPegkv9N6dtrPsJP9NBxXVNUYmaML7',
    publicKey: '03acd9b3ba9cc617063fb2ed4a89ffbf1c65206667fbff046f5ea9a2668111c69d',
    signature: '12Kk3qFCBGDmqDxWkNyZMb1Y8cDXazospkncBQeRfJ4gs9XZjbW5mpNtfEi2ByJYcPhnGat7ppV23EZ8SeJ6Do2qrqCC',
    address: '0x83c6ef5365a0e4c89a8e171d63b4ce2a78c02afd',
    encrypted: {
      key: '6421b11aa3ddd6afa7a302d2979b4d640af3a1e5e2a8c765d9a769d2a3a490a7',
      iv: '7fb107116e92172bc299b4552bd9d019',
      cipher: 'e73d4eb5a8cdad74f89a22af6c11a8de57b7e46ab99ad48327b37a5e0aef4ccfb02e786cdeb8d378ae6242a6291840ff05162d3c104d8ad613fb7e754358f95be1b1f99fbdee8e257c9ff1d38911afd7194f172b79c86d6089d42f789d227995479383a2233c99fbb7c6b27651be287e392c7b77ed712fa57e4b995fc01787c4'
    }
  }
  // 'ethereum:kovan': {
  //   ...defaultConfig,
  //   multiWIF: '1F3rcHQfLnBJNa1nxNSAtGHAo9FWo1QwSFvDy1AXN873LdTnQWXV37CfkaDPbd3poiqGXRX5o1BotBebvh2dLGiZxf65fDjJC9V7LR68MSCisEbLGot4',
  //   bs58: 'xprv9s21ZrQH143K4c8YUKc6c3xAsUmouT4dZo8shgZAacXqgA6wQJQZY7LtFEi8kHW3tdhVs3UL75hLQfCTAgpcKx8LADfRufeizBNGAaf3RZm',
  //   publicKey: '027d0711e03fd2f64afe5b797c802cc90d82750bd40ff3863684e738feed812d9a',
  //   signature: '12Kk7N6aFmD6w4wthG7BHJfnsnzVsARVUYorDwfuqE6G5AFjJTcaRHhJqNetjKkD5NH2pk2MfGqaBzGhcbZWZj354C5G',
  //   address: 'd9faf75006454201794da69f9793c4a7a0fbd6eb',
  //   encrypted: 'U2FsdGVkX192SaXvyUE7iqT43IxelMWxSZo7rgPxuCoX9uBynrigtBzKKC9KkTa5lthMMoSv3ugSDGvwU4KuwxmPPM0RJ73G4iZd73MrvGh0pQTICxSAk306J1LUk75eYkQhTw7uOKWnYBG5YvqZaefBnGVVayM3PCDqObNf6AQDxBOvRYhVnFdqildXtpbM'
  // }
}
