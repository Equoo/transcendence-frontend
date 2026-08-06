export interface RoleInput {
	Name: string;
	Permission: number;
}

export interface Role {
	id: string;
	name: string;
	permission: number;
}

export enum Perm {
	isAdmin = 1,

	// Event
	CreateEvent = 2,
	DeleteEvent = 4,
	GetEvents = 8,
	ChangeEvent = 16,

	// User
	GetUser = 32,
	CreateUser = 64,
	ChangeUserName = 128,
	DeleteUser = 256,
	ResetUserPassword = 516,

	// Chat
	SendMessage = 1024,
	CreateChannel = 2048,
	DeleteChannel = 5096,

	// Knowledge

	// Calendar
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function fetchRoles() {
	const res = await fetch("/api/roles");
	const roles = (await res.json()) as string;

	if (!res.ok) {
		return null;
	}
	return roles;
}

function getPermissionBytes(data: FormData): number {
	let permission = 0 as number;
	for (const pair of data.entries()) {
		if (pair[0] === "name") {
			// eslint-disable-next-line no-continue
			continue;
		}
		permission += Number(pair[1]);
	}
	return permission;
}
export function toRoleInput(data: FormData): RoleInput {
	return {
		Name: data.get("name") as string,
		Permission: getPermissionBytes(data),
	};
}
