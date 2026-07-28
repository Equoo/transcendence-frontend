import { use, useEffect, type JSX } from "react";
import { useFetcher, useSearchParams } from "react-router";
import CheckButton from "../../components/CheckButton";
import Modal from "../../components/Modal";
import MultipleInput from "../../components/MultipleInput";
import type { clientAction as eventAction } from "../routes/events.route";
import { Input } from "../../components/Input";
import { getValidationErrors } from "../../api/problem_detail";
import { TextArea } from "../../components/TextArea";
import type { EventRole } from "../api/event_roles.api";

export default function EventForm({
	rolesPromise,
}: {
	rolesPromise: Promise<EventRole[]>;
}): JSX.Element {
	const eventFetcher = useFetcher<typeof eventAction>();

	const [searchParams] = useSearchParams();
	const showEventForm = searchParams.get("eventForm");
	const roles = use(rolesPromise);
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
						<Input
							name="Name"
							required
							placeholder="Event Name"
							errors={getValidationErrors(eventFetcher.data)}
						/>
						<Input
							name="Date"
							type="datetime-local"
							required
							placeholder="Event Date"
							errors={getValidationErrors(eventFetcher.data)}
						/>
						<Input
							name="Size"
							type="number"
							required
							min="1"
							placeholder="Max Registrations"
							errors={getValidationErrors(eventFetcher.data)}
						/>
						<Input
							name="Location"
							required
							placeholder="Event Location"
							errors={getValidationErrors(eventFetcher.data)}
						/>
						<div className="inline-flex flex-col w-full">
							<label className="text-text font-main font-medium">
								Tags
							</label>
							<MultipleInput
								name="Tags"
								placeholder="Event Tags"
								className="w-full bg-surface border rounded-md border-border2  px-2 py-1 font-main text-text"
							/>
						</div>
						<div className="inline-flex flex-col w-full">
							<label className="text-text font-main font-medium">
								Roles
							</label>
							<MultipleInput
								name="Roles"
								suggestions={roles.map((val) => val.name)}
								placeholder="Event Roles"
								className="w-full bg-surface border rounded-md border-border2  px-2 py-1 font-main text-text"
							/>
						</div>
						<TextArea
							name="Description"
							placeholder="Event Description"
							errors={getValidationErrors(eventFetcher.data)}
						/>
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
