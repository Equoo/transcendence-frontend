import type { JSX } from "react";

import { ActivityEnum, useActivity } from "@/activity/hooks/activity.hook";

const LABELS: Record<ActivityEnum, string> = {
	[ActivityEnum.Online]: "Online",
	[ActivityEnum.Afk]: "Away",
	[ActivityEnum.Busy]: "Busy",
	[ActivityEnum.Offline]: "Offline",
};

export function useIsOnline(): (userId: string) => boolean {
	const activity = useActivity();
	return (userId) => activity.getActivity(userId) !== ActivityEnum.Offline;
}

export default function ActivityLabel({ userId }: { userId: string }): JSX.Element {
	const activity = useActivity();
	return <>{LABELS[activity.getActivity(userId)]}</>;
}
