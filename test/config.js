const defaultConfig = {
  mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon',
  hash: Buffer.alloc(32, 1)
}

module.exports = {
  leofcoin: {
    ...defaultConfig,
  	bs58: '5BycwBHaGerBsZZjFXbAJGYJACJeNzpD56JRWHuKC3XXe9fcpZ58Kty23M1XAy8jaY1NmrUjc1B4kL1dGRxfmakK6CreeSj78yh6QpUMJ6KHty2Z',
  	multiWIF: '1EyinruShNm71XE1Z8NF6mkHsjojbdkUX7YstTzip2DtQLRugL4eys2xCmxQj5uoH1Wu2zbNgRNgkd5fxkBQ5T4fMDNUoonWZRtZpYkXvtR7f53n3DEy',
  	publicKey: '024da6bc5bcc08d51e8cb1aefc029d9cd42d37bb1382a414c01ef040184b100291',
  	signature: '12KMUH6zhM426icsZVrpkP3KmTgAsyPQYMSnckughCVVGDdB4xz7K3iZiCHJQFso8NudWK6FmQ2uFemXbuKhjs55X2xh',
  	address: '5UgrNyVJaxynj8RJc3Qy447LvzJ65JuPPGvqFFR1VPoqS35eVr',
  	encrypted: 'U2FsdGVkX18rmJR9B3kVZmc0SfW46CO8Qj7hzQND5BgZW264yYrEwu6eXAJ0SB1Cs0E0xlujKDnJdjX5nF+Glci/PmtuxGuLSLb1fmBvybQFw42ltQ1Sz8YycQDCRruWfIBi3pu0tDmCrTjRriXY0zHMoPioV6ZzxCfP2rRzMhcfCpfL988yDh1+oT2rWRl1'
  },
  ethereum: {
    ...defaultConfig,
    bs58: 'xprv9s21ZrQH143K2WAsssZEn1L5mnzfxd7PChziV6W3rJgtUu28vHKvVdsG6irQHzXPH6D3T8e4Rqp9hboUGNSKZv7Te1EEMFxpQKLqrih3jZp',
    multiWIF: '1F3rcHQfLnBJNa1nxNSAtEBD8YoTwBNKMAESq4La7m1uBQsjHnDe5uwax6CJxaaMBaKQnyE78PeKRmjmf1nk9ZfAykmhNThHKdGg8rgSSrLhSvgd8x6Z',
    publicKey: '03779a814ca9782f05eb57706c4c31f5d5ce163b74cb71303e4123e45519e8ea28',
    signature: '12Kk71UNWfU1cwJUnwMXvhR5deDaNMsz2ctyQTgZZ8WpE67xRXivfWELcZeLjUKqZktezTu5yT9ZdtmhgXdVuycA98QB',
    address: 'aaea7ac10257243f0412d15a0eeba1fbf4fb7a9b',
    encrypted: 'U2FsdGVkX192SaXvyUE7iqT43IxelMWxSZo7rgPxuCoX9uBynrigtBzKKC9KkTa5lthMMoSv3ugSDGvwU4KuwxmPPM0RJ73G4iZd73MrvGh0pQTICxSAk306J1LUk75eYkQhTw7uOKWnYBG5YvqZaefBnGVVayM3PCDqObNf6AQDxBOvRYhVnFdqildXtpbM'
  }
}
