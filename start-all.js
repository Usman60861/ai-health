import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting AI Health & Fitness App...\n');

// Start server
console.log('📡 Starting server with auto port detection...');
const serverProcess = spawn('npm', ['run', 'dev-auto'], {
  cwd: join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

// Wait a bit for server to start, then start client
setTimeout(() => {
  console.log('\n💻 Starting client with auto port detection...');
  const clientProcess = spawn('npm', ['run', 'dev-auto'], {
    cwd: join(__dirname, 'client'),
    stdio: 'inherit',
    shell: true
  });
  
  clientProcess.on('error', (error) => {
    console.error('❌ Client error:', error.message);
  });
}, 3000);

serverProcess.on('error', (error) => {
  console.error('❌ Server error:', error.message);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  serverProcess.kill();
  process.exit(0);
});