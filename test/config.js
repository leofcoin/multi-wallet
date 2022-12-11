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
  	bs58: '5BycwBHaGerBsZZjFXA8e7xFD3NB5uv6jTdadGKdVya7XwLA3EBhaXAsXrDtQf1FXEJ83BrkhQLYKdyZQK7H55WBuw7LvYxwbLJJPUCtcRKoBbbw',
  	multiWIF: '1EyinruShNm71XE1Z8NF6mKGDbDgeUp1E2emYqKsvzeCiGUVa7jCCY9XTQAGDb8AWhPQygt7wkkhr2F9Y49LDLDGei8MdY3CqY8QGuMjuY9eyQ8fkRt3',
  	publicKey: '0330b265e14fa15292af1983b4d3e56588c5180dda722279012a81d386de8700d7',
  	signature: '12KMVwUJYVp51fmQcvVMUbCehE6hfjqotNGiaAA7kEZFwthvX1gNmuo6DXkRjr3wua45LuPx8wvYTHvYgbfvKtiqar2c',
  	address: '7CgRfs8XQFRegydWpF1QepzKvuWZFnQxY8Z5NjvzbevKQHUFkW',
  	encrypted: {
      key: 'd1928fc7df38115d17276000677ad95a0f7404773bacfc9a3d75734160a6a9cd',
      iv: '84445f9faabbcd524c11daa233b614cc',
      cipher: 'f85d8446c0d15cb51812b883e4abbebd8a1059ad119260558847ae1492a8855afdb060c8831c9a723822c078f231ef00fd31f43cd536585e2b94509430be12595c486eb9b2debc9442df67eb7bee487cb77ae566789e411ef9a4cff9c7b1f99772752baf3b6144246aae327294abc70f788c2f6af226c2f5740e440e9f48aa56'
    }
  },
  'leofcoin:olivia': {
    ...defaultConfig,
  	bs58: '5BycwBHaGerBsZZjFXA8e7xFD3NB5uv6jTdadGKdVya7XwLA3EBhaXAsXrDtQf1FXEJ83BrkhQLYKdyZQK7H55WBuw7LvYxwbLJJPUCtcRKoBbbw',
  	multiWIF: '1EyinruShNm71XE1Z8NF6mKGDbDgeUp1E2emYqKsvzeCiGUVa7jCCY9XTQAGDb8AWhPQygt7wkkhr2F9Y49LDLDGei8MdY3CqY8QGuMjuY9eyQ8fkRt3',
  	publicKey: '0330b265e14fa15292af1983b4d3e56588c5180dda722279012a81d386de8700d7',
  	signature: '12KMVwUJYVp51fmQcvVMUbCehE6hfjqotNGiaAA7kEZFwthvX1gNmuo6DXkRjr3wua45LuPx8wvYTHvYgbfvKtiqar2c',
  	address: '7CgRfs8XQFRegydWpF1QepzKvuWZFnQxY8Z5NjvzbevKQHUFkW',
  	encrypted: {
      key: 'd1928fc7df38115d17276000677ad95a0f7404773bacfc9a3d75734160a6a9cd',
      iv: '84445f9faabbcd524c11daa233b614cc',
      cipher: 'f85d8446c0d15cb51812b883e4abbebd8a1059ad119260558847ae1492a8855afdb060c8831c9a723822c078f231ef00fd31f43cd536585e2b94509430be12595c486eb9b2debc9442df67eb7bee487cb77ae566789e411ef9a4cff9c7b1f99772752baf3b6144246aae327294abc70f788c2f6af226c2f5740e440e9f48aa56'
    }
  },
  ethereum: {
    ...defaultConfig,
    bs58: 'xprv9s21ZrQH143K259DjHWHd4rngttLKxGWB8K2R95wdyE7A1bPYVBQzrEVnbNLzHGecUE8rJ7djokHakQmm8K9JAojkF4ghsAo43tABpvsANa',
    multiWIF: '1F3rcHQfLnBJNa1nxNSAtDkBUQDQz2Rr45LLVRfjEjSDVLvKBZtBJb4ACiQAT5niRGBvjfWrPj2LXAuFEKkgHSonHFXaCBwybjWWbDHeRW5EmFknR728',
    publicKey: '02675b936c4c7018f8657b0b2cbb64e710de6ba12c52a9539dd640d6d144afc36b',
    signature: '12Kk4KkoN4V2QRfMN5tvBGE1Qi1LJf1Ccw75WNMqHCRnQSQLo5bm8SRQhumGk72oHH1reAqV8Kg7Xf2FGve9RFhVRNaQ',
    address: '0x82dc7f6967688eb03296807ee8395ac2050f20c9',
    encrypted: {
      key: 'b24c0f255c1a7fa55df2a251a4c9b2e4589572b31392f427bf45fed61a18ef1c',
      iv: '58083bb6dee2ad1ef5d4e8c1ad32f6a5',
      cipher: '98e9f401bbbd25f32dd946e4b8f736d110998036c992da554f4ee4e993ff2b543a4f1d22375396dda7eb2970bbd2c11fab7a8b59ad7c3b9e0a630f56bee6b22885551e4df3f6893e64fe7c8740e312947f3bd01a1152162ba93e9e42b8d2822d3bfbba565bb918b3e8a4c58ae8181a09f8ce6ecd2ee9d02ee6a9d6b436fac12a'
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
