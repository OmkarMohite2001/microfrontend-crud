/**
 * Script to run all 6 Microfrontend applications concurrently.
 * No external dependencies required!
 *
 * Usage:
 *   node scripts/start-all.js
 *   or: npm run start:all
 */

const { spawn } = require('child_process');
const path = require('path');

const apps = [
  { name: 'SHELL    ', port: 4200, cmd: 'ng', args: ['serve', 'shell'], color: '\x1b[36m' },
  { name: 'VEHICLE  ', port: 4201, cmd: 'ng', args: ['serve', 'vehicle-mfe'], color: '\x1b[32m' },
  { name: 'CUSTOMER ', port: 4202, cmd: 'ng', args: ['serve', 'customer-mfe'], color: '\x1b[33m' },
  { name: 'ORDER    ', port: 4203, cmd: 'ng', args: ['serve', 'order-mfe'], color: '\x1b[35m' },
  { name: 'SERVICE  ', port: 4204, cmd: 'ng', args: ['serve', 'service-mfe'], color: '\x1b[34m' },
  { name: 'REPORTS  ', port: 4205, cmd: 'ng', args: ['serve', 'reports-mfe'], color: '\x1b[31m' },
];

const resetColor = '\x1b[0m';
const isWindows = process.platform === 'win32';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';

console.log('\x1b[1m\x1b[32m=== Starting Car Management Microfrontends ===\x1b[0m');
console.log('Shell:     http://localhost:4200');
console.log('Vehicle:   http://localhost:4201');
console.log('Customer:  http://localhost:4202');
console.log('Order:     http://localhost:4203');
console.log('Service:   http://localhost:4204');
console.log('Reports:   http://localhost:4205');
console.log('----------------------------------------------\n');

const runningProcesses = [];

apps.forEach((app) => {
  const child = spawn(npxCmd, app.args, {
    cwd: path.resolve(__dirname, '..'),
    shell: isWindows,
    env: { ...process.env, FORCE_COLOR: 'true' }
  });

  runningProcesses.push(child);

  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`${app.color}[${app.name} :${app.port}]${resetColor} ${line}`);
      }
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.error(`${app.color}[${app.name} :${app.port}] ERR:${resetColor} ${line}`);
      }
    });
  });

  child.on('close', (code) => {
    console.log(`${app.color}[${app.name}] exited with code ${code}${resetColor}`);
  });
});

function cleanup() {
  console.log('\nStopping all microfrontends...');
  for (const p of runningProcesses) {
    if (isWindows && p.pid) {
      try {
        spawn('taskkill', ['/pid', p.pid.toString(), '/f', '/t']);
      } catch (e) {}
    } else {
      p.kill();
    }
  }
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
