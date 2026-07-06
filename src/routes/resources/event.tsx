import type { Route } from "./+types/event";
import { toast } from "react-toastify";
import { createEvent, type EventActionResult } from "../../models/events";
import Alert from "../../components/Alert";

export async function clientAction({
	request,
}: Route.ClientActionArgs): Promise<EventActionResult> {
	const res = await createEvent(await request.formData());

	
	if (!res.ok) {
		toast.error(Alert, { data: { ...res.error } });
		return res;
	}
	toast.success(Alert, {
		data: { title: "Event successfully created" },
	});
	return res;
}
