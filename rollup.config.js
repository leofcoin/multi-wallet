import typescript from '@rollup/plugin-typescript'
export default [{
  input: ['./src/index.ts', './src/hd-wallet.ts', './src/multi-node.ts', './src/hd-node.ts', './src/hd-account.ts', './src/networks.ts', './src/testnets.ts'],
  output: {
    format: 'es',
    dir: './exports'
  },
  external: [
    './networks.js',
    './testnets.js',
    './multi-wallet.js',
    './hd-node.js',
    './hd-account.js',
    '@vandeurenglenn/base58check'
  ],  
  plugins: [
    typescript()
  ]
}]