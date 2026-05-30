import Dashboard from "./Dashboard";
import type { JSX } from "react";
import Sidebar from "./Sidebar/Sidebar";

function App(): JSX.Element {
	return (
		<div className="flex flex-row w-screen h-screen bg-back">
			<Sidebar></Sidebar>
			<Dashboard></Dashboard>
		</div>
	);
}

export default App;
