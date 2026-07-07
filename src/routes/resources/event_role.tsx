import { toast } from "react-toastify";
import Alert from "../../components/Alert";
import { fetchEventRoles } from "../../api/event_roles";
import { data } from "react-router";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientLoader() {
	const res = await fetchEventRoles();

	if (!res.ok) {
		toast.error(Alert, { data: { ...res.error } });
		throw new Error("Can't fetch Event Roles");
	}
	return data(res.roles);
}
