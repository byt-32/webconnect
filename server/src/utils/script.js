import Chat from '../models/Chat.js'
import User from '../models/User.js'

export const unreadUtil = {
	save: async function (sentTo, sentBy, chatId) {
		await Chat.findOneAndUpdate(
			{username: sentBy, 'chats.username': sentTo},
			{
				$push: {
					'chats.$.unread': chatId,
				}
			},
			{upsert: true}
		)
	},
	reset: async function (sentBy, sentTo) {
		await Chat.findOneAndUpdate(
			{username: sentBy, 'chats.username': sentTo},
			{
				'$set': {
					'chats.$.messages.$[message].read': true,
					'chats.$.$[unread]': [],
				}
			}, 
			{arrayFilters: [{'message.read': false}]}
		)
	}
}

export const chatsUtil = {
	save: async function ({sentBy, sentTo, lastSent, message}) {
		const receiver = await User.findOne({username: sentTo}, {_id: 1})
		const sender = await User.findOne({username: sentBy}, {_id: 1})

		await Chat.findOne({username: sentBy})
		.exec(async (err, docs) => {
			if (docs !== null) {
				const find = docs.chats.findIndex(i => i.username === sentTo)
				if (find > -1) {
					docs.chats[find].messages.push(message)
					docs.chats[find].lastSent = lastSent
				}
				docs.save()
			} else {
				await Chat.create({
					_id: sender.id,
					username: sentBy,
					chats: [{
						id: receiver.id,
						username: sentTo,
						lastSent: lastSent,
						messages: [message]
					}]
				})
			}
		})

		await Chat.findOne({username: sentTo})
		.exec(async (err, docs) => {
			if (docs !== null) {
				const find = docs.chats.findIndex(i => i.username === sentBy)
				if (find > -1) {
					docs.chats[find].messages.push(message)
					docs.chats[find].lastSent = lastSent
				}
				docs.save()
			} else {
				await Chat.create({
					_id: receiver.id,
					username: sentTo,
					chats: [{
						id: sender.id,
						username: sentBy,
						lastSent: lastSent,
						messages: [message]
					}]
				})
			}
		})
	},
	deleteForAll: async function ({deletedBy, friendsName, chat}) {
		await Chat.findOneAndUpdate(
			{username: friendsName, 'chats.username': deletedBy},
			{
				$pull: {
					'chats.$.messages': {chatId: chat.chatId},
				},
			}
		)

		await Chat.findOneAndUpdate(
			{username: deletedBy, 'chats.username': friendsName},
			{
				$pull: {
					'chats.$.messages': {chatId: chat.chatId},
				},
			}
		)

		await Chat.findOneAndUpdate(
			{username: deletedBy, 'chats.username': friendsName},
			{'$set': {'chats.$.messages.$[message].reply.message': ''}}, 
			{arrayFilters: [{'message.reply.chatId': chat.chatId}]}
		)
		await Chat.findOneAndUpdate(
			{username: friendsName, 'chats.username': deletedBy},
			{'$set': {'chats.$.messages.$[message].reply.message': ''}}, 
			{arrayFilters: [{'message.reply.chatId': chat.chatId}]}
		)
	},
	deleteForOne: async function ({friendsName, deletedBy, chat}) {
		await Chat.findOneAndUpdate(
			{username: deletedBy, 'chats.username': friendsName},
			{
				$pull: {
					'chats.$.messages': {chatId: chat.chatId},
				},
			},
		)
		await Chat.findOneAndUpdate(
			{username: deletedBy, 'chats.username': friendsName},
			{'$set': {'chats.$.messages.$[message].reply.message': ''}}, 
			{arrayFilters: [{'message.reply.chatId': chat.chatId}]}
		)
	}
}
