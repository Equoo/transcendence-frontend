import type { JSX } from "react/jsx-runtime";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";

import { Select } from "@/components/Input/Select";

import type { EventData } from "../api/events.api";
import type { Registration } from "../api/registrations.api";

export default function RoleChange({
	className,
	registration,
	event,
}: {
	className?: string;
	registration: Registration;
	event: EventData;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const fetcher = useFetcher();

	return (
		<Select
			className={className}
			defaultValue={
				event.eventRoles.find((re) => re.name === registration.role)?.id
			}
			options={event.eventRoles.map((er) => ({
				value: er.id,
				label: er.name,
			}))}
			onChange={(value) => {
				const role = event.eventRoles.find((er) => er.id === value);
				void fetcher
					.submit(
						JSON.stringify({
							eventRoleId: value,
							userId: registration.user.id,
						}),
						{
							method: "PATCH",
							action: `/events/${event.id}/registration`,
							encType: "application/json",
						},
					)
					.then(() => {
						toast.success(
							t("eventDetails.roleChangeSuccess", {
								name: registration.user.userName,
								role: role?.name,
							}),
							{ duration: 2000 },
						);
					});
			}}
		/>
	);
}
