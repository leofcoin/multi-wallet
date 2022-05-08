import modify from 'rollup-plugin-modify'

export default [{
	input: ['src/index.js'],
	output: {
		file: './dist/commonjs.js',
		format: 'cjs',
		sourcemap: false
	},
  plugins: [
		modify({
			SUBTLE_IMPORT: `const { subtle } = require('crypto').webcrypto`
		})
    // uglify()
  ]
}, {
	input: ['src/index.js'],
	output: {
		file: './dist/browser.js',
		format: 'es',
		sourcemap: false
	},
  plugins: [
		modify({
			SUBTLE_IMPORT: `const { subtle } = crypto`
		})
    // uglify()
    ]
}]
