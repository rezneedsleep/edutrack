const { spawn } = require('child_process');

// Read port from Pterodactyl's allocated port environment variables
const port = process.env.PORT || process.env.SERVER_PORT || '3000';

console.log(`Starting Next.js server on port ${port}...`);

// Spawn 'next start' process
const nextStart = spawn('npx', ['next', 'start', '-p', port, '-H', '0.0.0.0'], {
  stdio: 'inherit',
  shell: true
});

nextStart.on('close', (code) => {
  process.exit(code);
});
