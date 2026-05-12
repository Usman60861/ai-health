import { spawn } from 'child_process';
import detectPort from 'detect-port';

const DEFAULT_PORT = 3001;

const startClient = async () => {
  try {
    const port = await detectPort(DEFAULT_PORT);
    
    if (port !== DEFAULT_PORT) {
      console.log(`⚠️ Port ${DEFAULT_PORT} is busy, switching to free port ${port}`);
    }
    
    console.log(`🚀 Starting client on port ${port}...`);
    
    // Set the port and start Vite
    const viteProcess = spawn('npm', ['run', 'dev', '--', '--port', port.toString()], {
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        PORT: port.toString()
      }
    });
    
    viteProcess.on('error', (error) => {
      console.error('❌ Failed to start client:', error.message);
      process.exit(1);
    });
    
    viteProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`❌ Client process exited with code ${code}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to detect port:', error.message);
    process.exit(1);
  }
};

startClient();