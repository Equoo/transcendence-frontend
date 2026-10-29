import { createContext, use } from "react";

import type { User } from "../api/users";

export const UserReactContext = createContext<User | null>(null);
UserReactContext.displayName = "UserReactContext";

export function useUser(): User | null {
	return use(UserReactContext);
}

export function resolveUser(user: User, me: User | null): User {
	return me?.id === user.id ? me : user;
}

export function useResolvedUser(user: User): User {
	return resolveUser(user, useUser());
}

export function useResolvedUserNull(user?: User): User | null {
	const me = useUser();
	if (!user) { return null; }
	return resolveUser(user, me);
}
