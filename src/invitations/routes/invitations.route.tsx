import { createInvitation, toInvitationInput } from "../api/invitations.api";
import type { Route } from "./+types/invitations.route";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({ request }: Route.ClientActionArgs) {
	return createInvitation(toInvitationInput(await request.formData()));
}
