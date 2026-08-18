import { type JSX, useState } from "react";
import { PiPlusBold } from "react-icons/pi";
import { useFetcher } from "react-router";

import CheckButton from "../../components/CheckButton";
import { Input } from "../../components/Input";
import Modal from "../../components/Modal";
import type { clientAction as invitationAction } from "../routes/invitations.route";

export default function InvitationForm({
	className,
}: {
	className?: string;
}): JSX.Element {
	const [link, setLink] = useState("");
	const invitationFetcher = useFetcher<typeof invitationAction>();
	const [showInvitationForm, setShowInvitationForm] = useState(false);
	const [prevFetcherState, setPrevFetcherState] = useState(
		invitationFetcher.state,
	);

	if (prevFetcherState !== invitationFetcher.state) {
		setPrevFetcherState(invitationFetcher.state);
		if (invitationFetcher.state === "idle" && prevFetcherState !== "idle") {
			setLink(
				`${window.location.href}register?invitation=${invitationFetcher.data}`,
			);
		}
	}

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
				Invite
			</CheckButton>

			{showInvitationForm && (
				<Modal
					title="Create An Invitation"
					onClose={() => {
						setShowInvitationForm(false);
					}}
				>
					<p className="text-muted font-main font-light w-4/5 text-sm">
						You will get a link to share. Do not share to public
						space. The link will be automatically deleted if it's
						expired or reach all of it's usages
					</p>
					<invitationFetcher.Form
						action="/invitations"
						method="POST"
						className="flex flex-col items-center w-4/5 gap-5 mb-4"
					>
						<Input
							name="Expires At"
							type="datetime-local"
							required
							placeholder="Expiration Date"
						/>
						<Input
							name="Usages"
							type="number"
							required
							min="1"
							placeholder="Max Usages"
						/>
						<Input
							name="Invitation Link"
							disabled
							grayed
							copyable
							value={link}
						/>
						<CheckButton
							active
							type="submit"
							pending={invitationFetcher.state !== "idle"}
						>
							Ok
						</CheckButton>
					</invitationFetcher.Form>
				</Modal>
			)}
		</>
	);
}
