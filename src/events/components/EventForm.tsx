import { type JSX, useEffect, useState } from "react";
import { PiPlusBold } from "react-icons/pi";
import { TbPencil } from "react-icons/tb";
import { useFetcher } from "react-router";

import Promisable from "@/components/Promisable";

import { APIError, type ValidationErrors } from "../../api/problem_detail";
import CheckButton from "../../components/CheckButton";
import { Input } from "../../components/Input";
import Modal from "../../components/Modal";
import MultipleInput from "../../components/MultipleInput";
import { TextArea } from "../../components/TextArea";
import type { AppFile } from "../../files/api/files.api";
import FileSelect from "../../files/components/FileSelect";
import type { EventRole } from "../api/event_roles.api";
import type { EventData } from "../api/events.api";
import type { clientAction as eventAction } from "../routes/events.route";

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
	const [errors, setErrors] = useState<ValidationErrors>();
	const eventFetcher = useFetcher<typeof eventAction>();
	const [showEventForm, setShowEventForm] = useState(false);

	useEffect(() => {
		if (eventFetcher.data) {
			if (eventFetcher.data instanceof APIError) {
				// eslint-disable-next-line @eslint-react/set-state-in-effect
				setErrors(eventFetcher.data.problem.errors);
			} else {
				// eslint-disable-next-line @eslint-react/set-state-in-effect
				setShowEventForm(false);
			}
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
									maxLength={55}
									name="Name"
									value={event?.name}
									required
									errors={errors}
									placeholder="Event Name"
								/>
								<Input
									name="Date"
									value={event?.date.substring(
										0,
										event.date.lastIndexOf(":"),
									)}
									type="datetime-local"
									required
									errors={errors}
									placeholder="Event Date"
								/>
								<Input
									max={2147483646}
									name="Size"
									value={event?.size}
									type="number"
									required
									min="1"
									errors={errors}
									placeholder="Max Registrations"
								/>
								<Input
									maxLength={50}
									name="Location"
									value={event?.location}
									required
									errors={errors}
									placeholder="Event Location"
								/>
								<MultipleInput
									name="Tags"
									values={event?.tags}
									placeholder="Event Tags"
									errors={errors}
									className="w-full bg-surface border rounded-md border-border2  px-2 py-1 font-main text-text"
								/>
								<MultipleInput
									name="Roles"
									values={event?.eventRoles.map(
										(role) => role.name,
									)}
									suggestions={roles.map((role) => role.name)}
									placeholder="Event Roles"
									errors={errors}
									className="w-full bg-surface border rounded-md border-border2  px-2 py-1 font-main text-text"
								/>
								<TextArea
									name="Description"
									value={event?.description}
									placeholder="Event Description"
									errors={errors}
								/>
								<Promisable data={filesInput}>
									{(files) => (
										<FileSelect
											files={files}
											selectedKeys={event?.files.map(
												(file) => file.key,
											)}
											errors={errors}
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
