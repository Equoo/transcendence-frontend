import { type ComponentProps, type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";

import { Field } from "@/components/Input/Field";
import { Select } from "@/components/Input/Select";
import Modal, { ModalFooter } from "@/components/Modal/Modal";

import CheckButton from "../../components/Button/CheckButton";
import { type EventSummary, isEventFull } from "../api/events.api";

export default function EventRegisterBtn({
	event: { isRegistered, size, registeredCount, id, eventRoles },
	className,
}: ComponentProps<"form"> & {
	event: EventSummary;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [showRegister, setShowRegister] = useState(false);
	const fetcher = useFetcher();

	const isFull = isEventFull({ size, registeredCount });
	const presence =
		fetcher.state === "idle" ? isRegistered : fetcher.formMethod === "POST";

	return (
		<>
			<div className={`flex flex-col items-center ${className}`}>
				<CheckButton
					type="button"
					active={presence}
					discrete={isFull}
					disabled={
						(isFull && !isRegistered) || fetcher.state !== "idle"
					}
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
					{isRegistered
						? t("events.registered")
						: isFull
							? t("events.full")
							: t("events.register")}
				</CheckButton>
			</div>
			{showRegister && (
				<Modal
					size="sm"
					title={t("events.register")}
					subtitle={t("events.registerHint")}
					onClose={() => {
						setShowRegister(false);
					}}
				>
					<fetcher.Form
						action={`/events/${id}/registration`}
						method="POST"
						className="contents"
						onSubmit={() => {
							setShowRegister(false);
						}}
					>
						<Field name="eventRoleId" label={t("events.role")}>
							<Select
								name="eventRoleId"
								defaultValue={
									eventRoles.find((er) => er.name === "Any")
										?.id
								}
								options={eventRoles.map((er) => ({
									value: er.id,
									label: er.name,
								}))}
							/>
						</Field>
						<ModalFooter>
							<CheckButton
								type="submit"
								active
								activeCheck={false}
							>
								{t("events.register")}
							</CheckButton>
						</ModalFooter>
					</fetcher.Form>
				</Modal>
			)}
		</>
	);
}
