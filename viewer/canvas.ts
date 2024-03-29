
export let local_ctx:CanvasRenderingContext2D;
export let local_win:Window;
export function ActivateCanvas(win:Window) {
    let canvas = win.document.getElementById("canvas") as HTMLCanvasElement;
    let context = canvas.getContext('2d')!;
    local_ctx = context;
    local_win = win;
    onResize(context);
    win.addEventListener('resize', () => { onResize(context); });
}

let scaling = 1.0;
function onResize(ctx:CanvasRenderingContext2D) {
    let canvas = ctx.canvas;
    canvas.width = local_win.innerWidth * scaling;
    canvas.height = local_win.innerHeight * scaling;
    ctx.scale(scaling, scaling);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx);
}

let usr_draw_func: (c:CanvasRenderingContext2D)=>any = (() => {})
function draw(ctx:CanvasRenderingContext2D) {
    let s = ctxSize(ctx);
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,s.w,s.h);
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";

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

