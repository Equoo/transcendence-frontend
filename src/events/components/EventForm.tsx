import { type JSX, useEffect, useState } from "react";
import { PiPlusBold } from "react-icons/pi";
import { useFetcher } from "react-router";

import Promisable from "@/components/Promisable";

import CheckButton from "../../components/CheckButton";
import { Input } from "../../components/Input";
import Modal from "../../components/Modal";
import MultipleInput from "../../components/MultipleInput";
import { TextArea } from "../../components/TextArea";
import type { AppFile } from "../../files/api/files.api";
import FileSelect from "../../files/components/FileSelect";
import type { EventRole } from "../api/event_roles.api";
import type { clientAction as eventAction } from "../routes/events.route";

export default function EventForm({
	className,
	roles: rolesInput,
	files: filesInput,
}: {
	className?: string;
	roles: EventRole[] | Promise<EventRole[]>;
	files: AppFile[] | Promise<AppFile[]>;
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
				<CheckButton
					type="button"
					className={className}
					disabled
					pending
				>
					Event
				</CheckButton>
			}
			data={rolesInput}
		>
			{(roles) => (
				<>
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
								action="/events"
								method="POST"
								className="flex flex-col items-center w-4/5 gap-5 mb-4"
							>
								<Input
									name="Name"
									required
									placeholder="Event Name"
								/>
								<Input
									name="Date"
									type="datetime-local"
									required
									placeholder="Event Date"
								/>
								<Input
									name="Size"
									type="number"
									required
									min="1"
									placeholder="Max Registrations"
								/>
								<Input
									name="Location"
									required
									placeholder="Event Location"
								/>
								<MultipleInput
									name="Tags"
									placeholder="Event Tags"
									className="w-full bg-surface border rounded-md border-border2  px-2 py-1 font-main text-text"
								/>
								<MultipleInput
									name="Roles"
									suggestions={roles.map((role) => role.name)}
									placeholder="Event Roles"
									className="w-full bg-surface border rounded-md border-border2  px-2 py-1 font-main text-text"
								/>
								<TextArea
									name="Description"
									placeholder="Event Description"
								/>
								<Promisable data={filesInput}>
									{(files) => (
										<FileSelect
											files={files}
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
