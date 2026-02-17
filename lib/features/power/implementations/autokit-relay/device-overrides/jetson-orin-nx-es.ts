import { delay } from 'bluebird';
import { AutokitRelay } from "..";

// Device specific override for jetson-orin-nx-es power on / off sequencings
// This implmentation assumes that there are 2 relays or relay channels
// The primary relay, inherited from the parent class is connected to the mains (super.on() ... etc)
// The secondary relay, initialised in the child class here is connected to the "ignition" jumper on the board
// The assumed behaviour is:
// 1. when powering on the board via the mains, we have to short the ignition pins to make the orin power on
// 2. A short time after, we have to unshort the ignition. The board, if powered, will remain powered on
// 3. From this point, a "shutdown" command from the OS on the Orin will power the board down. If the ignition was still shorted, the board will automatically power on again - which we don't want.
// 4. Powering off, we will cut the mains, and unshort the ignition. 

export class JetsonOrinNxEs extends AutokitRelay {
    // Instantiate a second relay object to act as the power button relay
    public ignitionRelay: AutokitRelay;

    constructor(){
        super();
        this.ignitionRelay = new AutokitRelay(
            (process.env.IGNITION_RELAY_SERIAL || 'HURTM'), 
            Number(process.env.IGNITION_RELAY_NUM || '0'),
            (process.env.IGNITION_RELAY_CONN === 'NC') ? false: true,
        )
    }

    async setup(): Promise<void> {
        super.setup();
        console.log(`Ignition button Relay ID: ${this.ignitionRelay.relayId} is on HID path: ${this.ignitionRelay.powerRelay.devicePath}, channel: ${this.ignitionRelay.relayNum}`)
    }

    // Power on the DUT
    async on(): Promise<void> {
        // How long to wait before toggling ignition OFF after applying power. Set via env var, default 10s.
        // This is a blocking delay - but that is fine as it will prevent other commands being sent during this period that might leave us in unknown state
        const IGNITION_DELAY = Number(process.env.IGNITION_DELAY) || 10*1000
        
        console.log(`Triggering jetson-orin-nx-es power on sequence...`);
        // To power on the board by connecting the mains, the ignition must be on
        await delay(1000);
        await this.ignitionRelay.on();
        await delay(3000); // short delay to ensure that the jumper has been shorted - accounts for any delays in sending USB commands
        await super.on(); // Toggles on mains power to the DUT
        await delay(IGNITION_DELAY); 
        await this.ignitionRelay.off() // toggles the ignition jumper relay off - from this point on, a poweroff/shutdown from the SoM will cause a complete power down, without restart
        await delay(1000); // Add another second of waiting account for delays with the USB commands
        console.log(`Triggered power on sequence on jetson-orin-nx-es!`); 
    }

    // Power off the DUT
    async off(): Promise<void> {
        // Always power off via mains - to ensure the device is really off
        console.log(`Powering off DUT by switching off mains...`)
        await super.off()
        await this.ignitionRelay.off() // Toggle off the ignition relay - ensure we start from a known state every time
    }
}
