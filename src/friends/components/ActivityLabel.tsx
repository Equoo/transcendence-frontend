import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { ActivityEnum, useActivity } from "@/activity/hooks/activity.hook";

const LABELS: Record<ActivityEnum, string> = {
	[ActivityEnum.Online]: "home.status.online",
	[ActivityEnum.Afk]: "home.status.away",
	[ActivityEnum.Busy]: "home.status.busy",
	[ActivityEnum.Offline]: "home.status.offline",
};

export function useIsOnline(): (userId: string) => boolean {
	const activity = useActivity();
	return (userId) => activity.getActivity(userId) !== ActivityEnum.Offline;
}

export default function ActivityLabel({ userId }: { userId: string }): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const activity = useActivity();
	return <>{t(LABELS[activity.getActivity(userId)])}</>;
}
