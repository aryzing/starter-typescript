// Common webpack config across server project

import { Configuration } from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';

const config: Configuration = {
  entry: {
    server: path.resolve(process.cwd(), 'src', 'server', 'index.ts'),
  },
  externals: [nodeExternals()],
  output: {
    filename: 'server.dev.bundle.js',
    path: path.resolve(process.cwd(), 'build', 'server'),
  },
};

export default config;
