const cp = require('child_process');

cp.execFile('node', ['./index.js'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});

