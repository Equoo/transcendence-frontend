import {
	type RouteConfig,
	index,
	layout,
	route,
} from "@react-router/dev/routes";

export default [
	layout("users/routes/auth.tsx", [
		route("/register", "users/routes/register.tsx"),
		route("/login", "users/routes/login.tsx"),
	]),
	layout("routes/dashboard.tsx", [
		index("routes/home.tsx"),
		route("calendar", "routes/calendar.tsx"),
		route("calendar/:eventId", "routes/event_details.tsx"),
		route("knowledge", "routes/knowledge.tsx"),
		route("messages", "routes/messages.tsx"),
	]),
	// Resources routes
	route(
		"/events/:eventId/registration",
		"events/routes/registrations.route.tsx",
	),
	route("/events", "events/routes/events.route.tsx"),
	route("/events/roles", "events/routes/event_roles.route.tsx"),
] satisfies RouteConfig;
