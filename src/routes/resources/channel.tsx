import type { Route } from "./+types/channel";
import { toast } from "react-toastify";
import { createChannel, useChannels, type ChannelActionResult } from "../../models/chat";
import Alert from "../../components/Alert";

export async function clientAction({
	request,
}: Route.ClientActionArgs): Promise<ChannelActionResult> {
	const res = await createChannel(await request.formData());

	if (!res.ok) {
		toast.error(Alert, { data: { ...res.error } });	
		return res;
	}
	toast.success(Alert, {
		data: { title: "Channel successfully created" },
	});

	useChannels.getState().addChannel(res.channel);

	console.log("Channels: ", useChannels.getState().channels);
	return res;
}
