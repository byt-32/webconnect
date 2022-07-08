import Chat from '../models/Chat.js'
import User from '../models/User.js'
import UnreadCount from '../models/UnreadCount.js'

export async function saveUnread(sentBy, sentTo, chatId) {
	const receiver = await User.findOne({username: sentTo}, {_id: 1})
	const sender = await User.findOne({username: sentBy}, {_id: 1})

 	let unread = await UnreadCount.findOne({username: sentTo}, {_id: 0, users: 1})
	if (unread !== null) {
		const findUser = unread.users.findIndex(i => i.username === sentBy)
		if (findUser !== -1) {
			unread.users[findUser].unreadArray.push(chatId)
 			await UnreadCount.findByIdAndUpdate(receiver.id, {users: unread.users})
		} else {
			unread.users.push({
				_id: sender.id,
				username: sentBy,
				unreadArray: [chatId]
			})
 			await UnreadCount.findByIdAndUpdate(receiver.id, {users: unread.users})
		}
	} else {
		await UnreadCount.create({
			_id: receiver.id,
			username: sentTo,
			users: [{
				_id: sender.id,
				username: sentBy,
				unreadArray: [chatId]
			}]
		})
	}

}

export async function saveChats(chat) {
	const {sentTo, sentBy, lastSent, message} = chat
	const receiver = await User.findOne({username: sentTo}, {_id: 1})
	const sender = await User.findOne({username: sentBy}, {_id: 1})

	async function save(username1, id1, username2, id2) {//refactor using standard mongoose queries
		const findUser = await Chat.findById(id1)
		if (findUser !== null) {
			const chatIndex = findUser.chats.findIndex(i => i.username === username2)
			if (chatIndex !== -1) {
				findUser.chats[chatIndex].lastSent = lastSent
				findUser.chats[chatIndex].messages.push(message)
				await Chat.findByIdAndUpdate(id1 , {chats: findUser.chats})
			} else {
				findUser.chats.push({
					id: id2,
					username: username2,
					lastSent: lastSent,
					messages: [message]
				})
				await Chat.findByIdAndUpdate(id1, {chats: findUser.chats})
			}
		} else {
			await Chat.create({
				_id: id1,
				username: username1,
				chats: [{
					id: id2,
					username: username2,
					lastSent: lastSent,
					messages: [message]
				}]
			})
		}
	}

	/**save to senders database **/
	save(sentBy, sender.id, sentTo, receiver.id)

	/** save to receiver's database too **/
	save(sentTo, receiver.id, sentBy, sender.id)

}

export async function handleStarredChat(obj) {
	const {starredBy, friendsName, starredChat} = obj
	await Chat.findOneAndUpdate(
		{username: starredBy, 'chats.username': friendsName},
		{'$set': {'chats.$.starredChat': starredChat}}, 
	)
	await Chat.findOneAndUpdate(
		{username: friendsName, 'chats.username': starredBy},
		{'$set': {'chats.$.starredChat': starredChat}}, 
	)
}

export async function unstarChat(obj) {
	const {starredBy, friendsName, starredChat} = obj
	await Chat.findOneAndUpdate(
		{username: starredBy, 'chats.username': friendsName},
		{'$set': {'chats.$.starredChat': starredChat}}, 
	)
}

export async function deleteChat(obj) {
	/*** READ THIS 
		YOU CANT DELETE A FRIENDS CHAT FROM THEIR DATABASE, 
		TEST CASE 1: DELETING A RECEIVED CHAT MODIFIES 
		THE RECEIVER DATABASE NOT THE SENDER'S, 

		TEST CASE 2: DELETING A SENT CHAT() MODIFES BOTH THE USER'S DATABASE
		AND THE SENDERS'
	*/
	const {deletedBy, friendsName, chat} = obj

	/** DELETE A STARRED CHAT TOO **/
	await Chat.findOneAndUpdate(
		{username: deletedBy, 'chats.username': friendsName},
		{'$set': {'chats.$.starredChat': {}}}, 
		{arrayFilters: [{'starredChat.chatId': chat.chatId}]}
	)

	await UnreadCount.findOneAndUpdate(
		{username: chat.sentTo, 'users.username': chat.sentBy}, 
		{
			$pull: {
				'users.$.unreadArray': chat.chatId,
			}
		}
	)

	async function performDelete(user1, user2) {
		await Chat.findOneAndUpdate(
			{username: user1, 'chats.username': user2},
			{
				$pull: {
					'chats.$.messages': {chatId: chat.chatId},
				}
			}
		)
		await Chat.findOneAndUpdate(
			{username: user1, 'chats.username': user2},
			{'$set': {'chats.$.messages.$[message].reply.message': ''}}, 
			{arrayFilters: [{'message.reply.chatId': chat.chatId}]}
		)
	}

	if (deletedBy === chat.sentBy) {
		/** 
			
		**/
		performDelete(friendsName, deletedBy)
		performDelete(deletedBy, friendsName)
	} else {
		performDelete(deletedBy, friendsName) // Delete for only deletedBy
	}
	
}

export async function updateLastSeen(id) {
	await User.findByIdAndUpdate(id, {lastSeen: new Date()})
}