import cv = require('./canvas');


exports = {};
cv.onDraw((c:CanvasRenderingContext2D) => {
    c.fillRect(10,10,100,100);
})
