
function MessageDaySeparator({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex items-center gap-[14px] text-[12px] font-semibold text-muted">
			<span className="h-px flex-1 bg-border" />
			{children}
			<span className="h-px flex-1 bg-border" />
		</div>
	);
}

export default MessageDaySeparator;
