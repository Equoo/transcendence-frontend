import { type Message, sendMessage } from "@/chat/api/chat.api";
import { useChat } from "@/chat/hooks/chat.hook";

import type { Route } from "./+types/message.route";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({
	params,
	request,
}: Route.ClientActionArgs) {
	const res = await sendMessage(
		params.channelId,
		(await request.formData()).get("content") as string,
	);

	if (!res.ok) {
		return res;
	}

	const message = {
		...res.data,
		sentAt: new Date(res.data.sentAt),
		editAt: res.data.editAt ? new Date(res.data.editAt) : null,
	} as Message;

	useChat.getState().addMsg(params.channelId, message);

	return res;
}
