import express from 'express'
import { v4 as uuidv4 } from 'uuid'

import Chat from '../models/Chat.js'
import UnreadCount from '../models/UnreadCount.js'

const chatRoute = express.Router()

chatRoute.get('/fetchMessages/:friendsName/:requesterId', async (request, response) => {
	const { friendsName, requesterId } = request.params

	await UnreadCount.findOneAndUpdate({_id: requesterId, 'users.username': friendsName}, {'users.$.unreadArray': []})

	if (requesterId !== '' && friendsName !== '') {
		try {
			const user = await Chat.findOne({_id: requesterId}, {chats: 1, _id: 0})

			const chats = await Chat.findOne({_id: requesterId, 'chats.username': friendsName},
				{username: 1, 'chats.$': 1}
			)
			if (chats !== null) {
				response.send({username: chats.chats[0].username, messages: chats.chats[0].messages})
			} else {
				response.send({username: friendsName, messages: []})
			}
		} catch(e) {
			e && console.log('Err' + e)
		}
	}
})

export default chatRoute