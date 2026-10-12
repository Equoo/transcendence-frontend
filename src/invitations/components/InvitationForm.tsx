import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiPlusBold } from "react-icons/pi";
import { useFetcher } from "react-router";

import { Slidebox } from "@/components/Input/Slidebox";

import CheckButton from "../../components/Button/CheckButton";
import { Input } from "../../components/Input/Input";
import Modal from "../../components/Modal/Modal";
import type { clientAction as invitationAction } from "../routes/invitations.route";

export default function InvitationForm({
	className,
}: {
	className?: string;
}): JSX.Element {
	const [date] = useState(() => new Date());
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const invitationFetcher = useFetcher<typeof invitationAction>();
	const [showInvitationForm, setShowInvitationForm] = useState(false);
	const [permanent, setPermanent] = useState(false);

	return (
		<>
			<CheckButton
				type="button"
				className={className}
				active
				activeCheck={false}
				onClick={() => {
					setShowInvitationForm(true);
				}}
			>
				<PiPlusBold />
				{t("invitations.invite")}
			</CheckButton>

			{showInvitationForm && (
				<Modal
					title={t("invitations.createTitle")}
					onClose={() => {
						setShowInvitationForm(false);
					}}
				>
					<p className="text-muted font-main font-light w-4/5 text-sm">
						{t("invitations.hint")}
					</p>
					<invitationFetcher.Form
						action="/invitations"
						method="POST"
						className="flex flex-col items-center w-4/5 gap-5 mb-4"
					>
						<Slidebox
							name="Permanent"
							checked={permanent}
							onChange={(ev) => {
								setPermanent(ev.target.checked);
							}}
						></Slidebox>
						{!permanent && (
							<>
								<Input
									name="Expires At"
									label={t("invitations.expiresAt")}
									type="datetime-local"
									required
									min={date
										.toISOString()
										.slice(
											0,
											date.toISOString().lastIndexOf(":"),
										)}
									placeholder={t(
										"invitations.expirationDate",
									)}
								/>
								<Input
									max={2147483646}
									name="Usages"
									label={t("invitations.usages")}
									type="number"
									required
									min="1"
									placeholder={t("invitations.maxUsages")}
								/>
							</>
						)}

						<Input
							name="Invitation Link"
							label={t("invitations.link")}
							disabled
							grayed
							copyable
							value={
								invitationFetcher.data &&
								`${window.location.origin}/register?invitation=${invitationFetcher.data}`
							}
						/>

						<CheckButton
							active
							type="submit"
							pending={invitationFetcher.state !== "idle"}
						>
							{t("common.ok")}
						</CheckButton>
					</invitationFetcher.Form>
				</Modal>
			)}
		</>
	);
}
