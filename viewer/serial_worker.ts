// Serial Interface Worker
// Finds arduino, listens, waits till entire line is sent, echos the line
// SerialPort module constantly crashes in nw.js

import SerialPort = require('serialport'); 

const BAUD_RATE = 115200;

async function main() {
    let l = await SerialPort.list();
    let path = '';
    for (let p of l) {
        if (p.manufacturer && p.manufacturer.includes('Arduino')) {
            path = p.path;
        }
    }

    let port = new SerialPort(path, { baudRate:BAUD_RATE }, (er) => {
        if (er) { throw new Error(er.message); }
    });
    
    let outbfr = '';
    port.on('data', function (data) {
        let s = data.toString();
        let partial_lines = s.split('\n');
        outbfr += partial_lines.shift();
        for (let pl of partial_lines) {
           console.log(outbfr);
           outbfr = pl;
        }
    });
}

main();
