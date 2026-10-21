import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiCheckBold, PiPlusBold } from "react-icons/pi";

import { fieldBox } from "./Field";
import HiddenValues from "./HiddenValues";

export const MAX_CHIP_LENGTH = 19;

export default function ChipPicker({
	name,
	options,
	selected,
	onChange,
	creatable = false,
	placeholder,
	disabled = false,
	empty,
}: {
	name?: string;
	options: string[];
	selected: string[];
	onChange: (selected: string[]) => void;
	creatable?: boolean;
	placeholder?: string;
	disabled?: boolean;
	empty?: string;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [draft, setDraft] = useState("");

	const query = draft.trim().toLowerCase();
	const created = selected.filter((value) => !options.includes(value));
	const all = [...options, ...created];
	const shown = all.filter((value) => value.toLowerCase().includes(query));
	const exact = all.find((value) => value.toLowerCase() === query) ?? null;

	function toggle(value: string): void {
		onChange(
			selected.includes(value)
				? selected.filter((other) => other !== value)
				: [...selected, value],
		);
	}

	function commit(): void {
		if (!query) {
			return;
		}
		if (exact === null) {
			onChange([...selected, draft.trim()]);
		} else if (!selected.includes(exact)) {
			onChange([...selected, exact]);
		}
		setDraft("");
	}

	return (
		<>
			<div
				className={`flex flex-wrap gap-2 duration-200 ${disabled ? "opacity-50" : ""}`}
			>
				{all.length === 0 && empty && (
					<p className="text-xs text-muted">{empty}</p>
				)}
				{shown.map((value) => {
					const isSelected = selected.includes(value);

					return (
						<button
							key={value}
							type="button"
							aria-pressed={isSelected}
							disabled={disabled}
							className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold duration-150 cursor-pointer disabled:cursor-not-allowed
								${isSelected ? "border-accent bg-accent text-accent-text" : "border-border2 text-text2 enabled:hover:border-accent enabled:hover:text-accent"}`}
							onClick={() => {
								toggle(value);
							}}
						>
							{isSelected && (
								<PiCheckBold
									size={10}
									className="animate-pop"
								/>
							)}
							{value}
						</button>
					);
				})}
				{creatable && query && exact === null && (
					<button
						type="button"
						className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-accent px-2.5 py-1 text-xs font-semibold text-accent cursor-pointer animate-pop hover:bg-accent-soft"
						onClick={commit}
					>
						<PiPlusBold size={10} />
						{t("common.createValue", { name: draft.trim() })}
					</button>
				)}
			</div>
			{creatable && (
				<input
					value={draft}
					maxLength={MAX_CHIP_LENGTH}
					placeholder={placeholder}
					aria-label={placeholder}
					disabled={disabled}
					className={fieldBox()}
					onChange={(ev) => {
						setDraft(ev.target.value);
					}}
					onKeyDown={(ev) => {
						if (ev.key === "Enter") {
							ev.preventDefault();
							commit();
						}
					}}
				/>
			)}
			{name && <HiddenValues name={name} values={selected} />}
		</>
	);
}
