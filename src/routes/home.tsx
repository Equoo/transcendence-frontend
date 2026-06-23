import EventForm from "../components/Events/EventForm";
import CheckButton from "../components/CheckButton";
import {
	createEvent,
	fetchEvents,
	type EventActionResult,
	type EventData,
} from "../lib/events";
import type { JSX } from "react";
import { PiPlusBold } from "react-icons/pi";
import {
	isRouteErrorResponse,
	useRouteError,
	useSearchParams,
	Form,
	redirect,
} from "react-router";
import type { Route } from "./+types/home";
import EventList from "../components/Events/EventList";

export async function clientLoader(): Promise<EventData[]> {
	return fetchEvents();
}

export async function clientAction({
	request,
}: Route.ClientActionArgs): Promise<EventActionResult | Response> {
	const res = await createEvent(await request.formData());

	if (!res.ok) {
		return res;
	}
	return redirect("/");
}

export default function Home({
	loaderData: events,
}: Route.ComponentProps): JSX.Element {
	const [searchParams] = useSearchParams();
	const showEventForm = searchParams.get("eventForm");

	return (
		<>
			<div className="w-full flex flex-row px-6 py-4 justify-between items-center">
				<h1 className="font-semibold tracking-tight text-xl">
					Accueil
				</h1>
				<Form>
					<CheckButton
						type="submit"
						active
						activeCheck={false}
						name="eventForm"
					>
						<PiPlusBold />
						Event
					</CheckButton>
				</Form>
			</div>
			<EventList events={events} />
			{showEventForm === null ? null : <EventForm />}
		</>
	);
}

export function ErrorBoundary(): JSX.Element {
	const error = useRouteError();

	if (isRouteErrorResponse(error)) {
		return (
			<div className="w-full p-6 text-red-500 font-main">
				{error.status} — {error.statusText}
			</div>
		);
	}

	return (
		<div className="w-full p-6 text-red-500 font-main">
			Server error during page loading
		</div>
	);
}
