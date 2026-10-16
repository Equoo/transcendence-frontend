import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";

import { ActivityEnum, useActivity } from "@/activity/hooks/activity.hook";
import { PermEnum } from "@/admin/api/roles";
import Modal from "@/components/Modal/Modal";
import ProfileLine from "@/components/Profile/ProfileLine";
import Promisable from "@/components/Promisable";

import { type EventRole, fetchEventRoles } from "../events/api/event_roles.api";
import { type EventSummary, fetchEvents } from "../events/api/events.api";
import EventForm from "../events/components/EventForm";
import EventList from "../events/components/EventList";
import { type AppFile, fetchFiles } from "../files/api/files.api";
import { fetchUsers, type User, UserContext } from "../users/api/users";
import type { Route } from "./+types/home";

let cachedEvents: EventSummary[] | undefined;

export function clientLoader({ context }: Route.ClientLoaderArgs): {
	previousEvents: EventSummary[] | undefined;
	events: Promise<EventSummary[]>;
	roles: Promise<EventRole[]>;
	files: Promise<AppFile[]>;
	users: Promise<User[]>;
	user: User;
} {
	const previousEvents = cachedEvents;

	const events = fetchEvents().then((result) => (cachedEvents = result));

	return {
		previousEvents,
		events,
		roles: fetchEventRoles(),
		files: fetchFiles(),
		users: fetchUsers(),
		user: context.get(UserContext),
	};
}

export default function Home({
	loaderData: { previousEvents, events, roles, files, users, user },
}: Route.ComponentProps): JSX.Element {
    // eslint-disable-next-line id-length
    const { t } = useTranslation();
	const [showOnline, setShowOnline] = useState(false);
	const activity = useActivity();
	return (
		<>
			<div className="w-full flex flex-row pl-16 lg:p-6 pr-6 py-4 justify-between items-center">
				<h1 className="font-semibold tracking-tight text-xl inline-flex gap-4 items-center">
					{t("common.home")}
					<Promisable data={users}>
						{(data) => (
							<>
								{showOnline && (
									<Modal
										align="start"
										title={t("home.usersOnline")}
										onClose={() => {
											setShowOnline(false);
										}}
									>
										{data
											.filter(
												(us) =>
													activity.getActivity(
														us.id,
													) !== ActivityEnum.Offline,
											)
											.map((us) => (
												<ProfileLine
													status
													user={us}
													key={us.id}
												/>
											))}
									</Modal>
								)}
								<p
									className="font-medium text-sm text-success cursor-pointer whitespace-nowrap"
									onClick={() => {
										setShowOnline(true);
									}}
								>
									{t("home.onlineCount", {
										online: activity.getOnlineUsers()
											.length,
										total: data.length,
									})}
								</p>
							</>
						)}
					</Promisable>
				</h1>
				{Boolean(user.role.permission & PermEnum.HandleEvent) && (
					<EventForm roles={roles} files={files} />
				)}
			</div>
			<EventList events={events} previousEvents={previousEvents} />
		</>
	);
}
