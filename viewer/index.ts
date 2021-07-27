import cv = require('./canvas');
import SerialPort = require('serialport');

exports = {};
cv.onDraw((c:CanvasRenderingContext2D) => {
    c.fillRect(10,10,100,100);
})

let sp = new SerialPort('/dev/cu.usbmodem14101', { baudRate: 115200 });

sp.addListener('data', (chunk)=> {
    console.log(chunk);
})

