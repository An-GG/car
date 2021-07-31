const sw = require('../serial_worker.js');
const fs = require('fs');

let framesByID = {
}

const targetFPS = 30;
const targetPeriodMS = 1000 / targetFPS;

let c_time = (new Date()).toISOString();
let capturefile_path = 'captures/'+c_time+'.txt'
fs.writeFileSync(capturefile_path, "");

const rows = process.stdout.rows;
console.clear();
sw.main((l) => {
	try {
		let id = parseInt(l.match(/\[.+\]/)[0].match(/\w+/)[0], 16);
		fs.appendFileSync(capturefile_path, l + '\n');
		framesByID[id] = parseLine(l);
		draw();
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
	for (let id in framesByID) {
		let line = '';
		let line_n = n % rows;
		let col_n = (n - (n % rows)) / rows;
		line += id.toString().padStart(4) + '        ';
		for (let h of framesByID[id].hex_bytes) {
			line += '  ';
			line += h.padStart(2, 0);
		}
		line = line.padEnd(50);
		n++;
		if (col_n == 0) {
			lines_str.push(line);
		} else {
			lines_str[line_n] += line;
		}
	}

	let out = '';
	n = 0;
	for (let l of lines_str) { 
		out += l;
		n++;
		if (n < lines_str.length) { out += '\n'; }
	}
	process.stdout.write('\033[0;0H'+ out);
}



