import {
	type RouteConfig,
	index,
	layout,
	route,
} from "@react-router/dev/routes";

export default [
	layout("routes/dashboard.tsx", [
		index("routes/home.tsx"),
		route("calendar", "routes/calendar_page.tsx"),
		route("calendar/:eventId", "routes/event_details.tsx"),
		route("knowledge", "routes/knowledge.tsx"),
		route("knowledge/:key", "routes/file_view.tsx"),
		route("messages", "routes/messages.tsx"),
	]),
	route("/register", "users/routes/register.tsx"),
	route("/login", "users/routes/login.tsx"),
	// Resources routes
	route(
		"/events/:eventId/registration",
		"events/routes/registrations.route.tsx",
	),
	route("/events", "events/routes/events.route.tsx"),
	route("/files", "files/routes/files.route.tsx"),
	route("/invitations", "invitations/routes/invitations.route.tsx"),
] satisfies RouteConfig;
