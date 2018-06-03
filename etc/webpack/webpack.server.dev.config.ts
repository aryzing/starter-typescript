// Server dev config
//
import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import Dotenv from 'dotenv-webpack';

import babelConf from '../babel/.babelrc.server';
import commonConfig from './webpack.common.config';
import commonDevConfig from './webpack.common.dev.config';
import commonServerConfig from './webpack.server.common.config';

const config = merge(commonConfig, commonDevConfig, commonServerConfig, {
  mode: 'development',
  devtool: 'source-map', // TODO: confirm that this works with ts->babel->webpack chain
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelConf,
          },
        ],
      },
    ],
  },
  plugins: [
    // Reads environment variables defined in `.env` file in project root
    new Dotenv({
      path: path.resolve(process.cwd(), '.env'),
    }),

    // Stack traces will point to source code when source maps are available
    new webpack.BannerPlugin({
      // Make sure this package is installed before building
      banner: 'require("source-map-support").install();',
      // Raw: if true, banner will not be wrapped in a comment
      raw: true,
    }),
  ],
});

export default config;
