var cv = require('./canvas');

cv.ActivateCanvas(window);

cv.onDraw((c:CanvasRenderingContext2D) => {
    c.fillRect(10,10,100,100);
})
