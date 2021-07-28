const SerialPort = require('serialport');

async function main() {
    let port = new SerialPort('/dev/ttyp5', { autoOpen: false });
    port.open(function (err) {
        if (err) {
            return console.log('Error opening port: ', err.message)
        }

        // Because there's no callback to write, write errors will be emitted on the port:
        let strm = port.write('main screen turn on', 'utf8', (errr) => {
            if (errr) {
                throw new Error(errr.message);
            }
            console.log('write complete');
        });
        console.log(strm);
    })

}

main();
