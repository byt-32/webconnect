const express = require('express')

const Chat = require('../models/Chat.js')

const chatRoute = express.Router()

const isTrue = ([objs]) => {
	let present = true
	objs.forEach(i => {
		if (i === null || i === undefined) {
			present = false
		}	
	})
	return present
}

chatRoute.get('/fetchMessages/:friendsName/:requesterId', async (request, response) => {
	const { friendsName, requesterId } = request.params

	if (requesterId !== '' && friendsName !== '') {
		try {
			const chats = await Chat.findOne({_id: requesterId, 'chats.username': friendsName},
				{username: 1, 'chats.$': 1, starredChat: 1}
			)
			if (chats !== null) {
				response.send({
					username: chats.chats[0].username,
					messages: chats.chats[0].messages || [] ,
					starredChat: chats.chats[0].starredChat || {}
				})
			} else {
				response.send({username: friendsName, messages: [], starredChat: {}})
			}
		} catch(e) {
			e && console.log('Err' + e)
		}
	}
})

chatRoute.get('/fetchGroupChats/:token/:groupName/:groupId', async (request, response) => {
	const {token, groupName, groupId} = request.params
	const groupChats = await Chat.findOne(
		{id: token, 'groups.group.groupId': groupId, 'groups.group.groupName': groupName},
		{_id: 0, 'groups.$': 1}
	)

	if (groupChats !== null) {
		response.send({
			group: groupChats.groups[0].group,
			participants: groupChats.groups[0].participants,
			createdBy: groupChats.groups[0].createdBy,
			chats: groupChats.groups[0].messages
		})
	}
})

module.exports = chatRoute