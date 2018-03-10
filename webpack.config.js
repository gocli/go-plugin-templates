const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/plugin.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  output: {
    libraryTarget: 'commonjs',
    filename: 'plugin.js',
    path: path.resolve(__dirname, 'dist')
  }
}
