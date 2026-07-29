import type { JSX } from "react";
import type { Route } from "./+types/channel";
import { fetchMessages, type Message, type Channel } from "../models/chat";
import { FiChevronLeft } from "react-icons/fi";
import { redirect, useNavigate } from "react-router";
import { toast } from "react-toastify";
import Alert from "../components/Alert";
import ProfilePic from "../components/ProfilePic";

export async function clientLoader({
	params,
}: Route.ClientLoaderArgs): Promise<Message[] | Response> {
	const res = await fetchMessages(params.channelId, 10, "");

	if (!res.ok) {
		toast.error(Alert, { data: { ...res.error } });
		return redirect("/");
	}
	return res.messages;
}

export default function Channel({
	loaderData: messages,
}: Route.ComponentProps): JSX.Element {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col w-full h-full">
			{messages.map((msg) => (
				<p>{msg.content}</p>
			))}
		</div>
	);
}
