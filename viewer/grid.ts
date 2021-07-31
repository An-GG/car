import { CANFrame } from "./types";


export class DataGrid {
   
    private ctx:CanvasRenderingContext2D;
    private frames:CANFrame[];
    
    constructor(ctx:CanvasRenderingContext2D, frames: CANFrame[]) {
        this.frames = frames;
        this.ctx = ctx;
    }

    draw() {
        let framesByID: { [id:string]:CANFrame[] } = {}

        for (let f of this.frames) {
            if (framesByID[f.dev_id.toString()] == undefined) {
                framesByID[f.dev_id.toString()] = [];
            }
            framesByID[f.dev_id.toString()].push(f);
        }

        let ids = Object.keys(framesByID);
        ids.sort((a, b)=>{ return parseInt(a) - parseInt(b); });

        let canvas = this.ctx.canvas;
        let ctx = this.ctx;
        let c_w = canvas.width;
        let c_h = canvas.height;
        
        let rowH = 20;
        let colW = 20;
        let rowN = 0;
        for (let id of ids) {
            let h = rowH * rowN;
            ctx.lineWidth = 1;
            ctx.fillStyle = 'white';
            ctx.moveTo(0, h);
            ctx.lineTo(c_w, h);
            //ctx.fillText(id, 0, h + 15);
            ctx.stroke();

            let lastFrame = framesByID[id][framesByID[id].length - 1];

            let colN = 0;
            let xoffset = 100;
            for (let byteval of lastFrame.data.raw_bytes) {
                let w = colN * colW;
                let b16 = byteval.toString(16).padStart(2, '0');
                ctx.fillStyle = '#' + b16 + b16 + b16;
                ctx.fillRect(xoffset + w, h, colW, rowH);

 //               ctx.fillStyle = '#990000';
//                ctx.fillText(b16.toUpperCase(), xoffset + w + 3, h + 15);
                colN++;
            }
            rowN++;
        }

    }

}
