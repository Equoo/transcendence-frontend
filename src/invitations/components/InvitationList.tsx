import type { JSX } from "react/jsx-runtime";
import { useFetcher } from "react-router";

import List, { ListAction, ListCell, ListRow } from "@/components/List";
import Promisable from "@/components/Promisable";

import type { Invitation } from "../api/invitations.api";
import type { clientAction } from "../routes/invitations.route";

export default function InvitationList({
	invitations: invitationsPromise,
	className,
}: {
	invitations: Invitation[] | Promise<Invitation[]>;
	className?: string;
}): JSX.Element {
	const fetcher = useFetcher<typeof clientAction>();

	return (
		<div className={className}>
			<Promisable data={invitationsPromise}>
				{(invitations) => (
					<List
						cols={[
							{ id: "Invitation Code", pos: "text-left" },
							{ id: "Expiration", pos: "text-left" },
							{ id: "Remaining Usages", pos: "text-center" },
							{ id: "Actions", pos: "text-right" },
						]}
					>
						{invitations.map((invitation) => (
							<ListRow key={invitation.id}>
								<ListCell rowHeader>{invitation.id}</ListCell>
								<ListCell>
									{new Date(
										invitation.expiresAt,
									).toLocaleString()}
								</ListCell>
								<ListCell pos="text-center">
									{invitation.usages}
								</ListCell>
								<ListCell pos="text-right">
									<ListAction
										onClick={() => {
											void fetcher.submit(null, {
												action: `/invitations/${invitation.id}`,
												method: "DELETE",
											});
										}}
									>
										Remove
									</ListAction>
								</ListCell>
							</ListRow>
						))}
					</List>
				)}
			</Promisable>
		</div>
	);
}
