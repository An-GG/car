var cv = require('./canvas');

cv.ActivateCanvas(window);
cv.onDraw((c) => { c.fillRect(10,10,100,100);});
