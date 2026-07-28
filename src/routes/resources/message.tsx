import type { Route } from "./+types/message";
import { sendMessage, useChat, type ActionResult } from "../../models/chat";

export async function clientAction({
	params,
	request,
}: Route.ClientActionArgs): Promise<ActionResult> {
	const res = await sendMessage(
		params.channelId,
		(await request.formData()).get("content") as string
	);

	if (!res.ok) {
		toast.error(Alert, { data: { ...res.error } });	
		return res;
	}

	useChat.getState().addMsg(params.channelId, res.data);

	return res;
}
