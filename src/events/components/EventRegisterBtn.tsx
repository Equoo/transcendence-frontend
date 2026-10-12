import { type ComponentProps, type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";

import CheckButton from "../../components/Button/CheckButton";
import Modal from "../../components/Modal/Modal";
import type { EventSummary } from "../api/events.api";

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

	const isFull = size <= registeredCount;
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
			<fetcher.Form
				action={`/events/${id}/registration`}
				method={"POST"}
				onSubmit={() => {
					setShowRegister(false);
				}}
			>
				{showRegister && (
					<Modal
						title={t("events.register")}
						onClose={() => {
							setShowRegister(false);
						}}
					>
						<p className="text-muted font-main text-wrap font-light w-4/5 text-sm">
							{t("events.registerHint")}
						</p>
						<select
							name="eventRoleId"
							className="bg-surface border-border rounded-md text-text font-medium focus:ring-accent"
							defaultValue={
								eventRoles.find((er) => er.name === "Any")?.id
							}
						>
							{eventRoles.map((er) => (
								<option key={er.id} value={er.id}>
									{er.name}
								</option>
							))}
						</select>
						<CheckButton type="submit">
							{t("common.ok")}
						</CheckButton>
					</Modal>
				)}
			</fetcher.Form>
		</>
	);
}
