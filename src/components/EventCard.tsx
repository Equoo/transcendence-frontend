import { GoDotFill, GoPeople } from "react-icons/go";
import { type JSX, useState } from "react";
import CheckButton from "./CheckButton";
import EventBadge from "./EventBadge";
import { FiChevronRight } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { PiClockCountdownLight } from "react-icons/pi";

export default function EventCard(): JSX.Element {
	const [presence, setPresence] = useState<"here" | "maybe" | "">();

	function handlePresence(btn: "here" | "maybe" | ""): void {
		btn === presence ? setPresence("") : setPresence(btn);
	}

	return (
		<div className="bg-surface flex max-w-xl w-fit h-fit flex-col gap-4 overflow-hidden border border-border rounded-3xl p-6 shadow-main sm:p-8">
			<div className="flex flex-nowrap items-center gap-2.5 overflow-auto whitespace-nowrap scrollbar-thin pb-1">
				<EventBadge>
					<GoDotFill size={12} color="#e8743c" />
					PvP
				</EventBadge>
				<EventBadge>
					<PiClockCountdownLight size={16} />
					Ce Soir | 20:30
				</EventBadge>
			</div>
			<h2 className=" text-3xl font-semibold font-head leading-8 text-text tracking-tight">
				Tactical Strike -- Stanton
			</h2>
			<div className="inline-flex items-center text-text2 text-sm gap-2">
				<IoLocationOutline />
				<span>Seraphim Station</span>
			</div>
			<div className="flex items-center gap-3">
				<div
					id="countdown"
					className="flex flex-col font-head font-bold text-3xl"
				>
					01:17:56
					<small className="text-muted font-semibold text-xs tracking-wider">
						BEFORE START
					</small>
				</div>
				<EventBadge border="" bg="bg-good-soft" text="text-good">
					<GoPeople />
					21/30 Registered
				</EventBadge>
			</div>
			<div className="flex flex-wrap gap-2.5 items-center whitespace">
				<CheckButton
					active={presence === "here"}
					onClick={() => {
						handlePresence("here");
					}}
				>
					I'm here
				</CheckButton>
				<CheckButton
					active={presence === "maybe"}
					onClick={() => {
						handlePresence("maybe");
					}}
				>
					Maybe
				</CheckButton>
				<CheckButton discrete>
					Details <FiChevronRight />
				</CheckButton>
			</div>
		</div>
	);
}
