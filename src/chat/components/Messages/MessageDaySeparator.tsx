import { isToday, isYesterday } from "date-fns";
import type { TFunction } from "i18next";
import type { JSX } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";

import { dateLocale } from "@/translation/i18n";

// eslint-disable-next-line id-length
function formatDaySeparator(date: Date, t: TFunction): string {
	if (isToday(date)) {
		return t("chat.today");
	}
	if (isYesterday(date)) {
		return t("chat.yesterday");
	}

	return date.toLocaleDateString(dateLocale(), {
		weekday: "long",
		day: "numeric",
		month: "long",
	});
}

// NOTE: /Todo It's not update in realtime: 'today' after 23:59 it do not will change to 'yesterday'
function MessageDaySeparator({ date }: { date: Date }): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const day = formatDaySeparator(date, t);

	return (
		<div className="flex items-center gap-3.5 text-[12px] font-semibold text-muted whitespace-nowrap">
			<span className="h-px flex-1 bg-border" />
			{day}
			<span className="h-px flex-1 bg-border" />
		</div>
	);
}

export default MessageDaySeparator;
