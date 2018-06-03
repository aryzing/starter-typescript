// Common webpack config across all projects
import { Configuration } from 'webpack';

const config: Configuration = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', 'json'],
  },
};

export default config;
