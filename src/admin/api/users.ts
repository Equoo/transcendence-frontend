import { APIError, type ProblemDetail } from "../../api/problem_detail";
import type { User } from "../../users/api/users.api";

export async function fetchUsers(): Promise<User[]> {
	const res = await fetch("/api/users");

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}
	const users = (await res.json()) as User[];
	return users;
}
