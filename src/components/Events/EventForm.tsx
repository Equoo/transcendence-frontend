import { useEffect, type JSX } from "react";
import { useFetcher } from "react-router";
import CheckButton from "../CheckButton";
import Modal from "../Modal";
import type { EventActionResult } from "../../lib/events";

export default function EventForm({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}): JSX.Element {
	const fetcher = useFetcher<EventActionResult>();

	useEffect(() => {
		if (fetcher.state === "idle" && (fetcher.data?.ok ?? false)) {
			onClose();
		}
	}, [fetcher.data, fetcher.state, onClose]);

	return (
		<Modal title="Create An Event" isOpen={isOpen} onClose={onClose}>
			<p className="text-muted font-main font-light w-4/5 text-sm">
				You will be automatically registered to the event and set as the
				Organizer. You can still unregister after the creation.
			</p>
			<fetcher.Form
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
						placeholder="Event Name"
					/>
				</div>
				<div className="inline-flex flex-col w-full bg-sur">
					<div className="text-red-500">
						<label className="text-text font-main font-medium">
							Date
						</label>
						*
					</div>
					<input
						type="datetime-local"
						required
						name="date"
						className="w-full bg-white border rounded-md border-border2 inset-shadow-xs px-2 py-1 font-main text-text"
					/>
				</div>
				<div className="inline-flex flex-col w-full">
					<div className="text-red-500">
						<label className="text-text font-main font-medium">
							Size
						</label>
						*
					</div>
					<input
						name="size"
						type="number"
						required
						min="1"
						className="w-full bg-white border rounded-md border-border2 inset-shadow-xs px-2 py-1 font-main text-text"
						placeholder="Max Registrations"
					/>
				</div>
				<div className="inline-flex flex-col w-full">
					<div className="text-red-500">
						<label className="text-text font-main font-medium">
							Location
						</label>
						*
					</div>
					<input
						name="location"
						required
						className="w-full bg-white border rounded-md border-border2 inset-shadow-xs px-2 py-1 font-main text-text"
						placeholder="Event Location"
					/>
				</div>
				<div className="inline-flex flex-col w-full">
					<label className="text-text font-main font-medium">
						Tags
					</label>
					<input
						name="tags"
						className="w-full bg-white border rounded-md border-border2 inset-shadow-xs px-2 py-1 font-main text-text"
						placeholder="List of tags separated by a space"
					/>
				</div>
				<div className="inline-flex flex-col w-full">
					<label className="text-text font-main font-medium">
						Description
					</label>
					<textarea
						name="description"
						className="w-full bg-white border rounded-md border-border2 inset-shadow-xs px-2 py-1 font-main text-text"
						placeholder="Event Description"
					/>
				</div>
				{fetcher.data && !fetcher.data.ok ? (
					<p className="w-full text-sm text-red-500 font-main text-center">
						{fetcher.data.error}
					</p>
				) : null}
				<CheckButton
					active
					type="submit"
					pending={fetcher.state !== "idle"}
				>
					Ok
				</CheckButton>
			</fetcher.Form>
		</Modal>
	);
}
