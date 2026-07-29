import { Suspense, type JSX } from "react";
import { PiPlusBold } from "react-icons/pi";
import { Form } from "react-router";
import CheckButton from "../../components/CheckButton";
import EventForm from "./EventForm";
import { fetchEventRoles } from "../api/event_roles.api";

export default function NewEvent({
	className,
}: {
	className?: string;
}): JSX.Element {
	const roles = fetchEventRoles();
	return (
		<Suspense
			fallback={
				<div className={className}>
					<CheckButton disabled pending>
						Event
					</CheckButton>
				</div>
			}
		>
			<EventForm roles={roles} />

			<Form className={className} defaultShouldRevalidate={false}>
				<CheckButton
					type="submit"
					active
					activeCheck={false}
					name="eventForm"
				>
					<PiPlusBold />
					Event
				</CheckButton>
			</Form>
		</Suspense>
	);
}
