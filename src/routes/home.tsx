import { PiCheckFatFill, PiClockCountdownLight } from "react-icons/pi";
import CheckButton from "../components/Sidebar/CheckButton";
import EventBadge from "../components/Sidebar/EventBadge";
import { GoDotFill } from "react-icons/go";
import type { JSX } from "react";

export default function Home(): JSX.Element {
	return (
		<div className="bg-surface flex max-w-3xl max-h-full flex-col gap-4 overflow-hidden border border-border rounded-3xl p-6 shadow-main sm:p-8">
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
			<h2 className="mb-3 text-3xl font-semibold font-head leading-8 text-text">
				Tactical Strike -- Stanton
			</h2>
			<div className="flex flex-wrap gap-2.5 items-center whitespace">
				<CheckButton active>
					<PiCheckFatFill /> I'm here
				</CheckButton>
				<CheckButton>Maybe</CheckButton>
				<CheckButton discrete>Details</CheckButton>
			</div>
		</div>
	);
}
