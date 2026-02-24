import { Autokit } from '../../';
import { ReadlineParser } from '@serialport/parser-readline';
import * as retry from 'bluebird-retry';

const powerOffMessage = process.env.POWER_OFF_MESSAGE || 'reboot: Power down'
const timeout = Number(process.env.POWER_OFF_TIMEOUT) || 1000*60*5;

/**
 * Checks whether the DUT has powered down by checking for a serial message
 **/
export async function waitForPowerOffSerial(autoKit:Autokit):Promise<void> {
    let serialport: any;
    await retry(async () => {
        serialport = await autoKit.serial.open();
    },
    {
        interval: 500,
        max_tries: 10       
    })
    if(serialport !== undefined){
        return new Promise<void>((resolve, reject) => {

            let timer = setTimeout(async () => {
                await autoKit.serial.close();
                reject(`Timed out while waiting for power down message over serial!`);
            }, timeout)

            // Examine each line of the serial output from the DUT as it comes in
            const parser = serialport.pipe(new ReadlineParser({ delimiter: '\n' }));
            parser.on('data', async(data:string) => {
                console.log(`Serial line: ${data.toString()}`);
                if(data.toString().includes(powerOffMessage)){
                    console.log(`### Detected power off message ###`)
                    await autoKit.power.off();
                    await autoKit.serial.close();
                    clearTimeout(timer);
                    resolve();
                }
            })
        })

    }   
}