"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redraw = exports.onDraw = exports.setScaling = void 0;
let local_ctx;
function main() {
    let canvas = window.document.getElementById("canvas");
    let context = canvas.getContext('2d');
    local_ctx = context;
    onResize(context);
    window.addEventListener('resize', () => { onResize(context); });
}
let scaling = 2.0;
function onResize(ctx) {
    let canvas = ctx.canvas;
    canvas.width = window.innerWidth * scaling;
    canvas.height = window.innerHeight * scaling;
    ctx.scale(scaling, scaling);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx);
}
let usr_draw_func = (() => { });
function draw(ctx) {
    let s = ctxSize(ctx);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, s.w, s.h);
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    usr_draw_func(ctx);
}
function ctxSize(ctx) {
    return {
        w: ctx.canvas.width,
        h: ctx.canvas.height
    };
}
function setScaling(n) {
    scaling = n;
    onResize(local_ctx);
}
exports.setScaling = setScaling;
function onDraw(cb) {
    usr_draw_func = cb;
    onResize(local_ctx);
}
exports.onDraw = onDraw;
function redraw() {
    draw(local_ctx);
}
exports.redraw = redraw;
main();
