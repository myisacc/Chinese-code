const path = require('path')
const extensionConfig = {
  target: 'node',
  mode: 'none',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
  },
  externals: {
    vscode: 'commonjs vscode',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [{ test: /\.ts$/, exclude: /node_modules/, use: [{ loader: 'ts-loader' }] }],
  },
  devtool: 'nosources-source-map',
}
module.exports = [extensionConfig]
