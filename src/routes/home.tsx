import EventCard from "../components/EventCard";
import type { JSX } from "react";

export default function Home(): JSX.Element {
	return (
		<>
			<div></div>
			<div className="w-full flex px-4 py-8 gap-8 flex-nowrap overflow-auto">
				<EventCard />
				<EventCard />
			</div>
		</>
	);
}
