import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiCalendarDots, PiChatsCircle, PiHouse, PiUsers } from "react-icons/pi";
import { Link } from "react-router";

import { ActivityEnum, useActivity } from "@/activity/hooks/activity.hook";
import { PermEnum } from "@/admin/api/roles";
import IconBtn from "@/components/Button/IconBtn";
import Modal from "@/components/Modal/Modal";
import ProfileLine from "@/components/Profile/ProfileLine";
import Promisable from "@/components/Promisable";
import { HEADER_PADDING } from "@/friends/components/BackToList";
import { OnlineFriends, PendingRequestsBanner, RecentConversations } from "@/friends/components/FriendsWidgets";
import ChannelsPanel from "@/home/components/ChannelsPanel";
import DashboardPanel from "@/home/components/DashboardPanel";
import DashboardStats from "@/home/components/DashboardStats";
import RecentFilesPanel from "@/home/components/RecentFilesPanel";

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

function OnlineUsers({ users }: { users: Promise<User[]> }): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [showOnline, setShowOnline] = useState(false);
	const activity = useActivity();

	return (
		<Promisable data={users}>
			{(data) => (<>
				{showOnline && (
					<Modal
						align="start"
						title={t("home.usersOnline")}
						onClose={() => { setShowOnline(false); }}
					>
						{data
							.filter((us) => activity.getActivity(us.id) !== ActivityEnum.Offline)
							.map((us) => <ProfileLine status user={us} key={us.id} />)}
					</Modal>
				)}
				<button
					type="button"
					className="inline-flex items-center gap-2 font-medium text-sm text-good cursor-pointer whitespace-nowrap"
					onClick={() => { setShowOnline(true); }}
				>
					<span className="size-2 rounded-full bg-good" />
					{t("home.onlineCount", {
						online: activity.getOnlineUsers().length,
						total: data.length,
					})}
				</button>
				<IconBtn
					discrete
					icon={PiUsers}
					title={t("home.usersOnline")}
					onClick={() => { setShowOnline(true); }}
				/>
			</>)}
		</Promisable>
	);
}

export default function Home({
	loaderData: { previousEvents, events, roles, files, users, user },
}: Route.ComponentProps): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();

	return (<>
		<div className={`flex flex-none flex-wrap items-center gap-x-3 gap-y-2 border-b border-border py-3 ${HEADER_PADDING}`}>
			<h1 className="font-head font-[650] text-[17px] text-text inline-flex gap-2 items-center">
				<PiHouse size={20} className="text-muted" />
				{t("common.home")}
			</h1>
			<span className="flex-1" />
			<OnlineUsers users={users} />
		</div>
		<div className="flex-1 min-h-0 overflow-y-auto">
			<div className="flex flex-col gap-8 max-w-6xl mx-auto px-4 sm:px-5.5 py-6">
				<div className="flex flex-col gap-1">
					<h2 className="font-head font-semibold text-2xl text-text tracking-tight">
						{t("home.welcome", { name: user.userName })}
					</h2>
					<p className="text-text2 text-sm">{t("home.subtitle")}</p>
				</div>

				<DashboardStats events={events} previousEvents={previousEvents} />

				<PendingRequestsBanner />

				<section className="flex flex-col">
					<div className="flex flex-wrap items-center gap-3">
						<PiCalendarDots size={18} className="text-muted" />
						<h2 className="font-head font-semibold text-[15px] text-text">{t("home.events")}</h2>
						<span className="flex-1" />
						{Boolean(user.role.permission & PermEnum.HandleEvent) && (
							<EventForm roles={roles} files={files} />
						)}
						<Link to="/calendar" className="text-[13px] font-semibold text-text2 hover:text-accent duration-120">
							{t("home.openCalendar")}
						</Link>
					</div>
					<div className="-mx-4 sm:-mx-5.5">
						<EventList
							events={events}
							previousEvents={previousEvents}
							empty={<p className="text-sm text-text2 py-6">{t("home.noEvents")}</p>}
						/>
					</div>
				</section>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
					<div className="lg:col-span-2 min-w-0">
						<DashboardPanel icon={PiChatsCircle} title={t("home.friends")} to="/messages" linkLabel={t("home.openMessages")}>
							<div className="flex flex-col gap-6 pt-1">
								<OnlineFriends limit={8} />
								<RecentConversations limit={4} showEmpty />
							</div>
						</DashboardPanel>
					</div>
					<div className="flex flex-col gap-6 min-w-0">
						<ChannelsPanel />
						<RecentFilesPanel files={files} />
					</div>
				</div>
			</div>
		</div>
	</>);
}
