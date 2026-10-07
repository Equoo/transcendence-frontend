import { PermEnum } from "@/admin/api/roles";
import type { User } from "@/users/api/users";

import type { Channel, ChannelCategory } from "../api/chat.api";

const WHITESPACE = /\s+/gu;
const FORBIDDEN = /[$%^&*()+|~={}[\]:;<>?,./\\`´'"!@#]/gu;
const DASH_RUNS = /-{2,}/gu;
const EDGE_DASHES = /^-+|-+$/gu;

export function sanitizeChannelSlug(input?: string | null): string {
	if (!input?.trim()) {
		return "";
	}

	return input
		.toLowerCase()
		.replace(WHITESPACE, "-")
		.replace(FORBIDDEN, "")
		.replace(DASH_RUNS, "-")
		.replace(EDGE_DASHES, "");
}

export function isWhitelisted(
	ent: Channel | ChannelCategory,
	user: User,
	category?: ChannelCategory | null,
): boolean {
	if ((user.role.permission & PermEnum.HandleChannels) !== 0) {
		return true;
	}

	if (category) {
		if (category.rolesWhitelist.length > 0) {
			if (
				category.rolesWhitelist.findIndex(
					(role) => role.id === user.role.id,
				) === -1
			) {
				return false;
			}
		}
		return true;
	}

	if (ent.rolesWhitelist.length > 0) {
		if (
			ent.rolesWhitelist.findIndex((role) => role.id === user.role.id) ===
			-1
		) {
			return false;
		}
	}
	return true;
}
