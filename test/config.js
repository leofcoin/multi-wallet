const defaultConfig = {
  mnemonic: 'toss raccoon life category million canvas clip insect such announce control zero dignity chronic illegal fit around erode toy great forward design album attract inner cement bar purpose winter host load middle mad candy fury rail become spirit weather curious wet bring slide action differ tube album',
  hash: Buffer.alloc(32, 1),
  id: 'oeQvcdmY4LE11cE6KrCajx6sPLRV94LXScim7ENz82VxunTuAztBgDRDU',
  bs58: '8Z2pzsENgFWWQZrLUJ5RiTjkXGamhiTeCgJjxkiNRDTMJu5EEsCuPRCXtp9bh3ukfGL1BaEFGEpjuYLVu1yxVeLRLYMn9FcN83na2Zr44tDXuzj4RLxkiC7tR6Z',
  multiWIF: '2sczXZUmDC32x8PnysZuvSv7ARsVbPv9VxrUxbyEaDzY2b6PbZsyNFn6RzM9feoZgFo2vxL1Y6UproyKZVmonveXxbC7755eFxfhmNCFqfKTTRaQq15zwwc3CDaGX13Tw7Z16VGpU',
  publicKey: new Uint8Array('2,53,57,66,193,214,41,11,78,33,170,253,211,143,80,84,106,131,43,188,69,4,228,211,166,41,32,28,178,246,111,218,67'.split(',')),
  signature: '12KMX1nrpxZ8Fn3ZhbDbQHHAoFQFDkzDy9ezPsAkon7o2iurgTe5uK2Trqdb4RRrEKyLNYLocHQMfL9SapxGcHnW3rFV',
  address: 'YTqwj1jAyFPMvb6xPTzxxbPZkUevFrTsp18rvMgekmuAPyZAWnPcP',  	
  encrypted: {
    key: '76c84536930470e4e1fd91cddab883b396601a0988571c32078ff2f0fe364146',
    iv: '2f0ffc6ac7aef6734e447c76eb262fbd',
    cipher: 'c83a6a7397c60a3bab55319f2fe58382f892dcdde7e20177a8cd6c0b5b6098d6d0786cc9d180bb14af15d4e8abeb7f85c91ba4d339d6035f3db527fdf72b80b64aba8ec1177331ef195b15c1dd43577b9d108a9cced7bfe4e906fa32bc9e3717ca417265d80bd348847711d99a3961eafbdf7f851799f8f0418f6b7e82a0c2849bc24f8800713d7376ac3a2611fac4bd'
  }
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
  },
  'leofcoin:olivia': {
    ...defaultConfig,
  },
  ethereum: {
    ...defaultConfig,
    bs58: '2iF1MDW8JiZjT8ApgGEB5WC74GGK2QqfuhCwCabxK2DZEA9QTkXJerfTXwbZguDL1AKS1HVCqJWAPuv27vSmJRHRgNw4JuAuCwqXsFPc4wQyZUR9f9D1s2YYDm',
    multiWIF: 'RcLqAAv4fkZVin1hAH6eunWo3ZUK3pR3jiPgKEkhahBchRQac8o8szo2bPDEU8uAUXJtXAEfuNwfWwTnErxZBvH8UtK6djWjNfYtshxAiuzNvmVvbbd96QiH8kvcvvoP5xPWsBs',
    publicKey: new Uint8Array('3,232,96,233,202,51,85,204,102,178,211,54,203,59,234,50,191,51,135,122,204,173,140,96,10,62,98,23,126,84,200,225,174'.split(',')),
    signature: '12Kk5H6gRfBwHuKinC3rM2z8UVf1HP9TuoSpsxPJeFdK9MjrSeRFgWZfrnQ2kvo5yRhNFwAMzPQGCoP5yTAYb66guiH6',
    address: '0x3cd1bec104f7a81d6c5f6e9563d7a689f039dd25',
    encrypted: {
      key: '3da2bd49f4797e326b32ceab52690771e8c7fbd0886a04839683f8223d6088c4',
      iv: '45012a5989810d7b73f86c68bb7d6382',
      cipher: '02b8b6ecb2e777837612448f3636446b9781aeb4e1dbe22225050a4f3f1983cbd3d675af1db7e4e67212d07fab4651bc7f8537117b43cb59d45fce38cdffed535ed63b3d331f828bec76d095a800cc358f7ab9bab667696f95fc343937233b3ef1a2a076ba0c380c553b4fc9af7fbb07304cdafb884f5d2342d72e033585d38da64cdcd452e7d7aaec60250808e05026'
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
