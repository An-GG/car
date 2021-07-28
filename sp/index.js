const SerialPort = require("serialport");

async function main() {
    let l = await SerialPort.list();
    let path = "";
    for (let sp of l) {
        if (sp.manufacturer && sp.manufacturer.includes('Arduino')) {
            path = sp.path;
        }
    }

    let s = new SerialPort(path, { baudRate: 115200 }, (error)=>{ if (error) {
        throw new Error(error.message);
    } });

    s.on('readable', ()=>{
        console.log(s.read().toString());
    })


    console.log(path);
}


async function main2() {
    let s = new SerialPort('/Users/ankushgirotra/Desktop/abc.txt', {}, (err)=>{
        if (err) {
            console.log(err);
        }
    });

    s.on('readable', ()=>{
        console.log(s.read().toString());
    })
}

async function main3() {
    let s = new SerialPort('/dev/tty.usbmodem14101', { baudRate:115200 }, (err)=>{
        if (err) {
            console.log(err);
        }
    });

    s.on('readable', ()=>{
        console.log(s.read(4).toString());
        process.exit(0);
    })
}

main3();
