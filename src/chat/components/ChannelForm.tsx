import { type JSX, useEffect } from "react";
import { useFetcher, useSearchParams } from "react-router";

import CheckButton from "@/components/CheckButton";
import Modal from "@/components/Modal";

import type { ChannelActionResult } from "../api/chat.api";

export default function ChannelForm(): JSX.Element {
	const fetcher = useFetcher<ChannelActionResult>();
	const [searchParams, setSearchParams] = useSearchParams();
	const showEventForm = searchParams.get("channelForm");

	useEffect(() => {
		if (fetcher.state === "idle" && (fetcher.data?.ok ?? false)) {
			setSearchParams((sp) => {
				sp.delete("channelForm");
				return sp;
			});
		}
	}, [fetcher.data?.ok, fetcher.state, setSearchParams]);
	return (
		<>
			{showEventForm === null ? null : (
				<Modal title="Create a channel" name="Channel">
					<fetcher.Form
						action="/channels"
						method="post"
						className="flex flex-col items-center w-4/5 gap-5 mb-4"
					>
						<div className="inline-flex flex-col w-full bg-sur">
							<div className="text-red-500">
								<label className="text-text font-main font-medium">
									Name
								</label>
								*
							</div>
							<input
								name="name"
								required
								className="w-full bg-white border rounded-md border-border2 inset-shadow-xs px-2 py-1 font-main text-text"
								placeholder="Channel Name"
							/>
						</div>
						<div className="inline-flex flex-col w-full bg-sur">
							<div className="text-red-500">
								<label className="text-text font-main font-medium">
									Topic
								</label>
								*
							</div>
							<input
								name="topic"
								required
								className="w-full bg-white border rounded-md border-border2 inset-shadow-xs px-2 py-1 font-main text-text"
								placeholder="Channel Topic"
							/>
						</div>
						<CheckButton
							active
							type="submit"
							pending={fetcher.state !== "idle"}
						>
							Create
						</CheckButton>
					</fetcher.Form>
				</Modal>
			)}
		</>
	);
}
