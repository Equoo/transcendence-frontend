import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiCalendarDots, PiChatsCircle, PiHouse, PiUsers } from "react-icons/pi";
import { Link } from "react-router";

import { PermEnum } from "@/admin/api/roles";
import MembersSidebar, { useOnlineCount } from "@/components/MembersSidebar";
import Promisable from "@/components/Promisable";
import { HEADER_PADDING } from "@/friends/components/BackToList";
import { OnlineFriends, PendingRequestsBanner, RecentConversations } from "@/friends/components/FriendsWidgets";
import DashboardPanel from "@/home/components/DashboardPanel";
import DashboardStats from "@/home/components/DashboardStats";
import RecentFilesPanel from "@/home/components/RecentFilesPanel";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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

function OnlineCount({ users }: { users: User[] }): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const online = useOnlineCount(users);
	return <>{t("home.onlineCount", { online, total: users.length })}</>;
}

function MembersToggle({ users, open, onToggle }: {
	users: Promise<User[]>;
	open: boolean;
	onToggle: () => void;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	return (
		<button
			type="button"
			title={t(open ? "home.closeMembers" : "home.openMembers")}
			aria-pressed={open}
			className={[
				"inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer duration-120",
				open ? "bg-accent-soft text-text" : "text-text2 hover:bg-hover hover:text-text",
			].join(" ")}
			onClick={onToggle}
		>
			<span className="size-2 rounded-full bg-good" />
			<Promisable data={users} skeleton={<span className="h-3 w-16 rounded bg-border animate-pulse" />}>
				{(data) => <OnlineCount users={data} />}
			</Promisable>
			<PiUsers size={18} className="text-muted" />
		</button>
	);
}

export default function Home({
	loaderData: { previousEvents, events, roles, files, users, user },
}: Route.ComponentProps): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const isWide = useMediaQuery("(min-width: 80rem)");
	const [membersOpen, setMembersOpen] = useState<boolean | null>(null);
	const showMembers = membersOpen ?? isWide;

	return (<div className="flex h-full min-h-0">
		<div className="flex flex-col flex-1 min-w-0 min-h-0">
			<div className={`flex flex-none flex-wrap items-center gap-x-3 gap-y-2 border-b border-border py-3 ${HEADER_PADDING}`}>
				<h1 className="font-head font-[650] text-[17px] text-text inline-flex gap-2 items-center">
					<PiHouse size={20} className="text-muted" />
					{t("common.home")}
				</h1>
				<span className="flex-1" />
				<MembersToggle
					users={users}
					open={showMembers}
					onToggle={() => { setMembersOpen(!showMembers); }}
				/>
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
							<RecentFilesPanel files={files} />
						</div>
					</div>
				</div>
			</div>
		</div>
		<MembersSidebar users={users} open={showMembers} onClose={() => { setMembersOpen(false); }} />
	</div>);
}
