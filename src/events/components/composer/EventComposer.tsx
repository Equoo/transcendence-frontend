import { type JSX, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";

import Modal from "@/components/Modal/Modal";
import { useNudge } from "@/hooks/useNudge";

import {
	APIError,
	otherErrors,
	type ValidationErrors,
	validationErrors,
} from "../../../api/problem_detail";
import HiddenValues from "../../../components/Input/HiddenValues";
import type { AppFile } from "../../../files/api/files.api";
import type { EventRole } from "../../api/event_roles.api";
import type { EventData } from "../../api/events.api";
import type { clientAction as eventAction } from "../../routes/events.route";
import ComposerCard, { type ComposerPopover } from "./ComposerCard";
import { DescriptionTile, FilesTile, RolesTile } from "./EventExtras";
import ExpireTile from "./ExpireTile";
import {
	type EventDraft,
	REQUIRED_FIELDS,
	type RequiredField,
	useEventDraft,
} from "./useEventDraft";

const SLOT_ERROR_KEYS = [
	"Name",
	"Date",
	"ExpireAt",
	"Expire Date",
	"Size",
	"Location",
	"Tags",
	"Roles",
	"EventRoleIds",
	"Description",
	"Files",
	"FileKeys",
];

function errorsOf(errors: ValidationErrors, ...keys: string[]): string[] {
	return keys
		.filter((key) => Object.hasOwn(errors, key))
		.flatMap((key) => errors[key]);
}

function DraftFields({ draft }: { draft: EventDraft }): JSX.Element {
	return (
		<>
			<input type="hidden" name="Date" value={draft.date} />
			<input type="hidden" name="Expire Date" value={draft.expireAt} />
			<input type="hidden" name="Size" value={draft.size} />
			<input type="hidden" name="Description" value={draft.description} />
			<HiddenValues name="Tags" values={draft.tags} />
			<HiddenValues name="Roles" values={draft.roles} />
			<HiddenValues name="Files" values={draft.fileKeys} />
		</>
	);
}

export default function EventComposer({
	roles,
	files,
	event,
	onClose,
}: {
	roles: EventRole[];
	files: AppFile[] | Promise<AppFile[]>;
	event?: EventData;
	onClose: () => void;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const fetcher = useFetcher<typeof eventAction>();
	const { draft, update, filled, missing } = useEventDraft(event);
	const [openPopover, setOpenPopover] = useState<ComposerPopover>(null);
	const { nudged, nudge, onAnimationEnd } = useNudge<RequiredField>();
	const nameRef = useRef<HTMLInputElement>(null);
	const locationRef = useRef<HTMLInputElement>(null);

	const errors = validationErrors(fetcher.data);
	const generalErrors = otherErrors(errors, SLOT_ERROR_KEYS);

	useEffect(() => {
		if (
			fetcher.state === "idle" &&
			fetcher.data &&
			!(fetcher.data instanceof APIError)
		) {
			onClose();
		}
	}, [fetcher.state, fetcher.data, onClose]);

	function focusField(field: RequiredField): void {
		if (field === "date" || field === "size") {
			setOpenPopover(field);
			return;
		}
		setOpenPopover(null);
		(field === "name" ? nameRef : locationRef).current?.focus();
	}

	function advance(from: RequiredField): void {
		const target = REQUIRED_FIELDS.find(
			(field) => field !== from && !filled[field],
		);
		if (target) {
			focusField(target);
		} else {
			setOpenPopover(null);
		}
	}

	return (
		<Modal
			size="page"
			title={event ? t("events.editTitle") : t("events.createTitle")}
			subtitle={t("events.composer.subtitle")}
			onClose={onClose}
			onAnimationEnd={onAnimationEnd}
		>
			<fetcher.Form
				action={event ? `/events/${event.id}` : "/events"}
				method={event ? "PUT" : "POST"}
				className="mx-auto grid w-full max-w-5xl items-start justify-center gap-8 px-4 pb-12 pt-2 sm:px-8 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:gap-12 animate-in"
				onSubmit={(ev) => {
					const nextField = missing.at(0);
					if (nextField) {
						ev.preventDefault();
						nudge(nextField);
						focusField(nextField);
					}
				}}
			>
				<ComposerCard
					draft={draft}
					update={update}
					missing={missing}
					errors={errors}
					generalErrors={generalErrors}
					nameRef={nameRef}
					locationRef={locationRef}
					openPopover={openPopover}
					nudged={nudged}
					advance={advance}
					registeredCount={event?.registeredCount ?? 0}
					editing={Boolean(event)}
					pending={fetcher.state !== "idle"}
					onPopoverChange={setOpenPopover}
				/>

				<aside className="flex w-full max-w-md flex-col gap-4 lg:max-w-none">
					<div className="px-1">
						<h3 className="font-head font-semibold text-[15px] text-text">
							{t("events.composer.extrasTitle")}
						</h3>
						<p className="text-sm text-muted">
							{t("events.composer.extrasHint")}
						</p>
					</div>
					<DescriptionTile
						value={draft.description}
						errors={errors.Description}
						onChange={(value) => {
							update("description", value);
						}}
					/>
					<RolesTile
						available={roles.map((role) => role.name)}
						selected={draft.roles}
						errors={errorsOf(errors, "Roles", "EventRoleIds")}
						onChange={(selected) => {
							update("roles", selected);
						}}
					/>
					<ExpireTile
						value={draft.expireAt}
						minExpire={draft.date}
						errors={errorsOf(errors, "ExpireAt", "Expire Date")}
						onChange={(value) => {
							update("expireAt", value);
						}}
					/>
					<FilesTile
						files={files}
						selected={draft.fileKeys}
						errors={errorsOf(errors, "Files", "FileKeys")}
						onToggle={(fileKey) => {
							update(
								"fileKeys",
								draft.fileKeys.includes(fileKey)
									? draft.fileKeys.filter(
											(key) => key !== fileKey,
										)
									: [...draft.fileKeys, fileKey],
							);
						}}
					/>
					<p className="px-1 text-xs text-muted">
						{t("events.formHint")}
					</p>
				</aside>

				<DraftFields draft={draft} />
			</fetcher.Form>
		</Modal>
	);
}
