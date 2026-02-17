# autokitRelay

## Hardware 

This is for these USB relays (example, they are everywhere): https://www.amazon.co.uk/Control-Intelligent-Channel-Controller-Support-default/dp/B07PWPF2DT/

They used a HID interface and are controllable via:

- https://github.com/darrylb123/usbrelay
- https://github.com/josephdadams/USBRelay

## Dependencies

## Configuration

- `POWER_RELAY_SERIAL`: the serial of the relay. An example of how to obtain that is here: https://github.com/darrylb123/usbrelay?tab=readme-ov-file#usage 
- `POWER_RELAY_NUM`: for specifying which channel of the relay is being used for the power control of the DUT in the case of multiple channels being on the relay. Default is `0` which leads to all channels being toggled - actual channel numbers start at `1`
- `USB_RELAY_CONN`: `NO` or `NC` - for selecting if the normally open or closed configuration is used - default is `NO` and recommended
- `GPIO_POWER_DET` : (Tx2 specific) - for selecting the GPIO pin to be used for power state detection
- `POWER_BTN_RELAY_SERIAL`: (`jetson-orin-nx-xv3` specific) - Select the serial of the secondary relay used to simulate power button presses  
- `POWER_BTN_RELAY_NUM`: (`jetson-orin-nx-xv3` specific) - Select the channel of the secondary relay used to simulate power button presses 
- `POWER_BTN_RELAY_CONN`:  (`jetson-orin-nx-xv3` specific) - Select the NO/NC configuration of the secondary relay used to simulate power button presses 
- `IGNITION_RELAY_SERIAL`: (`jetson-orin-nx-es` specific) - Select the serial of the secondary relay used to short the ignition jumper 
- `IGNITION_RELAY_NUM`: (`jetson-orin-nx-es` specific) - Select the channel of the secondary relay used to short the ignition jumper  
- `IGNITION_RELAY_CONN`:  (`jetson-orin-nx-es` specific) - Select the NO/NC configuration of the secondary relay used to short the ignition jumper  
- `IGNITION_DELAY`: (`jetson-orin-nx-es` specific) - How long to wait after applying mains power, before unshorting the ignition jumper

