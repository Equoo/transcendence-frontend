import { type JSX, type ReactNode, Suspense } from "react";
import { Await } from "react-router";

export default function Promisable<T>({
	skeleton,
	data,
	cached_data: cachedData,
	children,
}: {
	skeleton?: ReactNode;
	data: T | Promise<T>;
	cached_data?: T;
	children: (data: Awaited<T> | T) => ReactNode;
}): JSX.Element {
	return (
		<>
			{data instanceof Promise ? (
				<Suspense
					fallback={cachedData ? children(cachedData) : skeleton}
				>
					<Await resolve={data}>{children}</Await>
				</Suspense>
			) : (
				<>{children(data)}</>
			)}
		</>
	);
}
