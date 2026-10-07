import type { JSX } from "react/jsx-runtime";

import Promisable from "@/components/Promisable";

import type { Invitation } from "../api/invitations.api";
import InvitationList from "./InvitationList";

export default function InvitationPromisable({
	previousInvitations,
	invitations: invitationsPromise,
	className,
}: {
	previousInvitations?: Invitation[];
	invitations: Invitation[] | Promise<Invitation[]>;
	className?: string;
}): JSX.Element {
	return (
		<div className={className}>
			<Promisable
				data={invitationsPromise}
				cached_data={previousInvitations}
			>
				{(invitations) => (
					<InvitationList invitations={invitations}></InvitationList>
				)}
			</Promisable>
		</div>
	);
}
