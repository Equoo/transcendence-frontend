import EventCard from "../components/EventCard";
import type { JSX } from "react";

export default function Home(): JSX.Element {
	return (
		<>
			<div></div>
			<div className="flex gap-3">
				<EventCard />
				<EventCard />
			</div>
		</>
	);
}
