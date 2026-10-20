import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiHourglassMedium } from "react-icons/pi";

import { toInputValue } from "./DateSlot";
import { Tile } from "./EventExtras";
import { FieldErrors } from "./Slot";

export default function ExpireTile({
	value,
	onChange,
	errors,
}: {
	value: string;
	onChange: (value: string) => void;
	errors?: string[];
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [now] = useState(() => new Date());

	return (
		<Tile
			icon={<PiHourglassMedium />}
			title={t("events.composer.expireTitle")}
			aside={
				value !== "" && (
					<button
						type="button"
						className="rounded-full px-2 py-0.5 text-xs font-semibold text-muted duration-150 cursor-pointer hover:bg-hover hover:text-text"
						onClick={() => {
							onChange("");
						}}
					>
						{t("events.composer.expireClear")}
					</button>
				)
			}
		>
			<p className="-mt-1 text-xs text-muted">
				{t("events.composer.expireHint")}
			</p>
			<input
				type="datetime-local"
				value={value}
				min={toInputValue(now)}
				aria-label={t("events.composer.expireTitle")}
				className="w-full rounded-xl border border-border bg-surface2 px-3 py-1.5 text-sm text-text focus:border-accent focus:ring-0"
				onChange={(ev) => {
					onChange(ev.target.value);
				}}
			/>
			{value === "" && (
				<p className="text-xs text-text2">
					{t("events.composer.expireNever")}
				</p>
			)}
			<FieldErrors errors={errors} />
		</Tile>
	);
}
