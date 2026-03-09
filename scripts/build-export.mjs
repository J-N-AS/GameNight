import { spawn } from 'node:child_process';

const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const child = spawn(npxCommand, ['next', 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    STATIC_EXPORT: 'true',
  },
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
