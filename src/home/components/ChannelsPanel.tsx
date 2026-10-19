import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { PiHash } from "react-icons/pi";
import { Link } from "react-router";

import { ChannelType } from "@/chat/api/chat.api";
import { useChannels } from "@/chat/hooks/useChannels";
import { ListRowsSkeleton } from "@/friends/components/Skeletons";

import DashboardPanel from "./DashboardPanel";

export default function ChannelsPanel({ limit = 6 }: { limit?: number }): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const { data: channels, isPending } = useChannels();
	const texts = (channels ?? []).filter((ch) => ch.type === ChannelType.Text && !ch.eventId);

	let content: JSX.Element;
	if (isPending) {
		content = <ListRowsSkeleton />;
	} else if (texts.length === 0) {
		content = <p className="text-sm text-text2 px-1">{t("home.noChannels")}</p>;
	} else {
		content = (
			<ul className="flex flex-col">
				{texts.slice(0, limit).map((channel) => (
					<li key={channel.id}>
						<Link
							to={`/channels/${channel.id}`}
							className="flex items-center gap-3 px-2 py-1.5 rounded-base text-[14.5px] text-text hover:bg-hover duration-120"
						>
							<span className="flex items-center justify-center size-6 shrink-0 rounded-md bg-back2 text-muted">
								<PiHash size={14} />
							</span>
							<span className="flex flex-col min-w-0">
								<span className="font-semibold truncate">{channel.name}</span>
								{channel.topic && <span className="text-muted text-[12.5px] truncate">{channel.topic}</span>}
							</span>
						</Link>
					</li>
				))}
			</ul>
		);
	}

	return (
		<DashboardPanel icon={PiHash} title={t("home.channels")}>
			{content}
		</DashboardPanel>
	);
}
