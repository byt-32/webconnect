const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
	_id: String,
	username: String,
	groups: [
		{	
			chatType: {type: String, default: 'group'},
			isStarred: {
				value: {type: Boolean, default: false},
				date: {type: Number}
			},
			group: {
				groupName: {type: String},
				groupId: {type: String, index: {unique: true}},
				created: {type: Date}
			},
			createdBy: {
				username: { type: String}
			},
			lastSent: {type: Number},
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
			chatType: {type: String, default: 'user'},
			lastSent: Number,
			unread: Array,
			messages: Array
		}
	]
})

const Chat = mongoose.model('chat', chatSchema)
module.exports = Chat
