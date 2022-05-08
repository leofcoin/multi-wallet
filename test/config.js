const defaultConfig = {
  mnemonic: 'slice purity either try maze abstract local force dog pet mom pizza alley chapter horse evidence sense before alert approve announce milk ticket clean',
  hash: Buffer.alloc(32, 1)
}

module.exports = {
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
  	bs58: '5BycwBHaGerBsZZjFYDnSovETU2U9UZE9RtehG6ifPrW4HVLybQEqE1nhZ14FXU4cfopgAC6auVCq46p71ngmgUjfsyCB9iugRh4V5dB9otdT5mC',
  	multiWIF: '1EyinruShNm71XE1Z8NF6nNv2HBftuUJHbHtxoawzzRHsgkt6TtP8uN4i71BPHuLMZrE58Ppaj63jXPp3UGav2tgMK6uPUu468tNMzkW19ZwWndJfRoS',
  	publicKey: '030ae5bc1afa5e2d94d5e7cb39157648cf57c38f8b26378b81162ae07197b78764',
  	signature: '12KMWetfqWcumr5Ly9EhTgpyiZsbYZAhG5wTDUJpyJuhccbSD6NPJRY3bQfk1BuRYeZTPBcXrxToamGk8J2J5R11kxut',
  	address: '6v2tYh2TismPrQbvaig2zbfDuNQgEP9KpcbsMhCrs3z7VPTBcK',
  	encrypted: {
      key: '69a62729b5175e9302f62ea3cef5f778877ae5d610af20f9ed9e4811dcd27229',
      iv: '80d105de8e4887b45d1ff745a8bfc2d7',
      cipher: '016291e36c040a8bc749aed10babc1c112ccf7c58673a5c12b79afe8fa585b50a98db2eb0e1d9a374cd872762898c133e293de8e1cffdbad9d1b64688eff511a3399fe48d22e21b31527bc20fd324f1da6285c74497aace99cc5afdb86bac6ad308f31c4f1eb2219d4922a15377659b99649463260f6d8541d86774290460f11'
    }
  },
  'leofcoin:olivia': {
    ...defaultConfig,
  	bs58: '5BycwBHaGerBsZZjFYDnSovETU2U9UZE9RtehG6ifPrW4HVLybQEqE1nhZ14FXU4cfopgAC6auVCq46p71ngmgUjfsyCB9iugRh4V5dB9otdT5mC',
  	multiWIF: '1EyinruShNm71XE1Z8NF6nNv2HBftuUJHbHtxoawzzRHsgkt6TtP8uN4i71BPHuLMZrE58Ppaj63jXPp3UGav2tgMK6uPUu468tNMzkW19ZwWndJfRoS',
  	publicKey: '030ae5bc1afa5e2d94d5e7cb39157648cf57c38f8b26378b81162ae07197b78764',
  	signature: '12KMWetfqWcumr5Ly9EhTgpyiZsbYZAhG5wTDUJpyJuhccbSD6NPJRY3bQfk1BuRYeZTPBcXrxToamGk8J2J5R11kxut',
  	address: '6v2tYh2TismPrQbvaig2zbfDuNQgEP9KpcbsMhCrs3z7VPTBcK',
  	encrypted: {
      key: '2c6a3ed6aeac09fda26fc41b48d46f92c06bc12ec5fc99d90c4c8f41fe410f5c',
      iv: 'e91411a87c8465e4153c1dce918c8d00',
      cipher: 'da409bb1fe5f666f4aae92170ce097c0e616e0ba779e1c64f651abd50e24f15f3d60627cea441e443c30d2edfa1a2881865b9d28a63774637b88e97b770d3d184abd38afe4f38a4fbe731a64c00425678b9b04f5f091fdfa038fd016a55014ddbaf86399572741ae224e645689d27ec5a1f12102e1aa4e6cc3594b927e404a93'
    }
  },
  ethereum: {
    ...defaultConfig,
    bs58: 'xprv9s21ZrQH143K38o2RFVY3j9rFY1kJDLaAuQBqRUTz8R3XE8eFL6ahdQLf4BSRnyHaoa2MSn99vzzHRpUN6ruF2ezM12moFvtfUAhaK5LKL5',
    multiWIF: '1F3rcHQfLnBJNa1nxNSAtEoqH6BQET697dyTuPvoJjDJemChhv3NExGhTRF5cnZtG8ejq72Z2hMgQg3ujjsvz9VByrW7x8oprLGUgJgQX7VXJeHdJY48',
    publicKey: '03388ac1b640ffd5a9af92ef46768e9db2462d80063f5c7adfcc0836e9d746f11a',
    signature: '12Kk6QmHYXudvpHnG6fBr6MbTiGP9L1fEvAo8W6GqASQVAJ8jWjt9zKPAPL74omNy5o8Woz7gCRjYQKSXwkDkXbW3s5R',
    address: '0x073f3fe337d9c82ee33b1ee44ac276012ac25373',
    encrypted: {
      key: '431f6b685fc780227421d94aa97b845224fa798173ee00fd090917c737c89982',
      iv: '11c94b9e72dee1e6daa142acca84d375',
      cipher: '7d3234095c5a9047d9de6261c829918c8c68fc8b32f32879a0132696a5e1a9e5081afe034c52e7e49cbd6a0e7bbcf9e12d0bd061a469b24dd335db79a4328d09d07b1b0ce7ba67d45a07a4c5aa8104cbdb2083edc57cadfbd92372dae0600b4073d2f253c251fccf428b9bfec4ac9ef12fe080257bb48d019fbe51abc0ccd094'
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
