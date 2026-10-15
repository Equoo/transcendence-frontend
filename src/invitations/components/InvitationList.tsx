import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";

import List, { ListAction, ListCell, ListRow } from "@/components/List/List";

import type { Invitation } from "../api/invitations.api";
import type { clientAction } from "../routes/invitations.route";

export default function InvitationList({
	invitations,
}: {
	invitations: Invitation[];
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const fetcher = useFetcher<typeof clientAction>();
	return (
		<List
			cols={[
				{ id: t("auth.invitationCode"), pos: "text-left" },
				{ id: t("invitations.expiration"), pos: "text-left" },
				{
					id: t("invitations.remainingUsages"),
					pos: "text-center",
				},
				{ id: t("common.actions"), pos: "text-right" },
			]}
		>
			{invitations.map((invitation) => (
				<ListRow key={invitation.id}>
					<ListCell rowHeader>{invitation.id}</ListCell>
					<ListCell pos="text-center">
						{invitation.usages === -1
							? "Never"
							: new Date(invitation.expiresAt).toLocaleString()}
					</ListCell>
					<ListCell pos="text-center">
						{invitation.usages === -1
							? "Infinite"
							: invitation.usages}
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
							{t("invitations.remove")}
						</ListAction>
					</ListCell>
				</ListRow>
			))}
		</List>
	);
}
