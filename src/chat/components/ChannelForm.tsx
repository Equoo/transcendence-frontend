import { type JSX, useState } from "react";
import { PiPlus } from "react-icons/pi";
import { useFetcher } from "react-router";

import CheckButton from "@/components/CheckButton";
import Modal from "@/components/Modal";

import type { Channel } from "../api/chat.api";

export default function ChannelForm(): JSX.Element {
	const fetcher = useFetcher<Channel>();
	const [showChannelForm, setShowChannelForm] = useState(false);
	const [prevFetcherState, setPrevFetcherState] = useState(fetcher.state);

	if (prevFetcherState !== fetcher.state) {
		setPrevFetcherState(fetcher.state);
		if (fetcher.state === "idle" && prevFetcherState !== "idle") {
			setShowChannelForm(false);
		}
	}

	return (
		<>
			<li className="flex justify-between items-center px-2 py-1.5 mt-3 text-[11px] text-muted font-bold tracking-wider uppercase group">
				Channels{" "}
				<button
					className="cursor-pointer hover:text-text"
					type="button"
					name="channelForm"
					onClick={() => {
						setShowChannelForm(true);
					}}
				>
					<PiPlus size={14} />
				</button>
			</li>

			{showChannelForm && (
				<Modal
					title="Create a channel"
					onClose={() => {
						setShowChannelForm(false);
					}}
				>
					<fetcher.Form
						action="/channels"
						method="post"
						className="flex flex-col items-center w-4/5 gap-5 mb-4"
					>
						<div className="inline-flex flex-col w-full bg-sur">
							<div className="text-red-500">
								<label
									className="text-text font-main font-medium"
									htmlFor="channelform-name"
								>
									Name
								</label>
								*
							</div>
							<input
								id="channelform-name"
								name="name"
								required
								className="w-full bg-white border rounded-md border-border2 inset-shadow-xs px-2 py-1 font-main text-text"
								placeholder="Channel Name"
							/>
						</div>
						<div className="inline-flex flex-col w-full bg-sur">
							<div className="text-red-500">
								<label
									className="text-text font-main font-medium"
									htmlFor="channelform-topic"
								>
									Topic
								</label>
								*
							</div>
							<input
								id="channelform-topic"
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
