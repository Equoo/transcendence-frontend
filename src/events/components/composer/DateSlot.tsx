import { addDays, addWeeks, nextSaturday, set } from "date-fns";
import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiClock } from "react-icons/pi";

import { fieldBox, FieldErrors } from "@/components/Input/Field";
import { slotClass, SlotPopover } from "@/components/Input/Slot";
import { toInputValue } from "@/utils/date.util";

const EVENING_HOUR = 20;
const AFTERNOON_HOUR = 14;
const TONIGHT_CUTOFF_HOUR = 19;

function atHour(day: Date, hours: number): Date {
	return set(day, { hours, minutes: 0, seconds: 0, milliseconds: 0 });
}

function formatLong(date: Date): string {
	return date.toLocaleString([], {
		hour: "2-digit",
		minute: "2-digit",
		month: "short",
		day: "2-digit",
		year: "numeric",
	});
}

function formatShort(date: Date): string {
	return date.toLocaleString([], {
		weekday: "short",
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function DatePicker({
	value,
	onPick,
	onChange,
}: {
	value: string;
	onPick: (value: string) => void;
	onChange: (value: string) => void;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [now] = useState(() => new Date());

	const picks = [
		...(now.getHours() < TONIGHT_CUTOFF_HOUR
			? [
					{
						key: "tonight",
						label: t("events.composer.tonight"),
						date: atHour(now, EVENING_HOUR),
					},
				]
			: []),
		{
			key: "tomorrow",
			label: t("events.composer.tomorrow"),
			date: atHour(addDays(now, 1), EVENING_HOUR),
		},
		{
			key: "saturday",
			label: t("events.composer.saturday"),
			date: atHour(nextSaturday(now), AFTERNOON_HOUR),
		},
		{
			key: "nextWeek",
			label: t("events.composer.nextWeek"),
			date: atHour(addWeeks(now, 1), EVENING_HOUR),
		},
	];

	return (
		<>
			<div className="grid grid-cols-2 gap-2">
				{picks.map((pick) => {
					const pickValue = toInputValue(pick.date);
					const selected = pickValue === value;

					return (
						<button
							key={pick.key}
							type="button"
							className={`flex flex-col items-start rounded-xl border px-3 py-2 text-left duration-150 cursor-pointer
								${selected ? "border-accent bg-accent-soft" : "border-border hover:border-border2 hover:bg-hover"}`}
							onClick={() => {
								onPick(pickValue);
							}}
						>
							<span className="font-semibold text-sm text-text">
								{pick.label}
							</span>
							<span className="text-xs text-muted capitalize">
								{formatShort(pick.date)}
							</span>
						</button>
					);
				})}
			</div>
			<label className="flex flex-col gap-1 text-xs font-semibold text-muted">
				{t("events.composer.customDate")}
				<input
					type="datetime-local"
					value={value}
					min={toInputValue(now)}
					className={`${fieldBox()} font-normal`}
					onChange={(ev) => {
						onChange(ev.target.value);
					}}
					onKeyDown={(ev) => {
						if (ev.key === "Enter" && value) {
							ev.preventDefault();
							onPick(value);
						}
					}}
				/>
			</label>
		</>
	);
}

export default function DateSlot({
	value,
	onChange,
	open,
	onOpenChange,
	onPicked,
	next,
	nudge,
	errors,
}: {
	value: string;
	onChange: (value: string) => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onPicked: () => void;
	next: boolean;
	nudge: boolean;
	errors?: string[];
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const date = value === "" ? null : new Date(value);

	return (
		<div className="flex flex-col gap-1">
			<SlotPopover
				open={open}
				onClose={() => {
					onOpenChange(false);
				}}
				anchor={
					<button
						type="button"
						aria-expanded={open}
						className={`flex w-[calc(100%+1rem)] -mx-2 px-2 rounded-xl items-center gap-2 py-1 text-left cursor-pointer focus-visible:outline-0 ${slotClass(
							{
								filled: Boolean(date),
								next,
								active: open,
								error: Boolean(errors),
								nudge,
							},
						)}`}
						onClick={() => {
							onOpenChange(!open);
						}}
					>
						<PiClock className="shrink-0" />
						{date ? (
							<time dateTime={date.toISOString()}>
								{formatLong(date)}
							</time>
						) : (
							<span className="text-muted">
								{t("events.composer.datePlaceholder")}
							</span>
						)}
					</button>
				}
			>
				<DatePicker
					value={value}
					onChange={onChange}
					onPick={(picked) => {
						onChange(picked);
						onPicked();
					}}
				/>
			</SlotPopover>
			<FieldErrors errors={errors} />
		</div>
	);
}
