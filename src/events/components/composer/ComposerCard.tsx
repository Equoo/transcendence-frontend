import type { JSX, RefObject } from "react";
import { useTranslation } from "react-i18next";
import { IoLocationOutline } from "react-icons/io5";
import { PiSparkle } from "react-icons/pi";

import type { ValidationErrors } from "../../../api/problem_detail";
import CheckButton from "../../../components/Button/CheckButton";
import { Countdown } from "../EventCard";
import DateSlot from "./DateSlot";
import SizeSlot from "./SizeSlot";
import {
	FieldErrors,
	REQUIRED_FIELDS,
	type RequiredField,
	TextSlot,
} from "./Slot";
import TagsSlot from "./TagsSlot";
import type { EventDraft } from "./useEventDraft";

const NAME_MAX_LENGTH = 55;
const LOCATION_MAX_LENGTH = 50;
const NAME_COUNTER_FROM = 40;

export type ComposerPopover = "date" | "size" | null;

function ProgressBar({
	done,
	total,
}: {
	done: number;
	total: number;
}): JSX.Element {
	return (
		<div className="flex items-center gap-2">
			<div className="flex gap-1">
				{REQUIRED_FIELDS.map((field, idx) => (
					<span
						key={field}
						className={`h-1.5 w-5 rounded-full duration-300 ${idx < done ? "bg-accent" : "bg-border2"}`}
					/>
				))}
			</div>
			<span className="text-xs font-semibold tabular-nums text-muted">
				{done}/{total}
			</span>
		</div>
	);
}

function CountdownPlaceholder(): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();

	return (
		<div className="flex flex-col font-head font-bold text-2xl @sm:text-3xl tabular-nums whitespace-nowrap text-border2">
			--:--:--
			<small className="text-muted font-semibold text-xs tracking-wider">
				{t("events.beforeStart")}
			</small>
		</div>
	);
}

export default function ComposerCard({
	draft,
	update,
	missing,
	errors,
	generalErrors,
	nameRef,
	locationRef,
	openPopover,
	onPopoverChange,
	nudged,
	advance,
	registeredCount,
	editing,
	pending,
}: {
	draft: EventDraft;
	update: <K extends keyof EventDraft>(key: K, value: EventDraft[K]) => void;
	missing: RequiredField[];
	errors: ValidationErrors;
	generalErrors: string[];
	nameRef: RefObject<HTMLInputElement | null>;
	locationRef: RefObject<HTMLInputElement | null>;
	openPopover: ComposerPopover;
	onPopoverChange: (popover: ComposerPopover) => void;
	nudged: RequiredField | null;
	advance: (from: RequiredField) => void;
	registeredCount: number;
	editing: boolean;
	pending: boolean;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const nextField = missing.at(0) ?? null;
	const complete = nextField === null;

	function slotState(field: RequiredField): {
		next: boolean;
		nudge: boolean;
	} {
		return { next: nextField === field, nudge: nudged === field };
	}

	return (
		<section className="flex w-full max-w-md flex-col gap-3 lg:sticky lg:top-24">
			<div className="flex items-center justify-between px-1">
				<span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
					<span className="size-1.5 rounded-full bg-accent animate-pulse" />
					{t("events.composer.preview")}
				</span>
				<ProgressBar
					done={REQUIRED_FIELDS.length - missing.length}
					total={REQUIRED_FIELDS.length}
				/>
			</div>

			<div
				className={`@container flex w-full flex-col gap-4 rounded-3xl border bg-surface p-5 shadow-main duration-300 sm:p-8
					${complete ? "border-accent/40 ring-4 ring-accent/10" : "border-border"}`}
			>
				<TextSlot
					autoFocus
					inputRef={nameRef}
					value={draft.name}
					maxLength={NAME_MAX_LENGTH}
					counterFrom={NAME_COUNTER_FROM}
					label={t("common.name")}
					placeholder={t("events.composer.namePlaceholder")}
					inputClassName="font-head text-2xl font-semibold leading-tight tracking-tight text-text @sm:text-3xl"
					errors={errors.Name}
					onChange={(value) => {
						update("name", value);
					}}
					onEnter={() => {
						advance("name");
					}}
					{...slotState("name")}
				/>

				<div className="flex flex-col gap-2 text-sm text-text2">
					<TextSlot
						inputRef={locationRef}
						value={draft.location}
						maxLength={LOCATION_MAX_LENGTH}
						label={t("events.location")}
						placeholder={t("events.composer.locationPlaceholder")}
						icon={<IoLocationOutline className="shrink-0" />}
						inputClassName="text-sm text-text2"
						errors={errors.Location}
						onChange={(value) => {
							update("location", value);
						}}
						onEnter={() => {
							advance("location");
						}}
						{...slotState("location")}
					/>
					<DateSlot
						value={draft.date}
						open={openPopover === "date"}
						errors={errors.Date}
						onChange={(value) => {
							update("date", value);
						}}
						onOpenChange={(open) => {
							onPopoverChange(open ? "date" : null);
						}}
						onPicked={() => {
							advance("date");
						}}
						{...slotState("date")}
					/>
				</div>

				<TagsSlot
					tags={draft.tags}
					errors={errors.Tags}
					onChange={(tags) => {
						update("tags", tags);
					}}
				/>

				<div className="mt-auto flex flex-col gap-4 border-t border-border pt-4">
					<div className="flex items-end justify-between gap-3">
						{draft.date === "" ? (
							<CountdownPlaceholder />
						) : (
							<Countdown
								key={draft.date}
								date={new Date(draft.date)}
							/>
						)}
						<SizeSlot
							value={draft.size}
							open={openPopover === "size"}
							registeredCount={registeredCount}
							errors={errors.Size}
							onChange={(value) => {
								update("size", value);
							}}
							onOpenChange={(open) => {
								onPopoverChange(open ? "size" : null);
							}}
							onPicked={() => {
								advance("size");
							}}
							{...slotState("size")}
						/>
					</div>

					<FieldErrors errors={generalErrors} />
					<CheckButton
						type="submit"
						active={complete}
						activeCheck={false}
						pending={pending}
					>
						{complete ? (
							<>
								<PiSparkle className="animate-pop" />
								{editing
									? t("events.composer.save")
									: t("events.composer.create")}
							</>
						) : (
							<span className="text-text2">
								{t("events.composer.missing", {
									count: missing.length,
								})}
							</span>
						)}
					</CheckButton>
				</div>
			</div>
		</section>
	);
}
