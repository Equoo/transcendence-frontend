import { useEffect, type ComponentProps, type JSX } from "react";
import { useFetcher } from "react-router";
import type { EventData } from "../../models/events";
import CheckButton from "../CheckButton";
import type { RegistrationActionResult } from "../../models/registrations";
import { toast } from "react-toastify";
import Alert from "../Alert";

export default function EventRegisterBtn({
	event,
	...rest
}: ComponentProps<"form"> & {
	event: EventData;
}): JSX.Element {
	const fetcher = useFetcher<RegistrationActionResult>();
	const isRegistered = event.registrations.some(
		(reg) => reg.user.userName === "asventi",
	);
	const presence =
		fetcher.state === "idle" ? isRegistered : fetcher.formMethod === "POST";

	useEffect(() => {
		if (fetcher.state === "idle" && fetcher.data?.ok === false) {
			toast.error(Alert, { data: { ...fetcher.data.error } });
		}
	}, [fetcher.state, fetcher.data]);

	return (
		<fetcher.Form
			action={`/events/${event.id}/registration`}
			method={isRegistered ? "DELETE" : "POST"}
			className={rest.className}
		>
			<div className={`flex flex-col items-center`}>
				<CheckButton
					type="submit"
					active={presence}
					pending={fetcher.state !== "idle"}
				>
					I'm here
				</CheckButton>
			</div>
		</fetcher.Form>
	);
}
