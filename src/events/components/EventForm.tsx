import { useEffect, useState, type JSX } from "react";
import { useFetcher } from "react-router";
import CheckButton from "../../components/CheckButton";
import Modal from "../../components/Modal";
import MultipleInput from "../../components/MultipleInput";
import type { clientAction as eventAction } from "../routes/events.route";
import { Input } from "../../components/Input";
import { TextArea } from "../../components/TextArea";
import { PiPlusBold } from "react-icons/pi";
import type { EventRole } from "../api/event_roles.api";
import Promisable from "./Promisable";
import FileSelect from "../../files/components/FileSelect";
import type { AppFile } from "../../files/api/files.api";
import type { EventData } from "../api/events.api";
import { TbPencil } from "react-icons/tb";

export default function EventForm({
	className,
	roles: rolesInput,
	files: filesInput,
	event,
	edit = false,
}: {
	className?: string;
	roles: EventRole[] | Promise<EventRole[]>;
	files: AppFile[] | Promise<AppFile[]>;
	event?: EventData;
	edit?: boolean;
}): JSX.Element {
	const eventFetcher = useFetcher<typeof eventAction>();
	const [showEventForm, setShowEventForm] = useState(false);

	useEffect(() => {
		if (eventFetcher.data) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowEventForm(false);
		}
	}, [eventFetcher.data]);
	return (
		<Promisable
			skeleton={
				edit || (
					<CheckButton
						type="button"
						className={className}
						disabled
						pending
					>
						Event
					</CheckButton>
				)
			}
			data={rolesInput}
		>
			{(roles) => (
				<>
					{edit ? (
						<TbPencil
							size={26}
							color="var(--color-text2)"
							className={`cursor-pointer ${className}`}
							onClick={() => {
								setShowEventForm(true);
							}}
						/>
					) : (
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
					)}

					{showEventForm && (
						<Modal
							title="Create An Event"
							onClose={() => {
								setShowEventForm(false);
							}}
						>
							<p className="text-muted font-main font-light w-4/5 text-sm">
								You will be automatically set as the Organizer.
								You can still register and unregister after the
								creation.
							</p>
							<eventFetcher.Form
								action={
									event ? `/events/${event.id}` : "/events"
								}
								method={event ? "PUT" : "POST"}
								className="flex flex-col items-center w-4/5 gap-5 mb-4"
							>
								<Input
									name="Name"
									value={event?.name}
									required
									placeholder="Event Name"
								/>
								<Input
									name="Date"
									value={event?.date.substring(0, event.date.lastIndexOf(':'))}
									type="datetime-local"
									required
									placeholder="Event Date"
								/>
								<Input
									name="Size"
									value={event?.size}
									type="number"
									required
									min="1"
									placeholder="Max Registrations"
								/>
								<Input
									name="Location"
									value={event?.location}
									required
									placeholder="Event Location"
								/>
								<MultipleInput
									name="Tags"
									values={event?.tags}
									placeholder="Event Tags"
									className="w-full bg-surface border rounded-md border-border2  px-2 py-1 font-main text-text"
								/>
								<MultipleInput
									name="Roles"
									values={event?.eventRoles.map(
										(role) => role.name,
									)}
									suggestions={roles.map((role) => role.name)}
									placeholder="Event Roles"
									className="w-full bg-surface border rounded-md border-border2  px-2 py-1 font-main text-text"
								/>
								<TextArea
									name="Description"
									value={event?.description}
									placeholder="Event Description"
								/>
								<Promisable data={filesInput}>
									{(files) => (
										<FileSelect
											files={files}
											selectedKeys={event?.files.map(
												(file) => file.key,
											)}
											name="Files"
										/>
									)}
								</Promisable>

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
			)}
		</Promisable>
	);
}
