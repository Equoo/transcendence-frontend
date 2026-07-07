import { useEffect, type JSX } from "react";
import { useFetcher, useSearchParams } from "react-router";
import CheckButton from "../../components/CheckButton";
import Modal from "../../components/Modal";
import MultipleInput from "../../components/MultipleInput";
import type { clientAction as eventAction } from "../routes/events.route";
import type { clientLoader as eventRolesLoader } from "../routes/event_roles.route";

export default function EventForm(): JSX.Element {
	const eventFetcher = useFetcher<typeof eventAction>();
	const eventRolesFetcher = useFetcher<typeof eventRolesLoader>();

	const [searchParams, setSearchParams] = useSearchParams();
	const showEventForm = searchParams.get("eventForm");

	useEffect(() => {
		void eventRolesFetcher.load("/events/roles");
	}, []);
	useEffect(() => {
		if (eventFetcher.state === "idle" && eventFetcher.data) {
			setSearchParams((sp) => {
				sp.delete("eventForm");
				return sp;
			});
		}
	}, [eventFetcher.data, eventFetcher.state]);
	return (
		<>
			{showEventForm === null ? null : (
				<Modal name="eventForm" title="Create An Event">
					<p className="text-muted font-main font-light w-4/5 text-sm">
						You will be automatically registered to the event and
						set as the Organizer. You can still unregister after the
						creation.
					</p>
					<eventFetcher.Form
						action="/events"
						method="POST"
						className="flex flex-col items-center w-4/5 gap-5 mb-4"
					>
						<div className="inline-flex flex-col w-full bg-sur">
							<div className="text-red-500">
								<label className="text-text font-main font-medium">
									Name
								</label>
								*
							</div>
							<input
								name="name"
								required
								className="w-full bg-white border rounded-md border-border2 inset-shadow-xs px-2 py-1 font-main text-text"
								placeholder="Event Name"
							/>
						</div>
						<div className="inline-flex flex-col w-full bg-sur">
							<div className="text-red-500">
								<label className="text-text font-main font-medium">
									Date
								</label>
								*
							</div>
							<input
								type="datetime-local"
								required
								name="date"
								className="w-full bg-white border rounded-md border-border2 inset-shadow-xs px-2 py-1 font-main text-text"
							/>
						</div>
						<div className="inline-flex flex-col w-full">
							<div className="text-red-500">
								<label className="text-text font-main font-medium">
									Size
								</label>
								*
							</div>
							<input
								name="size"
								type="number"
								required
								min="1"
								className="w-full bg-white border rounded-md border-border2 inset-shadow-xs px-2 py-1 font-main text-text"
								placeholder="Max Registrations"
							/>
						</div>
						<div className="inline-flex flex-col w-full">
							<div className="text-red-500">
								<label className="text-text font-main font-medium">
									Location
								</label>
								*
							</div>
							<input
								name="location"
								required
								className="w-full bg-white border rounded-md border-border2 inset-shadow-xs px-2 py-1 font-main text-text"
								placeholder="Event Location"
							/>
						</div>
						<div className="inline-flex flex-col w-full">
							<label className="text-text font-main font-medium">
								Tags
							</label>
							<MultipleInput
								name="tags"
								placeholder="Event Tags"
								className="w-full bg-white border rounded-md border-border2 inset-shadow-xs px-2 py-1 font-main text-text"
							/>
						</div>
						<div className="inline-flex flex-col w-full">
							<label className="text-text font-main font-medium">
								Roles
							</label>
							<MultipleInput
								name="roles"
								suggestions={eventRolesFetcher.data?.map(
									(val) => val.name,
								)}
								placeholder="Event Roles"
								className="w-full bg-white border rounded-md border-border2 inset-shadow-xs px-2 py-1 font-main text-text"
							/>
						</div>
						<div className="inline-flex flex-col w-full">
							<label className="text-text font-main font-medium">
								Description
							</label>
							<textarea
								name="description"
								className="w-full bg-white border rounded-md border-border2 inset-shadow-xs px-2 py-1 font-main text-text"
								placeholder="Event Description"
							/>
						</div>
						<CheckButton
							active
							type="submit"
							pending={eventFetcher.state !== "idle"}
						>
							Ok
						</CheckButton>
					</eventFetcher.Form>
				</Modal>
			)}
		</>
	);
}
