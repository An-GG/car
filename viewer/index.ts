import * as cv from './canvas';
import { ChildProcess, spawn } from 'child_process';
import { stdout } from 'process';



export let SHARED:SharedData = {
    can_frames: [],
}

export function init() {
    cv.ActivateCanvas(window);
    cv.onDraw(draw);
   
//
    let serial = spawn('node', ['./serial_worker.js']);
    SHARED.serial_worker = serial
    serial.stdout.on('data', (data) => {
       // Could've sent multiple lines at once
        stdout.write(data.toString(), 'utf8', ()=>{});
        console.log(data.toString());
    });
}


export function deinit() {
    SHARED.serial_worker?.kill();        
}


function draw(c:CanvasRenderingContext2D) {
    c.fillRect(0, 0, window.innerWidth, window.innerHeight);    
}

function addFrame(f:CANFrame) {
    
}

init();




// TYPINGS

type SharedData = {
    can_frames: CANFrame[],
    serial_worker?: ChildProcess
}

type CANFrame = {
    str:string,
    dev_id:number,
    time:number,
    data_b16:string
}
