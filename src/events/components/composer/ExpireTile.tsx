import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiHourglassMedium } from "react-icons/pi";

import { fieldBox, FieldErrors } from "@/components/Input/Field";
import { toInputValue } from "@/utils/date.util";

import { Tile } from "./EventExtras";

export default function ExpireTile({
	value,
	minExpire,
	onChange,
	errors,
}: {
	value: string;
	minExpire: string;
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
				min={minExpire.length > 0 ? minExpire : toInputValue(now)}
				aria-label={t("events.composer.expireTitle")}
				className={fieldBox()}
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
