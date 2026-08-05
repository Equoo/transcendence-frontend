import type { JSX } from "react";
import AdminBox from "../components/checkbox";
import { useFetcher, type ClientActionFunctionArgs } from "react-router";

export async function createRole({ data }: { data: formData }): Promise<null> {
	const res = await fetch("/role", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		console.warn("LE TRUC DE MERDE IL A FAIL");
		return null;
	}
	console.warn("CA A RESUSSSIS !!!");
	return null;
}

export async function clientLoader({
	request,
}: ClientActionFunctionArgs): Promise<null> {
	const res = createRole(await request.formData());
	return res;
}

export default function Admin(): JSX.Element {
	const fetcher = useFetcher();

	return (
		<div className="flex justify-center items-center w-full h-full">
			<fetcher.Form className="flex flex-col gap-6" method="post">
				<h1 className="text-3xl">Create Roles</h1>
				<input type="text" name="name"></input>
				<AdminBox name="isAdmin"></AdminBox>
				<AdminBox name="isAdmin"></AdminBox>
				<AdminBox name="isAdmin"></AdminBox>
				<AdminBox name="isAdmin"></AdminBox>
				<AdminBox name="isAdmin"></AdminBox>
				<button type="submit" className="border-2 w-1/2">
					Create
				</button>
			</fetcher.Form>
		</div>
	);
}
