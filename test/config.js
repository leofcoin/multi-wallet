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
  	bs58: '8Z2pzsENgFWWQZrLUJ5RiTjkXHEjqrWGmfZKyZWsjcTNu2A7m3B31phdPcQmCdL59JQDPHnar6BnDuHijQrGCTnXc1ybTFCstEtfXdcmRurKBnonZn3TexX2vRJ',
  	multiWIF: '2sczXZUmDC32x8PnysZuvSv7ARsVbPv9VxrUxbyFEC8g5DfNr9tnAm6VS1wGkYKjePRSS3pooFzQH8TMdhyXMGEPKdWU4Hv38GNXDUTjTUdT3wLbw6b4iey4pzr4bjBu1pVks7N5h',
  	publicKey: new Uint8Array('2,61,49,217,196,114,155,187,61,231,177,12,224,56,224,119,7,236,22,22,39,155,158,181,240,213,46,137,198,50,110,216,189'.split(',')),
  	signature: '12KMUAzPbn5PEPjrVPQVAvCkzmiADa3XSizXaHyKZp91Mntq9JXzxu1k33Gh3NLkbWjiUG6bQkd6BnYmn5kti3yhgsQW',
  	address: 'YTqwnXLYcZcw8eg7wS3yZ6KMesYYvp3MwDXk8wKm4SJn8UmqAPskw',
  	encrypted: {
  key: '6bac401ae6662263704ee85bde0bd4543a1d8960889b5dee246d2db7ee9d21e6',
  iv: '32bd7a43e0c1377d767d0edc1b3448d6',
  cipher: '69d941dab7b4a33a26fdb1df2de725e76a9728b3636e8e41160870377c83ce2a0fc8daed484f660d99a089152da89f7b0a1bcb8365ee055d954b1e858af5386ceb4b3e1d7723494fccf5e391ec3b0a91b15f1b772dc2a8ce0789c00919418ab938b402eb6dd74dd500c6399ea1219c3bc5c2332767c1d2d5b205b48d73b8a6870e400055ce3d8b2694d8b004f7307dc3'
}
  },
  'leofcoin:olivia': {
    ...defaultConfig,
  	bs58: '8Z2pzsENgFWWQZrLUJ5RiTjkXHEjqrWGmfZKyZWsjcTNu2A7m3B31phdPcQmCdL59JQDPHnar6BnDuHijQrGCTnXc1ybTFCstEtfXdcmRurKBnonZn3TexX2vRJ',
  	multiWIF: '2sczXZUmDC32x8PnysZuvSv7ARsVbPv9VxrUxbyFEC8g5DfNr9tnAm6VS1wGkYKjePRSS3pooFzQH8TMdhyXMGEPKdWU4Hv38GNXDUTjTUdT3wLbw6b4iey4pzr4bjBu1pVks7N5h',
  	publicKey: new Uint8Array('2,61,49,217,196,114,155,187,61,231,177,12,224,56,224,119,7,236,22,22,39,155,158,181,240,213,46,137,198,50,110,216,189'.split(',')),
  	signature: '12KMUAzPbn5PEPjrVPQVAvCkzmiADa3XSizXaHyKZp91Mntq9JXzxu1k33Gh3NLkbWjiUG6bQkd6BnYmn5kti3yhgsQW',
  	address: 'YTqwnXLYcZcw8eg7wS3yZ6KMesYYvp3MwDXk8wKm4SJn8UmqAPskw',
  	encrypted: {
  key: '6bac401ae6662263704ee85bde0bd4543a1d8960889b5dee246d2db7ee9d21e6',
  iv: '32bd7a43e0c1377d767d0edc1b3448d6',
  cipher: '69d941dab7b4a33a26fdb1df2de725e76a9728b3636e8e41160870377c83ce2a0fc8daed484f660d99a089152da89f7b0a1bcb8365ee055d954b1e858af5386ceb4b3e1d7723494fccf5e391ec3b0a91b15f1b772dc2a8ce0789c00919418ab938b402eb6dd74dd500c6399ea1219c3bc5c2332767c1d2d5b205b48d73b8a6870e400055ce3d8b2694d8b004f7307dc3'
}
  },
  ethereum: {
    ...defaultConfig,
    bs58: '2iF1MDW8JiZjT8ApgGEB5WC74vETATUEtwnx1P7Gi2F9MF2vdiew4MkxLCm5GKXp3EXdiqpngfYUks8rWnkU7sPh9zkNJVgfQ3w2w26y6aCFMZ9J6DuxenMQv4',
    multiWIF: 'RcLqAAv4fkZVin1hAH6eunWo3ZUK3pR3jiPgKFQfiqEFGQfAcwbeCPo4BWJ7zJsJ6voz1xVqQxMyzyXzSaWtmmeAoFGKU8P35V119BZz2uatgxc26fPrTSM4QZ1M5Mt62hdepse',
    publicKey: new Uint8Array('3,171,124,71,212,202,57,94,54,65,124,92,150,215,226,239,239,1,2,200,148,105,54,2,108,248,135,76,39,26,190,30,36'.split(',')),
    signature: '12Kk5wX4mZXazsFRiWqabowPMoSpBG62hAjfD2VYyLmd5L8zbX8A3WEm8tcYgBjfFmTXDJmdkufGhCoQYj23yThkd8Wd',
    address: '0x39df15db0c8602eeef783be23a1d75f3aaf48a1d',
    encrypted: {
      key: '2d100c9772413877d8f585194f200259207ef26d3cf7377a07ae36ca81a270c4',
      iv: '35339503505905ad08fe8eae3355515c',
      cipher: '62b62096e6bb89954413dddc94130f418d784eb4564f4ae7a36020da328bc1fa289600da397932fc70d0dd802db92587c0b5c790c812903df016bdb2a6fdaf3f0dc1e69e80923338ea9250b4ec937b42fd1898aee2638e289845692cb170ea05e2cc05a34de5b3e733f3c93efc82f74ae81628b80905cbcb01fd840481cd41aea3c7bce8db26c883d2ae712061ab6722'
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
