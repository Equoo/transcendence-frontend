import { isToday, isYesterday } from "date-fns";
import type { JSX } from "react/jsx-runtime";

function formatDaySeparator(date: Date): string {
	if (isToday(date)) {
		return "Today";
	}
	if (isYesterday(date)) {
		return "Yesterday";
	}

	return date.toLocaleDateString("en-EN", {
		weekday: "long",
		day: "numeric",
		month: "long",
	});
}

// NOTE: /Todo It's not update in realtime: 'today' after 23:59 it do not will change to 'yesterday'
function MessageDaySeparator({ date }: { date: Date }): JSX.Element {
	const day = formatDaySeparator(date);

	return (
		<div className="flex items-center gap-3.5 text-[12px] font-semibold text-muted">
			<span className="h-px flex-1 bg-border" />
			{day}
			<span className="h-px flex-1 bg-border" />
		</div>
	);
}

export default MessageDaySeparator;
