import cv = require('./canvas');
import SerialPort = require('serialport');

exports = {};
cv.onDraw((c:CanvasRenderingContext2D) => {
    c.fillRect(10,10,100,100);
})

let a = new SerialPort()