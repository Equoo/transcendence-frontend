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
	
	const message = {
		...res.data,
		sentAt: new Date(res.data.sentAt),
		editAt: res.data.editAt ? new Date(res.data.editAt) : undefined,
	}

	useChat.getState().addMsg(params.channelId, message);

	return res;
}
