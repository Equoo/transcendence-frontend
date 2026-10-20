import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiX } from "react-icons/pi";
import { toast } from "react-toastify";

import ChoiceModal from "@/components/Modal/ChoiceModal";

import type { EventData } from "../api/events.api";
import type { Registration } from "../api/registrations.api";

export default function UnregisterUser({
	registration,
	event,
}: {
	registration: Registration;
	event: EventData;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [showConfirmation, setShowConfirmation] = useState(false);

	return (
		<>
			{showConfirmation && (
				<ChoiceModal
					action={`/events/${event.id}/registration/${registration.user.id}`}
					method="DELETE"
					then={() => {
						toast.success(
							t("eventDetails.unregisterUserSuccess", {
								name: registration.user.userName,
								event: event.name,
							}),
						);
					}}
					onClose={() => {
						setShowConfirmation(false);
					}}
					title={t("eventDetails.unregisterUserTitle", {
						name: registration.user.userName,
					})}
				/>
			)}
			<PiX
				size={20}
				className="shrink-0 hover:cursor-pointer text-text2 hover:text-error"
				title={t("eventDetails.unregisterUser")}
				onClick={() => {
					setShowConfirmation(true);
				}}
			/>
		</>
	);
}
