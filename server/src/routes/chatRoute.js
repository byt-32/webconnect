import express from 'express'
import { v4 as uuidv4 } from 'uuid'

import Chat from '../models/Chat.js'

const chatRoute = express.Router()

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

export default chatRoute