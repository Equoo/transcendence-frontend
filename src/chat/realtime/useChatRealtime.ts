import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getConnection } from '@/realtime';

import { type Channel, type ChannelCategory, type Message, normalizeMessage } from '../api/chat.api';
import {
	addMessage,
	removeCategory,
	removeChannel,
	removeMessage,
	updateMessage,
	upsertCategory,
	upsertChannel,
} from '../cache/chat.cache';

export function useChatRealtime(): void {
	const qc = useQueryClient();

	useEffect(() => {
		const connection = getConnection();
		const onNewMessage = (channelId: string, msg: Message): void => {
			addMessage(qc, channelId, normalizeMessage(msg));
		};
		const onUpdateMessage = (channelId: string, id: string, msg: Message): void => {
			updateMessage(qc, channelId, { ...normalizeMessage(msg), id });
		};
		const onRemoveMessage = (channelId: string, id: string): void => {
			removeMessage(qc, channelId, id);
		};

		const onUpsertChannel = (channel: Channel): void => { upsertChannel(qc, channel); };
		const onRemoveChannel = (id: string): void => { removeChannel(qc, id); };

		const onUpsertCategory = (category: ChannelCategory): void => { upsertCategory(qc, category); };
		const onRemoveCategory = (id: string): void => { removeCategory(qc, id); };

		connection.on('NewMessage', onNewMessage);
		connection.on('UpdateMessage', onUpdateMessage);
		connection.on('RemoveMessage', onRemoveMessage);
		connection.on('NewChannel', onUpsertChannel);
		connection.on('UpdateChannel', onUpsertChannel);
		connection.on('RemoveChannel', onRemoveChannel);
		connection.on('NewCategory', onUpsertCategory);
		connection.on('UpdateCategory', onUpsertCategory);
		connection.on('RemoveCategory', onRemoveCategory);

		return (): void => {
			connection.off('NewMessage', onNewMessage);
			connection.off('UpdateMessage', onUpdateMessage);
			connection.off('RemoveMessage', onRemoveMessage);
			connection.off('NewChannel', onUpsertChannel);
			connection.off('UpdateChannel', onUpsertChannel);
			connection.off('RemoveChannel', onRemoveChannel);
			connection.off('NewCategory', onUpsertCategory);
			connection.off('UpdateCategory', onUpsertCategory);
			connection.off('RemoveCategory', onRemoveCategory);
		};
	}, [qc]);
}
