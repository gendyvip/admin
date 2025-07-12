#!/usr/bin/env node

const { spawn } = require('child_process');
const { exec } = require('child_process');
const os = require('os');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkPort(port) {
  return new Promise((resolve) => {
    const platform = os.platform();
    let command;
    
    if (platform === 'win32') {
      command = `netstat -ano | findstr :${port}`;
    } else {
      command = `lsof -i :${port}`;
    }
    
    exec(command, (error, stdout) => {
      if (error || !stdout.trim()) {
        resolve(false); // Port is free
      } else {
        resolve(true); // Port is in use
      }
    });
  });
}

function killProcessOnPort(port) {
  return new Promise((resolve) => {
    const platform = os.platform();
    let command;
    
    if (platform === 'win32') {
      command = `for /f "tokens=5" %a in ('netstat -ano ^| findstr :${port}') do taskkill /F /PID %a`;
    } else {
      command = `lsof -ti :${port} | xargs kill -9`;
    }
    
    exec(command, (error) => {
      if (error) {
        log(`Warning: Could not kill process on port ${port}`, 'yellow');
      } else {
        log(`Successfully killed process on port ${port}`, 'green');
      }
      resolve();
    });
  });
}

async function startDevServer() {
  const port = 5173;
  
  log('🚀 Starting Development Server...', 'cyan');
  
  // Check if port is in use
  const portInUse = await checkPort(port);
  
  if (portInUse) {
    log(`⚠️  Port ${port} is already in use. Attempting to kill existing process...`, 'yellow');
    await killProcessOnPort(port);
    
    // Wait a bit for the process to be killed
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Start the development server
  const child = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      NODE_ENV: 'development',
    }
  });
  
  // Handle process events
  child.on('error', (error) => {
    log(`❌ Error starting server: ${error.message}`, 'red');
    process.exit(1);
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      log(`❌ Server exited with code ${code}`, 'red');
      process.exit(code);
    }
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    log('\n🛑 Shutting down server...', 'yellow');
    child.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log('\n🛑 Shutting down server...', 'yellow');
    child.kill('SIGTERM');
    process.exit(0);
  });
  
  log('✅ Development server started successfully!', 'green');
  log(`🌐 Open your browser and go to: http://localhost:${port}`, 'blue');
  log('📝 Press Ctrl+C to stop the server', 'cyan');
}

// Run the script
startDevServer().catch((error) => {
  log(`❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
}); 