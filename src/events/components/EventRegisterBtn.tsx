import { useState, type ComponentProps, type JSX } from "react";
import { useFetcher } from "react-router";
import type { EventSummary } from "../api/events.api";
import CheckButton from "../../components/CheckButton";
import Modal from "../../components/Modal";

export default function EventRegisterBtn({
	event: { isRegistered, size, registeredCount, id, eventRoles },
	className,
}: ComponentProps<"form"> & {
	event: EventSummary;
}): JSX.Element {
	const [showRegister, setShowRegister] = useState(false);
	const fetcher = useFetcher();

	const isFull = size === registeredCount;
	const presence =
		fetcher.state === "idle" ? isRegistered : fetcher.formMethod === "POST";

	return (
		<>
			<div className={`flex flex-col items-center ${className}`}>
				<CheckButton
					type="button"
					active={presence}
					discrete={isFull}
					disabled={isFull || fetcher.state !== "idle"}
					pending={fetcher.state !== "idle"}
					onClick={() => {
						if (isRegistered) {
							void fetcher.submit(null, {
								method: "DELETE",
								action: `/events/${id}/registration`,
							});
						} else {
							setShowRegister(true);
						}
					}}
				>
					{isRegistered ? "Registered" : isFull ? "Full" : "Register"}
				</CheckButton>
			</div>
			<fetcher.Form
				action={`/events/${id}/registration`}
				method={"POST"}
				onSubmit={() => {
					setShowRegister(false);
				}}
			>
				{showRegister && (
					<Modal
						title="Register"
						onClose={() => {
							setShowRegister(false);
						}}
					>
						<p className="text-muted font-main text-wrap font-light w-4/5 text-sm">
							Choose your preferred role for the event, an admin
							may still change your role.
						</p>
						<select
							name="eventRoleId"
							className="bg-surface border-border rounded-md text-text font-medium focus:ring-accent"
						>
							{eventRoles.map((er) => (
								<option
									key={er.id}
									value={er.id}
									selected={er.name === "Any"}
								>
									{er.name}
								</option>
							))}
						</select>
						<CheckButton type="submit">OK</CheckButton>
					</Modal>
				)}
			</fetcher.Form>
		</>
	);
}
