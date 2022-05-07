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
  	encrypted: 'U2FsdGVkX1/qKm5bGgyFHXQlLEdO1EhmajJcQrUD9rKkleDloaIVM1LqdWptiLUiBxQy61RsO1uYi0Ef9uF0pgk7S4ECJ1ggelYmNaFRUsVPtkNH2bTP3XlHgdFRzZVr9BLIppqLHxZmVBOouJQXlGNyJPguHSp/VEklPVzXcaUFd0OnRGQuWx0ki36s0hc1'
  },
  'leofcoin:olivia': {
    ...defaultConfig,
  	bs58: '5BycwBHaGerBsZZjFYDnSovETU2U9UZE9RtehG6ifPrW4HVLybQEqE1nhZ14FXU4cfopgAC6auVCq46p71ngmgUjfsyCB9iugRh4V5dB9otdT5mC',
  	multiWIF: '1EyinruShNm71XE1Z8NF6nNv2HBftuUJHbHtxoawzzRHsgkt6TtP8uN4i71BPHuLMZrE58Ppaj63jXPp3UGav2tgMK6uPUu468tNMzkW19ZwWndJfRoS',
  	publicKey: '030ae5bc1afa5e2d94d5e7cb39157648cf57c38f8b26378b81162ae07197b78764',
  	signature: '12KMWetfqWcumr5Ly9EhTgpyiZsbYZAhG5wTDUJpyJuhccbSD6NPJRY3bQfk1BuRYeZTPBcXrxToamGk8J2J5R11kxut',
  	address: '6v2tYh2TismPrQbvaig2zbfDuNQgEP9KpcbsMhCrs3z7VPTBcK',
  	encrypted: 'U2FsdGVkX19QR/NhjKJWczMskZxQuM5oAnQNkhsCSnG4Ah0EjVzDmpqJn82EVRbShhUBX2sPSaiRd3N1vgFRDdQJ65hnZwtyRM/5pOjc4ffORJ5tPHx+RvHXWNeKrWUKd6Sb0+dDsI/o3MrLnhbzGHsmwE8vrCXHrA4+uB7QSv27wSm/LVPvSvCfOjqPWHjq'
  },
  ethereum: {
    ...defaultConfig,
    bs58: 'xprv9s21ZrQH143K38o2RFVY3j9rFY1kJDLaAuQBqRUTz8R3XE8eFL6ahdQLf4BSRnyHaoa2MSn99vzzHRpUN6ruF2ezM12moFvtfUAhaK5LKL5',
    multiWIF: '1F3rcHQfLnBJNa1nxNSAtEoqH6BQET697dyTuPvoJjDJemChhv3NExGhTRF5cnZtG8ejq72Z2hMgQg3ujjsvz9VByrW7x8oprLGUgJgQX7VXJeHdJY48',
    publicKey: '03388ac1b640ffd5a9af92ef46768e9db2462d80063f5c7adfcc0836e9d746f11a',
    signature: '12Kk6QmHYXudvpHnG6fBr6MbTiGP9L1fEvAo8W6GqASQVAJ8jWjt9zKPAPL74omNy5o8Woz7gCRjYQKSXwkDkXbW3s5R',
    address: '0x073f3fe337d9c82ee33b1ee44ac276012ac25373',
    encrypted: 'U2FsdGVkX184kJ0fy8Kd6X8cci9M/OaLHX0Ja9YgQTQ+Wdlbx+x8e4+D6axMYpm/o5BNYm/WDexERMU8HFRLG0Z6Ify6xt/Sejtn1gKo2SfO00cv3eNSgDkhkKE0wZpjxhnsUVeJRLhugZKfMuAAUWNyWnMZzjamWQwVpkeNPWI3lWsHFlpAi3602gcADBBU'
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
