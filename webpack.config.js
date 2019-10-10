const path = require('path');
const webpack = require('webpack');


module.exports = {
  mode: 'production',
  entry: './lib/index.js',

  output: {
    filename: 'dom-event-tracker.[contenthash].min.js',
    path: path.resolve(__dirname, 'dist'),
    sourceMapFilename: "dom-event-tracker.[contenthash].min.js.map"
  },

  plugins: [new webpack.ProgressPlugin()],

  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        include: [path.resolve(__dirname, 'lib')],
        loader: 'babel-loader',

        options: {
          plugins: ['syntax-dynamic-import'],
          presets: [
            [
              '@babel/preset-env',
              {
                modules: false,
              },
            ],
          ],
        },
      },
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/,
        },
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: true,
    },
  },

  devtool: "source-map",

  devServer: {
    open: true,
  },
};
