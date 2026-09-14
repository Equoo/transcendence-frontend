import { type JSX, type ReactNode,Suspense } from "react";
import { Await } from "react-router";

export default function Promisable<T>({
	skeleton,
	data,
	children,
}: {
	skeleton?: ReactNode;
	data: T | Promise<T>;
	children: (data: Awaited<T> | T) => ReactNode;
}): JSX.Element {
	return (
		<Suspense fallback={skeleton}>
			{data instanceof Promise ? (
				<Await resolve={data}>{children}</Await>
			) : (
				<>{children(data)}</>
			)}
		</Suspense>
	);
}
