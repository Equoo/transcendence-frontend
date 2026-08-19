import type { JSX } from "react";
import { PiPushPin, PiUsers } from "react-icons/pi";

import ChannelChat from "@/chat/components/ChannelChat";
import { useChat } from "@/chat/hooks/chat.hook";
import IconBtn from "@/components/IconBtn";

import type { Route } from "./+types/channel";

export default function ChannelRoute({
	params,
}: Route.ComponentProps): JSX.Element {
	const channel = useChat((state) => state.channels[params.channelId]);

	return (
		<div className="flex flex-col w-full h-full">
			<div className="flex flex-none items-center gap-3 border-b border-border px-5.5 py-3.75">
				<div className="flex flex-col">
					<div className="flex items-center gap-1.75 font-head text-[17px] font-[650]">
						<span className="text-muted">#</span>
						{channel?.name}
					</div>
					<div className="text-[12.5px] text-muted">
						{channel?.topic}
					</div>
				</div>
				<span className="flex-1" />
				{/* <AvatarGroup people={online} size={30} max={4} /> */}
				<IconBtn discrete icon={PiPushPin} />
				<IconBtn discrete icon={PiUsers} />
			</div>

			<ChannelChat channelId={channel?.id ?? ""}></ChannelChat>
		</div>
	);
}
