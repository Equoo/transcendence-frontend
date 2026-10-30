import {
	createInvitation,
	deleteInvitation,
	toInvitationInput,
} from "../api/invitations.api";
import type { Route } from "./+types/invitations.route";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({
	request,
	params,
}: Route.ClientActionArgs) {
	let res;

	if (request.method === "POST") {
		res = await createInvitation(
			toInvitationInput(await request.formData()),
		);
	} else if (request.method === "DELETE") {
		res = await deleteInvitation(params.id ?? "");
	}
	return res;
}
