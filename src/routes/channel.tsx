import { type JSX, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiUsers } from "react-icons/pi";
import { useNavigate } from "react-router";

import ChannelChat from "@/chat/components/ChannelChat";
import { useCategory, useChannel } from "@/chat/hooks/useChannels";
import { isWhitelisted } from "@/chat/utils/channel.util";
import IconBtn from "@/components/Button/IconBtn";
import MembersSidebar from "@/components/MembersSidebar";
import { HEADER_PADDING } from "@/friends/components/BackToList";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { fetchUsers, type User } from "@/users/api/users";

import type { Route } from "./+types/channel";

export function clientLoader(): {
	users: Promise<User[]>;
} {
	return {
		users: fetchUsers(),
	};
}

export default function ChannelRoute({
	params,
	loaderData: { users },
}: Route.ComponentProps): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const { data: channel, isPending } = useChannel(params.channelId);
	const { data: category } = useCategory(channel?.categoryId ?? "");
	const hasChannel = Boolean(channel);
	const isWide = useMediaQuery("(min-width: 80rem)");
	const [membersOpen, setMembersOpen] = useState<boolean | null>(null);
	const showMembers = membersOpen ?? isWide;

	const navigate = useNavigate();
	const seenIdRef = useRef<string | null>(null);

	useEffect(() => {
		if (hasChannel) {
			seenIdRef.current = params.channelId;
			return;
		}
		if (seenIdRef.current === params.channelId) {
			seenIdRef.current = null;
			void navigate("/", { replace: true });
		}
	}, [channel, hasChannel, navigate, params.channelId]);

	return (
		<div className="flex w-full h-full">
			<div className="flex flex-col flex-1 min-w-0 min-h-0">
				<div className={`flex flex-none items-center gap-3 border-b border-border py-3 lg:py-4 ${HEADER_PADDING}`}>
					<div className="flex flex-col min-w-0">
						<div className="flex items-center gap-1.75 font-head text-[17px] font-[650] min-w-0">
							<span className="text-muted">#</span>
							<span className="truncate">
								{isPending
									? ""
									: (channel?.name ?? t("channel.notFoundTitle"))}
							</span>
						</div>
						<div className="text-[12.5px] text-muted truncate">
							{channel?.topic ?? ""}
						</div>
					</div>
					<span className="flex-1" />
					{hasChannel && (
						<IconBtn discrete icon={PiUsers} active={showMembers} tooltip={showMembers ? t("home.closeMembers") : t("home.openMembers")} onClick={() => { setMembersOpen(!showMembers); }} />
					)}
				</div>

				{channel ? (
					<ChannelChat channel={channel}></ChannelChat>
				) : (
					!isPending && (
						<div className="flex flex-1 flex-col items-center justify-center gap-1 px-6 text-center">
							<h1 className="font-bold text-4xl sm:text-6xl text-text2">
								{t("channel.notFoundHeading")}
							</h1>
							<p className="text-text2">
								{t("channel.notFoundHint")}
							</p>
						</div>
					)
				)}
			</div>
			<MembersSidebar users={users} open={showMembers} onClose={() => { setMembersOpen(false); }}
				filter={(user) => channel ? isWhitelisted(channel, user, category) : false}
			/>
		</div>
	);
}
