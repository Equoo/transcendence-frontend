import { type JSX, useState } from "react";
import { PiDeviceMobile, PiDeviceTablet } from "react-icons/pi";

import { Segmented } from "@/ui";

import { Section } from "./sections";

const DEVICES = {
	phone: { width: 390, height: 780 },
	tablet: { width: 820, height: 900 },
} as const;

type Device = keyof typeof DEVICES;

/** This page inside a device-sized frame, to try phone / tablet layouts from a desktop */
export function DevicePreview(): JSX.Element {
	const [device, setDevice] = useState<Device>("phone");
	const { width, height } = DEVICES[device];

	return (
		<Section id="preview" title="Device preview">
			<Segmented
				label="Device"
				value={device}
				onChange={setDevice}
				options={[
					{ value: "phone", label: "Phone 390px", icon: PiDeviceMobile },
					{ value: "tablet", label: "Tablet 820px", icon: PiDeviceTablet },
				]}
				className="self-start"
			/>
			<p className="-mt-2 text-ui-xs text-text2">
				Real layout at that width: drawer navigation and bottom sheets on phone, icon rail on tablet. For touch
				events (long press, native select, bigger targets) use the browser's device mode.
			</p>
			<div className="overflow-x-auto rounded-ui-lg bg-back2 p-4">
				<iframe
					key={device}
					title={`${device} preview`}
					src="/_ui?embed"
					// Same-origin dev page: needs the session cookie and scripts
					// eslint-disable-next-line @eslint-react/dom-no-unsafe-iframe-sandbox
					sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
					width={width}
					height={height}
					className="mx-auto block rounded-[2rem] border-8 border-text bg-back shadow-ui-lg"
				/>
			</div>
		</Section>
	);
}
