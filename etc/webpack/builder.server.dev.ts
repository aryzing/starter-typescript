// Server dev builder

import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import webpack from 'webpack';

import config from './webpack.server.dev.config';

console.log('Building server...');

let serverProcess: ChildProcess | null = null;

const registerServerProcessLogging = (process: ChildProcess) => {
  process.stdout.on('data', data => {
    console.log(data.toString());
  });
  process.stderr.on('data', data => {
    console.log(data.toString());
  });
};

const spawnServer = () =>
  spawn(
    'node',
    [
      '--inspect',
      path.resolve(process.cwd(), 'build', 'server', 'server.dev.bundle.js'),
    ],
    {
      stdio: 'pipe',
    },
  );

webpack(config, (err, stats) => {
  if (err) {
    console.log('Failed to bundle');
    console.log(err);
    return;
  } else if (stats.hasErrors()) {
    console.log(stats.toString({ colors: true }));
    return;
  }

  if (serverProcess) {
    console.log('Server rebuilt successfully, Restarting server now...');
    serverProcess.kill();
    serverProcess = spawnServer();
    registerServerProcessLogging(serverProcess);
  } else {
    console.log('Server built successfully. Starting server now...');
    serverProcess = spawnServer();
  }
});
