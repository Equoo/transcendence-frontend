import { create } from "zustand";

import { useChatHub } from "@/chat/hooks/chatHub.hook";

export enum ActivityEnum {
	Online = 0,
	Afk = 1,
	Busy = 2,
	Offline = 3,
}

interface ActivityState {
	selfId: string;
	activities: Map<string, ActivityEnum>;
	getActivity: (id: string) => ActivityEnum;
	setOtherActivity: (id: string, activity: ActivityEnum) => void;
	setSelfActivity: (activity: ActivityEnum) => Promise<void>;
	setSelfId: (id: string) => void;
	reportActivity: () => void;
	reportActivityTo: (userId: string) => void;
	askOthersActivity: () => void;
	setPreference: (activity: ActivityEnum) => void;
	removePreference: () => void;
}

export const useActivity = create<ActivityState>()((set, get) => ({
	selfId: "",
	activities: new Map(),
	getActivity: (id): ActivityEnum => {
		const act = get().activities.get(id);

		return act ?? ActivityEnum.Offline;
	},
	setSelfId: (id): void => {
		set({ selfId: id });
	},
	setOtherActivity: (id, activity): void => {
		set((old) => ({
			activities: new Map(old.activities).set(id, activity),
		}));
	},
	setSelfActivity: async (activity): Promise<void> => {
		const actPref = localStorage.getItem("activityPreference");

		let act;

		if (activity === ActivityEnum.Offline) {
			act = activity;
		} else {
			act = actPref ? Number(actPref) : activity;
		}
		set((old) => ({
			activities: new Map(old.activities).set(get().selfId, act),
		}));
		await useChatHub.getState().hub?.send("ActivityReported", act);
	},
	reportActivity: (): void => {
		void useChatHub
			.getState()
			.hub?.invoke(
				"ActivityReported",
				get().activities.get(get().selfId),
			);
	},
	reportActivityTo: (userId: string): void => {
		void useChatHub
			.getState()
			.hub?.invoke(
				"ReportActivityTo",
				userId,
				get().activities.get(get().selfId),
			);
	},
	askOthersActivity: (): void => {
		void useChatHub.getState().hub?.send("AskOthersActivity");
	},
	setPreference: (activity): void => {
		localStorage.setItem("activityPreference", activity.toString());
		void get().setSelfActivity(activity);
	},
	removePreference: (): void => {
		localStorage.removeItem("activityPreference");
		void get().setSelfActivity(ActivityEnum.Online);
	},
}));
