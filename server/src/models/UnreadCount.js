import mongoose from 'mongoose'

const unreadCountSchema = new mongoose.Schema({
	_id: String,
	username: String,
	users: [
		{
			_id: String,
			username: String,
			count: Number
		}
	]
})

const UnreadCount = mongoose.model('unreadCount', unreadCountSchema)
export default unreadCount
