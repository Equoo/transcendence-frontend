// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function fetchUsers() {
	const res = await fetch("/api/users");
	const users = (await res.json()) as string;

	if (!res.ok) {
		return null;
	}
	return users;
}
