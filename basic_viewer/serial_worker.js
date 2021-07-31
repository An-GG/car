const SerialPort = require("serialport");
const fs = require('fs');

const BAUD_RATE = 115200;
async function main(callback) {
    let l = await SerialPort.list();
    let path = '';
    for (let p of l) {
        if (p.manufacturer && p.manufacturer.includes('Arduino')) {
            path = p.path;
        }
    }
    let port = new SerialPort(path, { baudRate: BAUD_RATE }, (er) => {
        if (er) {
            throw new Error(er.message);
        }
    });
    let outbfr = '';
    port.on('data', function (data) {
        let s = data.toString();
        let partial_lines = s.split('\n');
        outbfr += partial_lines.shift();
        for (let pl of partial_lines) {
            callback(outbfr);
            outbfr = pl;
        }
    });
}
exports.main = main;

let lineN = 0;
async function testing(seconds, callback) {
	let lines = fs.readFileSync('captures/test_filtered2.txt').toString().split('\n');
	let len = lines.length;
	setInterval(()=>{
		callback(lines[lineN]);
		lineN++;
		if (lineN == len) { process.exit(); }
	}, seconds * 1000);
}
exports.testing = testing;

if (process.argv.length > 2) {
	main(console.log);
}
