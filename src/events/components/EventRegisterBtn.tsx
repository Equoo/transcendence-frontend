import { useEffect, type ComponentProps, type JSX } from "react";
import { useFetcher, useSearchParams } from "react-router";
import type { EventData } from "../api/events.api";
import CheckButton from "../../components/CheckButton";
import Modal from "../../components/Modal";
import type { clientAction as registerAction } from "../routes/registrations.route";

export default function EventRegisterBtn({
	event,
	...rest
}: ComponentProps<"form"> & {
	event: EventData;
}): JSX.Element {
	const [searchParams, setSearchParams] = useSearchParams();
	const fetcher = useFetcher<typeof registerAction>();
	const isRegistered = event.registrations.some(
		(reg) => reg.user.userName === "asventi",
	);
	const isFull = event.size === event.registrations.length;
	const presence =
		fetcher.state === "idle" ? isRegistered : fetcher.formMethod === "POST";
	const showRegister = searchParams.get("eventRegister");

	useEffect(() => {
		if (fetcher.state === "submitting") {
			setSearchParams((sp) => {
				sp.delete("eventRegister");
				return sp;
			});
		}
	}, [fetcher.state, fetcher.data]);

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
							setSearchParams((prev) => {
								prev.append("eventRegister", event.id);
								return prev;
							});
						}
					}}
				>
					{isRegistered ? "Registered" : isFull ? "Full" : "Register"}
				</CheckButton>
			</div>
			<fetcher.Form
				action={`/events/${event.id}/registration`}
				method={"POST"}
				className={rest.className}
			>
				{showRegister === event.id && (
					<Modal name="eventRegister" title="Register">
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
