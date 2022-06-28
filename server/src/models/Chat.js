import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
	_id: String,
	username: String,
	chats: Array
})

const Chat = mongoose.model('chat', chatSchema)
export default Chat