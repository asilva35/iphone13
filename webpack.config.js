const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  devServer: {
    port: 8086,
    static: {
      directory: path.resolve(__dirname, 'src'),
    },
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      chunks: ['index'],
    }),
    new CopyPlugin({
      patterns: [{ from: 'src/assets', to: 'assets' }],
      patterns: [{ from: 'src/draco', to: 'draco' }],
      patterns: [{ from: 'src/models', to: 'models' }],
      patterns: [{ from: 'src/textures', to: 'textures' }],
    }),
  ],
  module: {
    rules: [
      //Shaders
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ['raw-loader'],
      },
    ],
  },
};
