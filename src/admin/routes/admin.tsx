import type { JSX } from "react/jsx-runtime";
import AdminBox from "../components/checkbox";

export default function Admin(): JSX.Element {
	return (
		<div>
			<form>
				<input type="text" name="name"></input>
				<AdminBox name="isAdmin"></AdminBox>
			</form>
		</div>
	);
}
