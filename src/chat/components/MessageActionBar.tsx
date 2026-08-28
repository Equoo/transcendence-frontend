import { type Ref, useImperativeHandle, useRef, useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { PiArrowArcLeft, PiDotsThree, PiPencil, PiTrash } from "react-icons/pi";

import IconBtn from "@/components/IconBtn";

export interface MessageActionBarHandles {
	show: (e: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>) => void;
	hide: () => void;
}

interface ActionBar {
	msg: string,
	el: HTMLDivElement,
	top: number,
	left: number
}

function MessageActionBar({ ref }: {
	ref?: Ref<MessageActionBarHandles>;
}): JSX.Element {
	const [actionBar, setActionBar] = useState<ActionBar | null>(null);
	const actionBarTimerRef = useRef<number | null>(null);

	useImperativeHandle(ref, () => ({
		show: (ev: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>): void => {
			if (actionBarTimerRef.current) { clearTimeout(actionBarTimerRef.current); }

			const row = ev.currentTarget;
			if (typeof row === "undefined") { return; }
			row.ariaSelected = "true";

			setActionBar((prev) => {
				if (prev && prev.el !== row) { prev.el.ariaSelected = "false"; }

				return {
					msg: row.dataset.id ?? "undefined",
					el: row,
					top: row.offsetTop - (row.parentElement?.scrollTop ?? 0) - 20,
					left: row.offsetLeft + row.offsetWidth / 2
				};
			});
		},
		hide: (): void => {
			actionBarTimerRef.current = setTimeout(() => {
				setActionBar((prev) => {
					if (prev) { prev.el.ariaSelected = "false"; }
					return null;
				});
			}, 80);
		}
	}));

	if (!actionBar) { return (<div></div>); }
	return (
		<div
			style={{ top: actionBar.top, left: actionBar.left }}
			onMouseEnter={() => {
				actionBarTimerRef.current && clearTimeout(actionBarTimerRef.current);
			}}
			className="absolute flex flex-row z-50 -translate-x-1/2">
			<IconBtn icon={PiArrowArcLeft} size={14}></IconBtn>
			<IconBtn icon={PiPencil} size={14}></IconBtn>
			<IconBtn icon={PiTrash} className="text-red-400" size={14}></IconBtn>
			<IconBtn icon={PiDotsThree} size={14}></IconBtn>
		</div>
	)
}

export default MessageActionBar;
