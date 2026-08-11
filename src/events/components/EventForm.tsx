import { useEffect, useState, type JSX } from "react";
import { useFetcher } from "react-router";
import CheckButton from "../../components/CheckButton";
import Modal from "../../components/Modal";
import MultipleInput from "../../components/MultipleInput";
import type { clientAction as eventAction } from "../routes/events.route";
import { Input } from "../../components/Input";
import { getValidationErrors } from "../../api/problem_detail";
import { TextArea } from "../../components/TextArea";
import { PiPlusBold } from "react-icons/pi";
import type { EventRole } from "../api/event_roles.api";
import Promisable from "./Promisable";
import FileSelect from "../../files/components/FileSelect";
import type { AppFile } from "../../files/api/files.api";

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
									errors={getValidationErrors(
										eventFetcher.data,
									)}
								/>
								<Input
									name="Date"
									type="datetime-local"
									required
									placeholder="Event Date"
									errors={getValidationErrors(
										eventFetcher.data,
									)}
								/>
								<Input
									name="Size"
									type="number"
									required
									min="1"
									placeholder="Max Registrations"
									errors={getValidationErrors(
										eventFetcher.data,
									)}
								/>
								<Input
									name="Location"
									required
									placeholder="Event Location"
									errors={getValidationErrors(
										eventFetcher.data,
									)}
								/>
								<MultipleInput
									name="Tags"
									placeholder="Event Tags"
									className="w-full bg-surface border rounded-md border-border2  px-2 py-1 font-main text-text"
									errors={getValidationErrors(
										eventFetcher.data,
									)}
								/>
								<MultipleInput
									name="Roles"
									suggestions={roles.map(
										(role) => role.name,
									)}
									placeholder="Event Roles"
									className="w-full bg-surface border rounded-md border-border2  px-2 py-1 font-main text-text"
									errors={getValidationErrors(
										eventFetcher.data,
									)}
								/>
								<TextArea
									name="Description"
									placeholder="Event Description"
									errors={getValidationErrors(
										eventFetcher.data,
									)}
								/>
								<Promisable data={filesInput}>
									{(files) => (
										<FileSelect
											files={files}
											name="Files"
											errors={getValidationErrors(
												eventFetcher.data,
											)}
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
