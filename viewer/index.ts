import * as cv from './canvas';
import { ChildProcess, spawn } from 'child_process';
import { stdout } from 'process';
import * as fs from 'fs';
import { CANFrame, SharedData } from './types';
import { DataGrid } from './grid';

export let SHARED:SharedData = {
    fps: 25,
    can_frames: [],
    methods: {
        save_frames: save_frames,
        cv:cv
    }
}

let drawer:DataGrid
export function init() {

    nw.Window.open('player.html');
    cv.ActivateCanvas(window);
    drawer = new DataGrid(cv.local_ctx, SHARED.can_frames);
    serialInit(true);
    cv.onDraw(draw);
    (window as any)['SHARED'] = SHARED;
    SHARED.frame_timer_n = setInterval(cv.redraw, 1000 * (1 / SHARED.fps));

}


export function deinit() {
    SHARED.serial_worker?.kill();        
    if (SHARED.serial_virtual_n != undefined) {
        clearInterval(SHARED.serial_virtual_n);
    }
    if (SHARED.frame_timer_n != undefined) {
        clearInterval(SHARED.frame_timer_n);
    }
    SHARED.serial_worker = undefined;
    SHARED.serial_virtual_n = undefined;
    SHARED.frame_timer_n = undefined;
}


function draw(c:CanvasRenderingContext2D) {
    drawer.draw();
}
    
function save_frames() {
    let out = '';
    for (let l of SHARED.can_frames) {
        out += l.str + '\n';
    }
    let n = (new Date()).toISOString();
    fs.writeFileSync('saved_frames/'+n+'.txt', out);
}












function serialInit(virtual?:true) {

    if (virtual) {
        let lines = fs.readFileSync('sample_input.txt').toString().split('\n');
        let period = 0.003;
        (window as any)['virtual_line_n'] = 0;            
        SHARED.serial_virtual_n = setInterval(() => {
            let n = (window as any)['virtual_line_n'];
            handleData(lines[n]);
            (window as any)['virtual_line_n'] = n + 1;
            if (n == lines.length) {
                clearInterval(SHARED.serial_virtual_n!);
            }
        }, 3); 

    } else {

        let serial = spawn('node', ['./serial_worker.js']);
        SHARED.serial_worker = serial
        serial.stdout.on('data', (data) => {
            // data will have to contain \n bc console.log does that
            let s = data.toString().split('\n')[0];
            handleData(s);
        });

    }
}

// Sample Data Line
// 0017.725 RX: [000003F9](00) 55 3C 56 01 00 00 00 EC
function handleData(line:string) {
    if (line.split('\n').length != 1) { return; }
    try {
        let frame = parseLine(line);
        SHARED.can_frames.push(frame);
    } catch(err) {
        console.log("Could not parse line:");
        console.log(err);
    }    
}

function parseLine(line:string): CANFrame {
    let time_str = line.match(/\d+\.\d+/)![0];    
    let id_str = line.match(/\[.+\]/)![0].match(/\w+/)![0];
    let data_str = "";
    let raw_bytes: number[] = [];

    let hex_bytes = line.match(/\) .+/)![0].substring(2).split(' ');
    for (let h of hex_bytes) {
        data_str+=h;
        raw_bytes.push(parseInt(h, 16));
    }

    return {
        time: parseFloat(time_str),
        str: line,
        dev_id: parseInt(id_str, 16),
        data: {
            b16: data_str,
            nbits: data_str.length * 4,
            raw_bytes: raw_bytes,
            raw_full: parseInt(data_str, 16)
        }
    }
}








// TYPINGS



// INIT
init();
