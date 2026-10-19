import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiPlusBold, PiX } from "react-icons/pi";

import Badge from "../../../components/Badge";
import { BARE_INPUT, FieldErrors } from "./Slot";

export const MAX_CHIP_LENGTH = 19;

export default function TagsSlot({
	tags,
	onChange,
	errors,
}: {
	tags: string[];
	onChange: (tags: string[]) => void;
	errors?: string[];
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [draft, setDraft] = useState("");

	function commit(): void {
		const tag = draft.trim();
		if (tag && !tags.includes(tag)) {
			onChange([...tags, tag]);
		}
		setDraft("");
	}

	return (
		<div className="flex flex-col gap-1">
			<div className="flex flex-wrap items-center gap-2 min-h-6">
				{tags.map((tag) => (
					<Badge key={tag} className="animate-pop max-w-40">
						<span className="truncate">{tag}</span>
						<button
							type="button"
							aria-label={t("common.delete")}
							className="-mr-0.5 rounded-full text-muted hover:text-text cursor-pointer"
							onClick={() => {
								onChange(tags.filter((other) => other !== tag));
							}}
						>
							<PiX size={11} />
						</button>
					</Badge>
				))}
				<label
					className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border2 px-2 py-1 text-xs font-semibold text-muted
						duration-150 hover:border-accent hover:text-accent focus-within:border-accent focus-within:border-solid focus-within:text-text"
				>
					<PiPlusBold size={10} className="shrink-0" />
					<input
						value={draft}
						maxLength={MAX_CHIP_LENGTH}
						placeholder={t("events.composer.addTag")}
						aria-label={t("events.tags")}
						style={{
							width: `${Math.max(draft.length, t("events.composer.addTag").length) + 1}ch`,
						}}
						className={`${BARE_INPUT} text-xs font-semibold placeholder:text-muted`}
						onChange={(ev) => {
							setDraft(ev.target.value.replace(",", ""));
						}}
						onBlur={commit}
						onKeyDown={(ev) => {
							if (ev.key === "Enter" || ev.key === ",") {
								ev.preventDefault();
								commit();
							} else if (
								ev.key === "Backspace" &&
								draft === "" &&
								tags.length > 0
							) {
								onChange(tags.slice(0, -1));
							}
						}}
					/>
				</label>
			</div>
			<FieldErrors errors={errors} />
		</div>
	);
}
