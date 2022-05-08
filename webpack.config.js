const path = require('path');
const webpack = require('webpack');
module.exports = [
  {
    entry: './dist/browser.js',
    plugins: [
      // Work around for Buffer is undefined:
      // https://github.com/webpack/changelog-v5/issues/10
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      })
    ],
    optimization: {
      minimize: false
    },
    resolve: {
      fallback: {
        "stream": require.resolve("stream-browserify"),
        "crypto": require.resolve("crypto-browserify")
        // "buffer": require.resolve("buffer"),
        // "path": require.resolve("path-browserify"),
        // "os": require.resolve("os-browserify")
      }
    },

    experiments: {
      outputModule: true
    },
    output: {
      library: {
        type: 'module'
      },
      filename: 'browser.js',
      path: path.resolve(__dirname, 'dist'),
    }
  }, {
    entry: './dist/browser.js',
    plugins: [
      // Work around for Buffer is undefined:
      // https://github.com/webpack/changelog-v5/issues/10
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      })
    ],
    optimization: {
      minimize: true
    },
    resolve: {
      fallback: {
        "stream": require.resolve("stream-browserify"),
        "crypto": require.resolve("crypto-browserify")
        // "buffer": require.resolve("buffer"),
        // "path": require.resolve("path-browserify"),
        // "os": require.resolve("os-browserify")
      }
    },

    experiments: {
      outputModule: true
    },
    output: {
      library: {
        type: 'module'
      },
      filename: 'browser.js',
      path: path.resolve(__dirname, 'dist'),
    }
  }
]
