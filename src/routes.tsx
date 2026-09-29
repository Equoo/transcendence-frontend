import {
	index,
	layout,
	route,
	type RouteConfig,
} from "@react-router/dev/routes";

export default [
	route("/", "routes/dashboard.tsx", [
		layout("routes/dashboard_content.tsx", [
			index("routes/home.tsx"),
			route("calendar", "routes/calendar_page.tsx"),
			route("calendar/:eventId", "routes/event_details.tsx"),
			route("knowledge", "routes/knowledge.tsx"),
			route("knowledge/:key", "routes/file_view.tsx"),
			route("messages", "routes/messages.tsx"),
			route("channels/:channelId", "routes/channel.tsx"),
			route("/admin/roles", "routes/admin_roles.tsx"),
			route("/admin/users", "routes/admin_users.tsx"),
		]),
	]),
	route("/register", "users/routes/register.tsx"),
	route("/login", "users/routes/login.tsx"),
	// Resources routes
	route(
		"/events/:eventId/registration",
		"events/routes/registrations.route.tsx",
	),
	route("/events/:eventId?", "events/routes/events.route.tsx"),
	route("/files/:key?", "files/routes/files.route.tsx"),
	route("/invitations/:id?", "invitations/routes/invitations.route.tsx"),
	route("/channels", "chat/routes/channel.route.tsx"),

	route("/roles", "admin/routes/admin.role.route.tsx"),
	route("/roles/check", "admin/routes/admin.role.route.check.tsx"),
	route("/users", "admin/routes/admin.user.route.tsx"),
	route("/users/disconnect", "admin/routes/admin.user.routeDisconnect.tsx"),
	route("/me/:action", "users/routes/me.ts"),
] satisfies RouteConfig;
