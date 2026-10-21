import { format } from "date-fns";

export function toInputValue(date: Date): string {
	return format(date, "yyyy-MM-dd'T'HH:mm");
}
