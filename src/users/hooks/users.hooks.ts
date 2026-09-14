import { createContext, use } from "react";

import type { User } from "../api/users.api";

export const UserReactContext = createContext<User | null>(null);
UserReactContext.displayName = "UserReactContext";

export function useUser(): User | null {
	return use(UserReactContext);
}
