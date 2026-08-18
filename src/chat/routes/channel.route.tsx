import { redirect } from "react-router";

import { createChannel } from "@/chat/api/chat.api";
import { useChat } from "@/chat/hooks/chat.hook";

import type { Route } from "./+types/channel.route";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({ request }: Route.ClientActionArgs) {
	const channel = await createChannel(await request.formData());

	useChat.getState().addChannel(channel);

	return redirect(`/channels/${channel.id}`);
}
