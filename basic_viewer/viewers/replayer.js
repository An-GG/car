const fs = require('fs');

let filepath = process.argv[2];
let printlines = (process.argv.includes('print-lines'));

let lines = fs.readFileSync(filepath).toString().split('\n');


let signals = [
    { dev: 37, name: "STEER_ANGLE", startbit: 4, bitlen: 12, signed:true, displaymode:'bar' }
]

// IDs of devices who's signals we have in list
let significant_devs = [];
for (let s of signals) {
    significant_devs.push(s.dev);
}

// Lines with only concerning devices
let filtered_lines = [];
for (let l of lines) {
    let id_str = l.match(/\[.+\]/)[0].substring(1, 9);
    let id = parseInt(id_str, 16);
    
    let hexstr = l.match(/\) .*/)[0].substring(2).split(' ');
    let binstr = '';
    for (let h of hexstr) {
        binstr += parseInt(h, 16).toString(2).padStart(8, '0');
    }

    if (significant_devs.includes(id)) {
        filtered_lines.push({
            time: parseFloat(l.match(/\d+\.\d+/)[0]),
            line: l,
            dev: id,
            hex_bytes: hexstr,
            binary_str: binstr
        })
    }
}
// 
function run(startIndex, max_t) {

    startIndex ? startIndex : 0;
    for (let l_n = startIndex; l_n < filtered_lines.length; l_n++) {
        let l = filtered_lines[l_n];
        if (max_t && l.time > max_t) { return l_n; }
        
        let content = "";
        let timestr = "TIME: " + l.time.toString().padEnd(10);

        for (let s of signals) {
            if (s.dev == l.dev) {
                let bitstr = l.binary_str.substr(s.startbit, s.bitlen);
                let value = parseInt(bitstr, 2);

                if (s.signed) {
                    if (value >= (2**(s.bitlen - 1))) {
                        value -= (2**(s.bitlen));
                    }
                }

                let sec = s.name + ":";
                sec = sec.padEnd(10) + value.toString().padStart(5);
                if (!printlines) { 
                    if (s.displaymode == 'bar') {
                        const barlength = 50;
                        let bar_str = "";
                        let max_val = (2**s.bitlen);

                        if (s.signed) {
                            if (value >= 0) {
                                bar_str = ''.padEnd(barlength / 2) + getBar(barlength * Math.abs(value / max_val));
                            } else {
                                bar_str = '\u001b[7m' + getBar(barlength * (0.5 + (value / max_val)) ).padEnd(barlength / 2) + '\u001b[0m';

                            }
                        } else {
                            bar_str = getBar(barlength * (value / max_val));
                        }

                        bar_str = bar_str.padEnd(barlength);
                        sec += " " + bar_str;
                    }
                    sec += '\n';
                }
                content += sec;
            }

            if (!printlines) {
                process.stdout.write('\033[0;0H' + timestr + '\n\n' + content);
            } else {
                process.stdout.write(timestr + ' ' + content + '\n');
            }
            
        }

    }
    return filtered_lines.length;
}



const fps = 60;
const t0 = (new Date()).getTime();

let next_start_ind = 0;
function replay_loop() {
    let elapsed = ((new Date()).getTime() - t0) / 1000;
    next_start_ind = run(next_start_ind, elapsed);
    if (next_start_ind == filtered_lines.length) {
        process.exit();
    }
}

function getBar(len) {
    const blocks = [ '▏', '▎', '▍', '▌', '▋', '▊', '▉', '█' ];
    let out = '';
    let int_len = parseInt(len);
    let remain = len - int_len;
    for (let i = 0; i < int_len; i++) {
        out += blocks[7];
    }
    let final_ind = parseInt(7 * remain);
    out += blocks[final_ind];
    return out;
}


console.clear();
setInterval(replay_loop, 1000 / fps);
//run();




