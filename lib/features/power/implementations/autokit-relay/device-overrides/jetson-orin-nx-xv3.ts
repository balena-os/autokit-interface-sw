import { delay } from 'bluebird';
import { AutokitRelay } from "..";

// Device specific override for jetson-orin-nx-xv3 power on / off sequencing
// This implmentation assumes that there are 2 relays or relay channels
// The primary relay, inherited from the parent class is connected to the mains (super.on() ... etc)
// The secondary relay, initialised in the child class here is connected to the power button
export class JetsonOrinNxXv3 extends AutokitRelay {
    // Instantiate a second relay object to act as the power button relay
    public pwrBtnRelay: AutokitRelay;

    constructor(){
        super();
        this.pwrBtnRelay = new AutokitRelay(
            (process.env.POWER_BTN_RELAY_SERIAL || 'HURTM'), 
            Number(process.env.POWER_BTN_RELAY_NUM || '0'),
            (process.env.POWER_BTN_RELAY_CONN === 'NC') ? false: true,
        )
    }

    async setup(): Promise<void> {
        super.setup();
        console.log(`Power button Relay ID: ${this.pwrBtnRelay.relayId} is on HID path: ${this.pwrBtnRelay.powerRelay.devicePath}, channel: ${this.pwrBtnRelay.relayNum}`)
    }

    // Power on the DUT
    async on(): Promise<void> {
        // Trigger power on via a short button press - by toggling on, waiting, then toggling off
        console.log(`Triggering jetson-orin-nx-xv3 power on sequence...`);
        await delay(1000);
        await super.on(); // Toggles on mains power - ensures that it is on
        await delay(1000); // Add a second of waiting to account for delays with the USB commands
        await this.pwrBtnRelay.on(); // toggles the power button relay to high to simulate the button press
        await delay(3000); // wait to simulate the period the button is held down
        await this.pwrBtnRelay.off() // toggles the power button relay to high to simulate letting go of the button
        await delay(1000); // Add another second of waiting account for delays with the USB commands
        console.log(`Triggered power on sequence on jetson-orin-nx-xv3!`); 
    }

    // Power off the DUT
    async off(): Promise<void> {
        // Always power off via mains - to ensure the device is really off
        console.log(`Powering off DUT by switching off mains...`)
        await super.off()
    }
}
