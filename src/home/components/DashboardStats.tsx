import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { PiCalendarCheck, PiCalendarDots, PiHourglass, PiUsers } from "react-icons/pi";

import Promisable from "@/components/Promisable";
import type { EventSummary } from "@/events/api/events.api";
import { RelationshipState } from "@/friends/api/relationship.api";
import { useIsOnline } from "@/friends/components/ActivityLabel";
import { useRelationships } from "@/friends/hooks/useRelationships";
import { isFriend } from "@/friends/utils/friends.util";

import StatTile, { StatTileSkeleton } from "./StatTile";

function EventStats({ events }: { events: EventSummary[] }): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	return (<>
		<StatTile icon={PiCalendarDots} label={t("home.stats.upcomingEvents")} value={events.length} to="/calendar" />
		<StatTile
			icon={PiCalendarCheck}
			label={t("home.stats.registrations")}
			value={events.filter((ev) => ev.isRegistered).length}
			to="/calendar"
		/>
	</>);
}

function FriendStats(): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const { data: rels, isPending } = useRelationships();
	const isOnline = useIsOnline();

	if (isPending) {
		return (<>
			<StatTileSkeleton />
			<StatTileSkeleton />
		</>);
	}

	const friends = (rels ?? []).filter(isFriend);
	const online = friends.filter((rel) => isOnline(rel.user.id)).length;
	const incoming = (rels ?? []).filter((rel) => rel.type === RelationshipState.PendingResponse).length;

	return (<>
		<StatTile
			icon={PiUsers}
			label={t("home.stats.friendsOnline")}
			value={<>{online}<span className="text-muted text-base font-semibold">/{friends.length}</span></>}
			to="/messages/online"
		/>
		<StatTile
			icon={PiHourglass}
			label={t("home.stats.pendingRequests")}
			value={incoming}
			to="/messages/pending"
			highlight={incoming > 0}
		/>
	</>);
}

export default function DashboardStats({
	events,
	previousEvents,
}: {
	events: Promise<EventSummary[]>;
	previousEvents?: EventSummary[];
}): JSX.Element {
	return (
		<div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3">
			<Promisable
				data={events}
				cached_data={previousEvents}
				skeleton={<><StatTileSkeleton /><StatTileSkeleton /></>}
			>
				{(data) => <EventStats events={data} />}
			</Promisable>
			<FriendStats />
		</div>
	);
}
