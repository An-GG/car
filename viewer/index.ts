import cv = require('./canvas');
import cp = require('child_process');


cv.ActivateCanvas(window);
cv.onDraw((c) => { c.fillRect(0,0,window.innerWidth,window.innerHeight);});


let serial = cp.spawn('node', ['./serial_worker.js']);
serial.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});


