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
		route("calendar/:eventId", "routes/event_details.tsx"),
		route("knowledge", "routes/knowledge.tsx"),
		route("messages", "routes/messages.tsx"),
	]),
	route("/register", "routes/register.tsx"),
	route("/login", "routes/login.tsx"),
	// Resources routes
	route(
		"/events/:eventId/registration",
		"events/routes/registrations.route.tsx",
	),
	route("/events", "events/routes/events.route.tsx"),
	route("/events/roles", "events/routes/event_roles.route.tsx"),
] satisfies RouteConfig;
