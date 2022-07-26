const mongoose = require('mongoose')

const unreadCountSchema = new mongoose.Schema({
	_id: String,
	username: String,
	users: [
		{
			_id: String,
			username: String,
			unreadArray: Array
		}
	]
})

const UnreadCount = mongoose.model('unreadCount', unreadCountSchema)
module.exports = UnreadCount
