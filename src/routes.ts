import {
	type RouteConfig,
	index,
	layout,
	route,
} from "@react-router/dev/routes";

export default [
	layout("routes/dashboard.tsx", [
		index("routes/home.tsx"),
		route("calendar", "routes/calendar.tsx"),
		route("knowledge", "routes/knowledge.tsx"),
		route("messages", "routes/messages.tsx"),
	]),
] satisfies RouteConfig;
