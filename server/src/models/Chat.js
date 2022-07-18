import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
	_id: String,
	username: String,
	chats: [
		{
			_id: String,
			username: String,
			lastSent: Number,
			starred: Object,
			unread: Array,
			messages: Array
		}
	]
})

const Chat = mongoose.model('chat', chatSchema)
export default Chat