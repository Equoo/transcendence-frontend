import { type JSX, useEffect, useRef } from "react";
import { PiPushPin, PiUsers } from "react-icons/pi";
import { useNavigate } from "react-router";

import ChannelChat from "@/chat/components/ChannelChat";
import { useChannel } from "@/chat/hooks/useChannels";
import IconBtn from "@/components/Button/IconBtn";

import type { Route } from "./+types/channel";

export default function ChannelRoute({
	params,
}: Route.ComponentProps): JSX.Element {
	const { data: channel, isPending } = useChannel(params.channelId);
	const hasChannel = Boolean(channel);

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
		<div className="relative flex flex-col w-full h-full">
			<div className="flex flex-none items-center gap-3 border-b border-border px-5.5 py-3.75">
				<div className="flex flex-col">
					<div className="flex items-center gap-1.75 font-head text-[17px] font-[650]">
						<span className="text-muted">#</span>
						{isPending ? "" : channel?.name ?? "404 no such channel"}
					</div>
					<div className="text-[12.5px] text-muted">
						{channel?.topic ?? ""}
					</div>
				</div>
				<span className="flex-1" />
				{hasChannel && (<>
					<IconBtn discrete icon={PiPushPin} />
					<IconBtn discrete icon={PiUsers} />
				</>)}
			</div>

			{channel ? (
				<ChannelChat channelId={channel.id}></ChannelChat>
			) : !isPending && (<div className="absolute flex flex-col items-center top-1/2 left-1/2 -translate-1/2">
				<h1 className="font-bold text-6xl text-text2">404</h1>
				<h2 className="font-bold text-3xl text-text2">No such channel</h2>
				<p className="text-text2">May be deleted or never exist.</p>
			</div>)}
		</div>
	);
}
