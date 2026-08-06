import type { JSX } from "react/jsx-runtime";
import type { Role } from "../api/roles";

export default function ListRoles({ role }: { role: Role }): JSX.Element {
	return <h1>{role.name}</h1>;
}
