import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiPlusBold } from "react-icons/pi";
import { useFetcher } from "react-router";

import { otherErrors, validationErrors } from "@/api/problem_detail";
import { Slidebox } from "@/components/Input/Slidebox";
import Modal, { ModalFooter } from "@/components/Modal/Modal";
import { toInputValue } from "@/utils/date.util";

import CheckButton from "../../components/Button/CheckButton";
import { Input } from "../../components/Input/Input";
import type { clientAction as invitationAction } from "../routes/invitations.route";

const FIELD_KEYS = ["Permanent", "Expires At", "Usages"];

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
	const errors = validationErrors(invitationFetcher.data);
	const link =
		typeof invitationFetcher.data === "string" &&
		`${window.location.origin}/register?invitation=${invitationFetcher.data}`;

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
					subtitle={t("invitations.hint")}
					highlight={Boolean(link)}
					onClose={() => {
						setShowInvitationForm(false);
					}}
				>
					<invitationFetcher.Form
						action="/invitations"
						method="POST"
						className="contents"
					>
						<div className="flex flex-col gap-4">
							<Slidebox
								name="Permanent"
								label={t("invitations.permanent")}
								hint={t("invitations.permanentHint")}
								errors={errors}
								checked={permanent}
								onChange={(ev) => {
									setPermanent(ev.target.checked);
								}}
							/>
							{!permanent && (
								<div className="grid gap-4 sm:grid-cols-2">
									<Input
										name="Expires At"
										label={t("invitations.expiresAt")}
										type="datetime-local"
										required
										errors={errors}
										min={toInputValue(date)}
									/>
									<Input
										max={2147483646}
										name="Usages"
										label={t("invitations.usages")}
										type="number"
										required
										errors={errors}
										min="1"
										placeholder={t("invitations.maxUsages")}
									/>
								</div>
							)}
							{link && (
								<Input
									name="Invitation Link"
									label={t("invitations.link")}
									readOnly
									grayed
									copyable
									value={link}
								/>
							)}
						</div>
						<ModalFooter errors={otherErrors(errors, FIELD_KEYS)}>
							<CheckButton
								active
								activeCheck={false}
								type="submit"
								pending={invitationFetcher.state !== "idle"}
							>
								{link
									? t("invitations.createAnother")
									: t("invitations.createLink")}
							</CheckButton>
						</ModalFooter>
					</invitationFetcher.Form>
				</Modal>
			)}
		</>
	);
}
