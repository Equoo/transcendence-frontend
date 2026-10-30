import { type JSX, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { PiX } from "react-icons/pi";

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
					confirmLabel={t("common.remove")}
				/>
			)}
			<button
				type="button"
				aria-label={t("eventDetails.unregisterUser")}
				title={t("eventDetails.unregisterUser")}
				className="flex items-center justify-center size-7 shrink-0 rounded-full text-text2 duration-150 cursor-pointer hover:bg-error-soft hover:text-error"
				onClick={() => {
					setShowConfirmation(true);
				}}
			>
				<PiX size={16} />
			</button>
		</>
	);
}
