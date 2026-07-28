import type { Route } from "./+types/channel";
import { redirect } from "react-router";
import { toast } from "react-toastify";
import { createChannel, useChat, type ChannelActionResult } from "../../models/chat";
import Alert from "../../components/Alert";

export async function clientAction({
	request,
}: Route.ClientActionArgs): Promise<ChannelActionResult> {
	const res = await createChannel(await request.formData());

	if (!res.ok) {
		toast.error(Alert, { data: { ...res.error } });	
		return res;
	}

	useChat.getState().addChannel(res.channel);

	return redirect(`/channels/${res.channel.id}`);
}
