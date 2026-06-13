import EventCard from "../components/EventCard";
import { useState, type JSX } from "react";
import { PiPlusBold } from "react-icons/pi";
import CheckButton from "../components/CheckButton";
import Modal from "../components/Modal";

export default function Home(): JSX.Element {
	const [showEventForm, setShowEventForm] = useState(false);

	return (
		<>
			<div className="w-full flex flex-row px-6 py-4 justify-between items-center">
				<h1 className="font-semibold tracking-tight text-xl">
					Accueil
				</h1>
				<CheckButton
					active
					activeCheck={false}
					onClick={() => {
						setShowEventForm(true);
					}}
				>
					<PiPlusBold />
					Event
				</CheckButton>
			</div>
			<div className="w-full flex px-4 py-8 gap-8 flex-nowrap overflow-auto">
				<EventCard />
				<EventCard />
			</div>
			<Modal
				title="Create An Event"
				isOpen={showEventForm}
				onClose={() => {
					setShowEventForm(false);
				}}
			>
				<p className="text-muted font-main font-light w-4/5 text-sm">
					You will be automatically registered to the event and set as
					the Organizer. You can still unregister after the creation.
				</p>
				<form className="flex flex-col items-center w-4/5 gap-5 mb-4">
					<div className="inline-flex flex-col w-full bg-sur">
						<div className="text-red-500">
							<label className="text-text font-main font-medium">
								Name
							</label>
							*
						</div>
						<input
							className="w-full bg-white border rounded-md border-border2 inset-shadow-xs px-2 py-1 font-main text-text"
							placeholder="Event Name"
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
							type="number"
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
							className="w-full bg-white border rounded-md border-border2 inset-shadow-xs px-2 py-1 font-main text-text"
							placeholder="Event Location"
						/>
					</div>
					<div className="inline-flex flex-col w-full">
						<label className="text-text font-main font-medium">
							Tags
						</label>
						<input
							className="w-full bg-white border rounded-md border-border2 inset-shadow-xs px-2 py-1 font-main text-text"
							placeholder="List of tags separated by a space"
						/>
					</div>
					<div className="inline-flex flex-col w-full">
						<label className="text-text font-main font-medium">
							Description
						</label>
						<textarea
							className="w-full bg-white border rounded-md border-border2 inset-shadow-xs px-2 py-1 font-main text-text"
							placeholder="Event Description"
						/>
					</div>
					<CheckButton active>Ok</CheckButton>
				</form>
			</Modal>
		</>
	);
}
