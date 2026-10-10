import * as signalR from '@microsoft/signalr';
import { HubConnectionState } from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useActivity } from './activity/hooks/activity.hook';
import { useActivityRealtime } from './activity/realtime/useActivityRealtime';
import { useChatRealtime } from './chat/realtime/useChatRealtime';
import { useConversationRealtime } from './friends/realtime/useConversationRealtime';

let hub: signalR.HubConnection | null = null;

export function getConnection(): signalR.HubConnection {
	hub ??= new signalR.HubConnectionBuilder()
		.withUrl('/api/', {})
		.withAutomaticReconnect()
		.build();
	//accessTokenFactory: () => getToken() 
	return hub;
}

export async function hubSend(method: string, ...args: unknown[]): Promise<void> {
	const connection = getConnection();
	if (connection.state !== HubConnectionState.Connected) { return; }
	await connection.send(method, ...args);
}

function onConnected(): void {
	const activity = useActivity.getState();
	if (!activity.selfId) { return; }
	activity.reportActivity();
	activity.askOthersActivity();
}

export function useRealtime(): void {
	const qc = useQueryClient();

	useEffect(() => {
		const connection = getConnection();
		connection.onreconnected((): void => {
			void qc.invalidateQueries();
			onConnected();
		});

		if (connection.state === HubConnectionState.Disconnected) {
			connection.start().then(onConnected).catch(console.error);
		}
	}, [qc]);

	useConversationRealtime();
	useChatRealtime();
	useActivityRealtime();
}
