const defaultConfig = {
  mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon',
  hash: Buffer.alloc(32, 1)
}

module.exports = {
  leofcoin: {
    ...defaultConfig,
  	bs58: '5BycwBHaGerBsZZjFXbAJGYJACJeNzpD56JRWHuKC3XXe9fcpZ58Kty23M1XAy8jaY1NmrUjc1B4kL1dGRxfmakK6CreeSj78yh6QpUMJ6KHty2Z',
  	multiWIF: '1EyinruShNm71XE1Z8NF6mkHsjojbdkUX7YstTzip2DtQLRugL4eys2xCmxQj5uoH1Wu2zbNgRNgkd5fxkBQ5T4fMDNUoonWZRtZpYkXvtR7f53n3DEy',
  	publicKey: '03b45f09055224b1e83a73ff3ebd48f3f36eb7b650bf681337d2da9e3c481b8315',
  	signature: '12KMX6AzSzfgGUpzQyUVjTNwXmi9XTh9ofNTmYxb1fJjaNgCnVSoMzjqKjJ8gP9YfpFrZzfJqAYjZ2vNPQHsoD2LNPDL',
  	address: '8CfsUYd9zSMC3h6L1y3UTtF6ZrWQigb4X55d99w54NYbyTrqtN',
  	encrypted: 'U2FsdGVkX18rmJR9B3kVZmc0SfW46CO8Qj7hzQND5BgZW264yYrEwu6eXAJ0SB1Cs0E0xlujKDnJdjX5nF+Glci/PmtuxGuLSLb1fmBvybQFw42ltQ1Sz8YycQDCRruWfIBi3pu0tDmCrTjRriXY0zHMoPioV6ZzxCfP2rRzMhcfCpfL988yDh1+oT2rWRl1'
  },
  'leofcoin:olivia': {
    ...defaultConfig,
  	bs58: '5BycwBHaGerBsZZjFXbAJGYJACJeNzpD56JRWHuKC3XXe9fcpZ58Kty23M1XAy8jaY1NmrUjc1B4kL1dGRxfmakK6CreeSj78yh6QpUMJ6KHty2Z',
  	multiWIF: '1EyinruShNm71XE1Z8NF6mkHsjojbdkUX7YstTzip2DtQLRugL4eys2xCmxQj5uoH1Wu2zbNgRNgkd5fxkBQ5T4fMDNUoonWZRtZpYkXvtR7f53n3DEy',
  	publicKey: '03b45f09055224b1e83a73ff3ebd48f3f36eb7b650bf681337d2da9e3c481b8315',
  	signature: '12KMX6AzSzfgGUpzQyUVjTNwXmi9XTh9ofNTmYxb1fJjaNgCnVSoMzjqKjJ8gP9YfpFrZzfJqAYjZ2vNPQHsoD2LNPDL',
  	address: '8CfsUYd9zSMC3h6L1y3UTtF6ZrWQigb4X55d99w54NYbyTrqtN',
  	encrypted: 'U2FsdGVkX18rmJR9B3kVZmc0SfW46CO8Qj7hzQND5BgZW264yYrEwu6eXAJ0SB1Cs0E0xlujKDnJdjX5nF+Glci/PmtuxGuLSLb1fmBvybQFw42ltQ1Sz8YycQDCRruWfIBi3pu0tDmCrTjRriXY0zHMoPioV6ZzxCfP2rRzMhcfCpfL988yDh1+oT2rWRl1'
  },
  ethereum: {
    ...defaultConfig,
    bs58: 'xprv9s21ZrQH143K2WAsssZEn1L5mnzfxd7PChziV6W3rJgtUu28vHKvVdsG6irQHzXPH6D3T8e4Rqp9hboUGNSKZv7Te1EEMFxpQKLqrih3jZp',
    multiWIF: '1F3rcHQfLnBJNa1nxNSAtEBD8YoTwBNKMAESq4La7m1uBQsjHnDe5uwax6CJxaaMBaKQnyE78PeKRmjmf1nk9ZfAykmhNThHKdGg8rgSSrLhSvgd8x6Z',
    publicKey: '03779a814ca9782f05eb57706c4c31f5d5ce163b74cb71303e4123e45519e8ea28',
    signature: '12Kk71UNWfU1cwJUnwMXvhR5deDaNMsz2ctyQTgZZ8WpE67xRXivfWELcZeLjUKqZktezTu5yT9ZdtmhgXdVuycA98QB',
    address: 'd9faf75006454201794da69f9793c4a7a0fbd6eb',
    encrypted: 'U2FsdGVkX192SaXvyUE7iqT43IxelMWxSZo7rgPxuCoX9uBynrigtBzKKC9KkTa5lthMMoSv3ugSDGvwU4KuwxmPPM0RJ73G4iZd73MrvGh0pQTICxSAk306J1LUk75eYkQhTw7uOKWnYBG5YvqZaefBnGVVayM3PCDqObNf6AQDxBOvRYhVnFdqildXtpbM'
  },
  'ethereum:kovan': {
    ...defaultConfig,
    multiWIF: '1F3rcHQfLnBJNa1nxNSAtEBD8YoTwBNKMAESq4La7m1uBQsjHnDe5uwax6CJxaaMBaKQnyE78PeKRmjmf1nk9ZfAykmhNThHKdGg8rgSSrLhSvgd8x6Z',
    bs58: 'xprv9s21ZrQH143K2WAsssZEn1L5mnzfxd7PChziV6W3rJgtUu28vHKvVdsG6irQHzXPH6D3T8e4Rqp9hboUGNSKZv7Te1EEMFxpQKLqrih3jZp',
    publicKey: '03b45f09055224b1e83a73ff3ebd48f3f36eb7b650bf681337d2da9e3c481b8315',
    signature: '12Kk7N6aFmD6w4wthG7BHJfnsnzVsARVUYorDwfuqE6G5AFjJTcaRHhJqNetjKkD5NH2pk2MfGqaBzGhcbZWZj354C5G',
    address: 'd9faf75006454201794da69f9793c4a7a0fbd6eb',
    encrypted: 'U2FsdGVkX192SaXvyUE7iqT43IxelMWxSZo7rgPxuCoX9uBynrigtBzKKC9KkTa5lthMMoSv3ugSDGvwU4KuwxmPPM0RJ73G4iZd73MrvGh0pQTICxSAk306J1LUk75eYkQhTw7uOKWnYBG5YvqZaefBnGVVayM3PCDqObNf6AQDxBOvRYhVnFdqildXtpbM'
  }
}
