import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import type { ClientOnErrorFunction } from "react-router";
import { HydratedRouter } from "react-router/dom";

const onError: ClientOnErrorFunction = (error, { errorInfo }) => {
	console.error(error, errorInfo);
};

startTransition(() => {
	hydrateRoot(
		document,
		<StrictMode>
			<HydratedRouter onError={onError} />
		</StrictMode>,
	);
});
