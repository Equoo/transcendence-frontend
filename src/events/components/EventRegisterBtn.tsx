import { useState, type ComponentProps, type JSX } from "react";
import { useFetcher, useRouteLoaderData } from "react-router";
import type { EventData } from "../api/events.api";
import CheckButton from "../../components/CheckButton";
import Modal from "../../components/Modal";
import type { clientAction as registerAction } from "../routes/registrations.route";
import type { clientLoader as userLoader } from "../../routes/dashboard";

export default function EventRegisterBtn({
	event,
}: ComponentProps<"form"> & {
	event: EventData;
}): JSX.Element {
	const [showRegister, setShowRegister] = useState(false);
	const fetcher = useFetcher<typeof registerAction>();
	const user = useRouteLoaderData<typeof userLoader>("routes/dashboard");

	const isRegistered = event.registrations.some(
		(reg) => reg.user.id === user?.id,
	);
	const isFull = event.size === event.registrations.length;
	const presence =
		fetcher.state === "idle" ? isRegistered : fetcher.formMethod === "POST";

	return (
		<>
			<div className={`flex flex-col items-center`}>
				<CheckButton
					type="button"
					active={presence}
					discrete={isFull}
					disabled={isFull}
					pending={fetcher.state !== "idle"}
					onClick={() => {
						if (isRegistered) {
							void fetcher.submit(null, {
								method: "DELETE",
								action: `/events/${event.id}/registration`,
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
				action={`/events/${event.id}/registration`}
				method={"POST"}
				onSubmit={() => {
					setShowRegister(false);
				}}
			>
				{showRegister && (
					<Modal
						name="eventRegister"
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
							{event.eventRoles.map((er) => (
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
