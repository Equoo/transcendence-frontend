	const dateString: string = new Date(msg.sentAt).toLocaleString([], {
		hour: "2-digit",
		minute: "2-digit",
		month: "short",
		day: "2-digit",
		year: "numeric",
	});

