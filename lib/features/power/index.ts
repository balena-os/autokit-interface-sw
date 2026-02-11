import { AutokitRelay } from "./implementations/autokit-relay";
import { DummyPower } from "./implementations/dummy-power";
import { Crelay } from "./implementations/crelay";
import { JetsonTx2Power } from "./implementations/autokit-relay/device-overrides/jetson-tx2";
import { JetsonOrinNxXv3 } from "./implementations/autokit-relay/device-overrides/jetson-orin-nx-xv3";
import { JetsonOrinNxEs } from "./implementations/autokit-relay/device-overrides/jetson-orin-nx-es";

const powerImplementations: {[key: string]: Type<Power> } = {
	autokitRelay: AutokitRelay,
	dummyPower: DummyPower,
	crelay: Crelay,
	jetsonTx2: JetsonTx2Power,
	jetsonOrinNxXv3: JetsonOrinNxXv3,
	jetsonOrinNxEs: JetsonOrinNxEs
};

export { powerImplementations }