import { Suspense, useState, type JSX } from "react";
import { Await, useFetcher } from "react-router";
import CheckButton from "../../components/CheckButton";
import Modal from "../../components/Modal";
import MultipleInput from "../../components/MultipleInput";
import type { clientAction as eventAction } from "../routes/events.route";
import { Input } from "../../components/Input";
import { getValidationErrors } from "../../api/problem_detail";
import { TextArea } from "../../components/TextArea";
import { PiPlusBold } from "react-icons/pi";
import type { EventRole } from "../api/event_roles.api";

export default function EventForm({
	className,
	roles,
}: {
	className?: string;
	roles: EventRole[] | Promise<EventRole[]>;
}): JSX.Element {
	const eventFetcher = useFetcher<typeof eventAction>();
	const [showEventForm, setShowEventForm] = useState(false);

	return (
		<Suspense
			fallback={
				<CheckButton
					type="button"
					className={className}
					disabled
					pending
				>
					Event
				</CheckButton>
			}
		>
			<CheckButton
				type="button"
				className={className}
				active
				activeCheck={false}
				onClick={() => {
					setShowEventForm(true);
				}}
			>
				<PiPlusBold />
				Event
			</CheckButton>
			{showEventForm && (
				<Modal
					name="eventForm"
					title="Create An Event"
					onClose={() => {
						setShowEventForm(false);
					}}
				>
					<p className="text-muted font-main font-light w-4/5 text-sm">
						You will be automatically set as the Organizer. You can
						still register and unregister after the creation.
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
							{roles instanceof Promise ? (
								<Await resolve={roles}>
									{(value) => (
										<MultipleInput
											name="Roles"
											suggestions={value.map(
												(role) => role.name,
											)}
											placeholder="Event Roles"
											className="w-full bg-surface border rounded-md border-border2  px-2 py-1 font-main text-text"
										/>
									)}
								</Await>
							) : (
								<MultipleInput
									name="Roles"
									suggestions={roles.map((role) => role.name)}
									placeholder="Event Roles"
									className="w-full bg-surface border rounded-md border-border2  px-2 py-1 font-main text-text"
								/>
							)}
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
		</Suspense>
	);
}
