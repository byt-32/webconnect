const Chat = require('../models/Chat.js')
const User = require('../models/User.js')

const validateUtil = {
	id: async function (id, callback) {
		const userId = await User.findById(id, {_id: 1})

		if (userId !== null) {
			callback(userId.id)
		} 
	}
}

const userUtil = {
	setLastSeen: async (id) => {
		await User.findOneAndUpdate({_id: id}, {lastSeen: Date.now()})
	}
}

const unreadUtil = {
	save: async function (sender, receiver, chatId) {
		await Chat.findOne({username: receiver})
		.exec((err, docs) => {
			const find = docs.chats.findIndex(i => i.username === sender)
			if (find !== -1) {
				docs.chats[find].unread.push(chatId)
			} else {

			}
			docs.save()
		})
		
	},
	reset: async function (sender, receiver) {
		// This method resets unread array and sets a message read to true
		await Chat.findOneAndUpdate(
			{username: receiver, 'chats.username': sender},
			{
				'chats.$.unread': []
			}
		)
		await Chat.findOneAndUpdate(
			{username: sender, 'chats.username': receiver},
			{
				'$set': {
					'chats.$.messages.$[message].read': true,
				},
			}, 
			{arrayFilters: [{'message.read': false}]}
		)
	}
}

const chatsUtil = {
	starConversation: async (user, friendsName, isStarred) => {
		await Chat.findOneAndUpdate({username: user, 'chats.username': friendsName,}, {
			'chats.$.isStarred': isStarred
		})
	},
	clearConversation: async (user, friendsName) => {
		await Chat.findOneAndUpdate({username: user}, {
			$pull: {
				chats: {username: friendsName}
			}
		})
	},
	save: async function (user1, user2, lastSent, message) {
		const user1Id = await User.findOne({username: user1}, {_id: 1})
		const user2Id = await User.findOne({username: user2}, {_id: 1})
		if (user1Id === null || user2Id === null) return false

		const newChatObj = {
			id: user2Id.id,
			username: user2,
			lastSent: lastSent,
			messages: [message]
		}

		await Chat.findOne({username: user1})
		.exec(async (err, docs) => {
			if (docs !== null) {
				const find = docs.chats.findIndex(i => i.username === user2)
				if (find !== -1) {
					docs.chats[find].messages.push(message)
					docs.chats[find].lastSent = lastSent
				} else {
					docs.chats.push(newChatObj)
				}
				docs.save()
			} else {
				await Chat.create({
					_id: user1Id.id,
					username: user1,
					chats: [newChatObj]
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


module.exports = {
	userUtil, chatsUtil, unreadUtil, validateUtil
}