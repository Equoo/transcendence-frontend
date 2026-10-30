import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiPlusBold } from "react-icons/pi";
import { TbPencil } from "react-icons/tb";

import Promisable from "@/components/Promisable";

import CheckButton from "../../components/Button/CheckButton";
import type { AppFile } from "../../files/api/files.api";
import type { EventRole } from "../api/event_roles.api";
import type { EventData } from "../api/events.api";
import EventComposer from "./composer/EventComposer";

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
	const [showEventForm, setShowEventForm] = useState(false);

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
						<button
							type="button"
							aria-label={t("events.editTitle")}
							title={t("events.editTitle")}
							className={`shrink-0 cursor-pointer ${className}`}
							onClick={() => {
								setShowEventForm(true);
							}}
						>
							<TbPencil size={26} color="var(--color-text2)" />
						</button>
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
						<EventComposer
							roles={roles}
							files={filesInput}
							event={event}
							onClose={() => {
								setShowEventForm(false);
							}}
						/>
					)}
				</>
			)}
		</Promisable>
	);
}
