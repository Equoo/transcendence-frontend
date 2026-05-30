import { type JSX, useState } from "react";
import { API_PATH } from "./constants";
import Dashboard from "./Dashboard";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "./Sidebar/Sidebar";

function App(): JSX.Element {
	const { isPending, error, data } = useQuery({
		queryKey: ["testApi"],
		queryFn: async (): Promise<string> =>
			fetch(API_PATH).then(async (res) => res.text()),
	});

	return (
		<div className="flex flex-row w-screen h-screen bg-back">
			<Sidebar></Sidebar>
			<Dashboard></Dashboard>
		</div>
	);
}

export default App;
