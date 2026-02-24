const SerialPort  = require('serialport');

export class Ftdi implements Serial {
    public DEV_SERIAL = process.env.DEV_SERIAL || '/dev/ttyUSB0';
    public BAUD_RATE = Number(process.env.BAUD_RATE || 115200);
    public serial : any;
    constructor(){
        this.serial = new SerialPort(
            this.DEV_SERIAL,
            {
                baudRate: this.BAUD_RATE,
                autoOpen: false,
            });
    
    }

    async setup(): Promise<void> {
    }

    async open(){
        return new Promise((resolve, reject) => {
            if (this.serial.isOpen) {
                console.log(`Serial already open!`)
                return resolve(this.serial);
            }

            this.serial.open((err: Error | null) => {
                console.log(`Opening Serial port ${this.DEV_SERIAL} with baud rate: ${this.BAUD_RATE}`)
                if (err) {
                    return reject(err);
                }
                console.log('DUT serial is opened');
                this.serial?.flush();
                resolve(this.serial)
            });
        });
    }

    async write(data: string): Promise<string | void>  {
        if(this.serial.isOpen){
                this.serial.write(`${data}\r`);
        } else {
            return `Serial connection not open`
        }
    }

    async read(): Promise<string>{
        if(this.serial.isOpen){
            let res = this.serial.read();
            if(res !== null){
                return (res.toString())
            } else {
                return 'No response from DUT...'
            }
        } else {
            return `Serial connection not open`
        }
    }

    async close(): Promise<void>{
        if(this.serial.isOpen){
            this.serial.close();
        } else (
            console.log('Serial already closed!')
        )
    }
    

    async teardown(): Promise<void> {
        await this.close()
    }
            
}
