const path = require('path');
const nodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.base.config');

module.exports = {
  ...baseConfig,
  entry: './src/server.ts',
  mode: 'production',
  target: 'node',
  output: {
		path: path.resolve('dist'),
    publicPath: '/app/',
    filename: 'server.js',
	},
  externals: [ nodeExternals() ],
  watch: false,
};
