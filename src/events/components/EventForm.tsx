import { type JSX, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiPlusBold } from "react-icons/pi";
import { TbPencil } from "react-icons/tb";
import { useFetcher } from "react-router";

import Promisable from "@/components/Promisable";

import { APIError, type ValidationErrors } from "../../api/problem_detail";
import CheckButton from "../../components/Button/CheckButton";
import { Input } from "../../components/Input/Input";
import MultipleInput from "../../components/Input/MultipleInput";
import { TextArea } from "../../components/Input/TextArea";
import Modal from "../../components/Modal/Modal";
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
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
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
					<CheckButton type="button" className={className} disabled>
						{t("events.event")}
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
							{t("events.event")}
						</CheckButton>
					)}

					{showEventForm && (
						<Modal
							title={
								edit
									? t("events.editTitle")
									: t("events.createTitle")
							}
							onClose={() => {
								setShowEventForm(false);
							}}
						>
							<p className="text-muted font-main font-light w-4/5 text-sm">
								{t("events.formHint")}
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
									label={t("common.name")}
									value={event?.name}
									required
									errors={errors}
									placeholder={t(
										"events.namePlaceholder",
									)}
								/>
								<Input
									name="Date"
									label={t("events.date")}
									value={event?.date.substring(
										0,
										event.date.lastIndexOf(":"),
									)}
									type="datetime-local"
									required
									errors={errors}
									placeholder={t(
										"events.datePlaceholder",
									)}
								/>
								<Input
									max={2147483646}
									name="Size"
									label={t("events.size")}
									value={event?.size}
									type="number"
									required
									min="1"
									errors={errors}
									placeholder={t(
										"events.sizePlaceholder",
									)}
								/>
								<Input
									maxLength={50}
									name="Location"
									label={t("events.location")}
									value={event?.location}
									required
									errors={errors}
									placeholder={t(
										"events.locationPlaceholder",
									)}
								/>
								<MultipleInput
									name="Tags"
									label={t("events.tags")}
									values={event?.tags}
									placeholder={t(
										"events.tagsPlaceholder",
									)}
									errors={errors}
									className="w-full bg-surface border rounded-md border-border2  px-2 py-1 font-main text-text"
								/>
								<MultipleInput
									name="Roles"
									label={t("events.roles")}
									values={event?.eventRoles.map(
										(role) => role.name,
									)}
									suggestions={roles.map((role) => role.name)}
									placeholder={t(
										"events.rolesPlaceholder",
									)}
									errors={errors}
									className="w-full bg-surface border rounded-md border-border2  px-2 py-1 font-main text-text"
								/>
								<TextArea
									name="Description"
									label={t("events.description")}
									value={event?.description}
									placeholder={t(
										"events.descriptionPlaceholder",
									)}
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
											label={t("files.files")}
										/>
									)}
								</Promisable>

								<CheckButton
									active
									type="submit"
									pending={eventFetcher.state !== "idle"}
								>
									{t("common.ok")}
								</CheckButton>
							</eventFetcher.Form>
						</Modal>
					)}
				</>
			)}
		</Promisable>
	);
}
