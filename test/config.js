const defaultConfig = {
  mnemonic: 'fame vacuum enter address sweet entire anxiety ceiling symptom crowd rebuild interest expose chef frown charge year worth state tunnel valid crack very abandon',
  hash: Buffer.alloc(32, 1),
  id: 'oeQvcdmYGuEJFM1qoFpyEg5DK8km4hZzXocrZm43h6ag516WqHUnBMoDb',
  bs58: '8Z2pzsENgFWWQZrLUJ5RiTjkXH4yrpUrJvwDhjEv5cippx1Xo7KNngehNWArMeEfJRBLU7owGpeUEBtFEhSWn4hU1VKD7NUgL3sngiMHWgosMeB2uKovyZn8QL5',
  multiWIF: 'n7xap9czUWhSnRUst6ozkjKo7f4Em7FoL3U58N8xjDaiHiDvfoAG',
  signature: '12KMWV9azTnSJoWvLpRY4s4rDbzEDLDfKiP8Ud3VnSnVojf8p6wAi9tbL5UVbvUXsQt1cMfDqmSUSR572bz3Ka1PfQMm',
  address: 'YTqz6xb5emRgGFhjoTSQVfhKL2mfeZ6eks3git4HVDJty9aWeZCwg',  	
  encrypted: {
    key: 'f5319889ea830bbd58a03815e40a9fdd680510c4dd95d6f04ff056cda0bb091e',
    iv: '673d32c40d1fb97445340746e6fc0f22',
    cipher: 'd65ec8e4dcfa55457e7b9ad20cb16e12680a374dccd30475e28b03cfb71920332a41ea169931e1444c50831ab84f7eb48be03666d6bb310f927cde9e73f86ba2'
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
    bs58: '2iF1MDW8JiZjT8ApgGEB5WC74kUU8S3nAKggB79ciHh5H6SxhrzhvJpwDxrEHE7yA1eiYsBDR8EV3TfMoP13inL6dLN2RmV7D34C1kd3sXkRCvPddzPHQB9vKD',
    multiWIF: 'n7xap9eJXHnKrMvT8BaimqnjGaW8HcbKJUCoqeDAYFmxdXYQseAt',
    signature: '12Kk4WqsrfSXYfYUJ2q4xNitmfLdkeKPyp427XFVMvYb79NmCBb6j3rP3WQQC11EWdAS84tnZhTBTsV4tC6k7f9vdC9M',
    address: '0x1fc84aac3fcd9a183f65d8d62dd5427b497df8d8',
    encrypted: {
      key: '1a5c803165752a72ccd71dc3aca2650432f6d463c65b294d81beac26f2782414',
      iv: 'be8e4e705050295ea4897d82b4743e92',
      cipher: '0c618a2c53cdf13ae1a226a5f0cbafd901ccc82be6da76e42306f5f3c39294b12f233dea2012feeb5f3fcaa7621f5987f66199fcb5bd51f16a72504736701795'
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
