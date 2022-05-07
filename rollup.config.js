export default [
	// ES module version, for modern browsers
	{
		input: ['src/index.js'],
		output: {
			file: './dist/commonjs.js',
			format: 'cjs',
			sourcemap: false
		},
    plugins: [
      // uglify()
    ]
	}
]
