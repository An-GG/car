const sw = require('../serial_worker.js');
const fs = require('fs');

let framesByID = {
}

let c_time = (new Date()).toISOString();
let capturefile_path = 'captures/'+c_time+'.txt'
fs.writeFileSync(capturefile_path, "");

const rows = process.stdout.rows;
console.clear();

const targetFPS = 24;
const period = (73.307 / 35217);
let last_t = (new Date()).getTime();

sw.testing(period, (l) => {
	try {
		let id = parseInt(l.match(/\[.+\]/)[0].match(/\w+/)[0], 16);
//		fs.appendFileSync(capturefile_path, l + '\n');
		framesByID[id] = parseLine(l);

        let new_t = (new Date()).getTime();
        if (new_t - last_t >= (1000 / targetFPS)) {
            last_t = new_t;
            draw();
        }
	} catch (e) {
	}
});


function parseLine(l) {
	return {
		time: parseFloat(l.match(/\d+.\d+/)[0]),
		line: l,
		hex_bytes: l.match(/\) .*/)[0].substring(2).split(' ')	
	}
}

function draw() {
	let n = 0;
	let col_width = 50;

	let lines_str = [];

    let mostrecenttime = "";
	for (let id in framesByID) {
		let line = '';
		let line_n = n % rows;
		let col_n = (n - (n % rows)) / rows;
		line += id.toString().padEnd(10) + '  ';
        mostrecenttime = framesByID[id].time;
		for (let h of framesByID[id].hex_bytes) {
			line += ' ';
			line += h.padStart(2, 0);
		}
		line = line.padEnd(col_width);
		n++;
		if (col_n == 0) {
			lines_str.push(line);
		} else {
			lines_str[line_n] += line;
		}
	}
    lines_str[rows - 1] += mostrecenttime.toString().padStart(col_width);
	let out = '';
	n = 0;
	for (let l of lines_str) { 
		out += l;
		n++;
		if (n < lines_str.length) { out += '\n'; }
	}
	process.stdout.write('\033[0;0H'+ out);
}



