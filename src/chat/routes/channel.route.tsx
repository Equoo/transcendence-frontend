import { redirect } from "react-router";
import { toast } from "react-toastify";

import { createChannel } from "@/chat/api/chat.api";
import { useChat } from "@/chat/hooks/chat.hook";
import Alert from "@/components/Alert";

import type { Route } from "./+types/channel.route";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({ request }: Route.ClientActionArgs) {
	const res = await createChannel(await request.formData());

	if (!res.ok) {
		toast.error(Alert, { data: { ...res.error } });
		return res;
	}

	useChat.getState().addChannel(res.channel);

	return redirect(`/channels/${res.channel.id}`);
}
