import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { GoPeople } from "react-icons/go";
import { PiMinus, PiPlus } from "react-icons/pi";

import { FieldErrors } from "@/components/Input/Field";
import { BARE_INPUT, slotClass, SlotPopover } from "@/components/Input/Slot";

const MAX_SIZE = 2147483646;
const QUICK_SIZES = [5, 10, 20, 50, 100];

function clampSize(size: number): string {
	return String(Math.min(Math.max(size, 1), MAX_SIZE));
}

export default function SizeSlot({
	value,
	onChange,
	open,
	onOpenChange,
	onPicked,
	registeredCount,
	next,
	nudge,
	errors,
}: {
	value: string;
	onChange: (value: string) => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onPicked: () => void;
	registeredCount: number;
	next: boolean;
	nudge: boolean;
	errors?: string[];
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const size = Number(value);
	const filled = size >= 1;

	return (
		<div className="flex flex-col items-end gap-1 shrink-0">
			<SlotPopover
				open={open}
				placement="top"
				align="end"
				onClose={() => {
					onOpenChange(false);
				}}
				anchor={
					<button
						type="button"
						aria-expanded={open}
						className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold text-xs whitespace-nowrap cursor-pointer focus-visible:outline-0
							${filled && !open ? "bg-good-soft text-good" : "text-text2"}
							${slotClass({ filled, next, active: open, error: Boolean(errors), nudge })}`}
						onClick={() => {
							onOpenChange(!open);
						}}
					>
						<GoPeople className="shrink-0" />
						{registeredCount}/{filled ? size : "?"}
						<span className="hidden @xs:block">
							{t("events.registeredCount")}
						</span>
					</button>
				}
			>
				<span className="text-xs font-semibold text-muted">
					{t("events.composer.spots")}
				</span>
				<div className="flex items-center gap-2">
					<button
						type="button"
						aria-label="-1"
						disabled={size <= 1}
						className="flex items-center justify-center size-10 shrink-0 rounded-full border border-border2 text-text cursor-pointer hover:bg-hover disabled:opacity-40 disabled:cursor-default"
						onClick={() => {
							onChange(clampSize(size - 1));
						}}
					>
						<PiMinus />
					</button>
					<input
						autoFocus
						type="number"
						inputMode="numeric"
						min={1}
						max={MAX_SIZE}
						value={value}
						placeholder="0"
						aria-label={t("events.composer.spots")}
						className={`${BARE_INPUT} w-full min-w-0 text-center font-head font-bold text-3xl tabular-nums text-text [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none`}
						onChange={(ev) => {
							onChange(
								ev.target.value === ""
									? ""
									: clampSize(Number(ev.target.value)),
							);
						}}
						onKeyDown={(ev) => {
							if (ev.key === "Enter") {
								ev.preventDefault();
								if (filled) {
									onPicked();
								}
							}
						}}
					/>
					<button
						type="button"
						aria-label="+1"
						className="flex items-center justify-center size-10 shrink-0 rounded-full border border-border2 text-text cursor-pointer hover:bg-hover"
						onClick={() => {
							onChange(clampSize(size + 1));
						}}
					>
						<PiPlus />
					</button>
				</div>
				<div className="flex flex-wrap gap-1.5">
					{QUICK_SIZES.map((quick) => (
						<button
							key={quick}
							type="button"
							className={`flex-1 rounded-full border px-2 py-1 text-xs font-semibold tabular-nums duration-150 cursor-pointer
								${size === quick ? "border-accent bg-accent-soft text-accent" : "border-border text-text2 hover:bg-hover"}`}
							onClick={() => {
								onChange(String(quick));
								onPicked();
							}}
						>
							{quick}
						</button>
					))}
				</div>
			</SlotPopover>
			<FieldErrors errors={errors} />
		</div>
	);
}
