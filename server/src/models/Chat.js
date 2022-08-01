const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
	_id: String,
	username: String,
	groups: [
		{	
			chatType: {type: String, default: 'group'},
			group: {
				isStarred: {
					value: {type: Boolean, default: false},
					date: {type: Number}
				},
				groupName: {type: String},
				groupId: {type: String, index: {unique: true}},
				created: {type: Date}
			},
			createdBy: {
				username: { type: String}
			},
			participants: [],
			messages: []
		}
	],
	chats: [
		{
			_id: String,
			username: String,
			isStarred: {
				value: {type: Boolean, default: false},
				date: {type: Number}
			},
			lastSent: Number,
			unread: Array,
			messages: Array
		}
	]
})

const Chat = mongoose.model('chat', chatSchema)
module.exports = Chat
