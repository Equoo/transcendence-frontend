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
		route("channels/:channelId", "routes/channel.tsx"),
	]),
	// Resources routes
	route("/events/:eventId/registration", "routes/resources/registration.tsx"),
	route("/events", "routes/resources/event.tsx"),
	route("/channels", "routes/resources/channel.tsx"),
	route("/channels/:channelId/messages", "routes/resources/message.tsx"),
] satisfies RouteConfig;
