import Chat from '../models/Chat.js'
import User from '../models/User.js'

export function saveUnread(argument) {
	
}

export async function saveChats(chat) {
	const {sentTo, sentBy, lastSent, message} = chat
	const receiver = await User.findOne({username: sentTo}, {_id: 1})
	const sender = await User.findOne({username: sentBy}, {_id: 1})

	async function save(username1, id1, username2, id2) {
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
