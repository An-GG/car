
let local_ctx:CanvasRenderingContext2D;
function main() {
    let canvas = window.document.getElementById("canvas") as HTMLCanvasElement;
    let context = canvas.getContext('2d')!;
    local_ctx = context;
    onResize(context);
    window.addEventListener('resize', () => { onResize(context); });
}

let scaling = 2.0;
function onResize(ctx:CanvasRenderingContext2D) {
    let canvas = ctx.canvas;
    canvas.width = window.innerWidth * scaling;
    canvas.height = window.innerHeight * scaling;
    ctx.scale(scaling, scaling);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx);
}

let usr_draw_func: (c:CanvasRenderingContext2D)=>any = (() => {})
function draw(ctx:CanvasRenderingContext2D) {
    let s = ctxSize(ctx);
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,s.w,s.h);
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";

    usr_draw_func(ctx);
}

function ctxSize(ctx:CanvasRenderingContext2D): { w:number, h:number } {
    return {
        w: ctx.canvas.width,
        h: ctx.canvas.height
    } 
}


export function setScaling(n:number) {
    scaling = n;
    onResize(local_ctx);    
}
export function onDraw(cb: (ctx:CanvasRenderingContext2D) => any) {
    usr_draw_func = cb;
    onResize(local_ctx);
}
export function redraw() {
    draw(local_ctx);
}

main();
