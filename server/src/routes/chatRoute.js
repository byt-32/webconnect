import express from 'express'
import User from '../models/Chat.js'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import Chat from '../models/Chat.js'

const chatRoute = express.Router()

chatRoute.post('/saveUnread', async (request, response) => {

})
chatRoute.get('/fetchMessages/:friendsName/:requesterId', async (request, response) => {
	const { friendsName, requesterId } = request.params
	if (requesterId !== '' && friendsName !== '') {
		try {
			const user = await Chat.findOne({_id: requesterId}, {chats: 1, _id: 0})
			// const chats = await user.chats.filter(chat => chat.username === friendsName)
			const chats = await Chat.findOne({_id: requesterId, 'chats.username': friendsName},
				{username: 1, 'chats.$': 1}
			)
			console.log()
			if (chats !== null) {
				response.send({username: chats.chats[0].username, messages: chats.chats[0].messages})
			} else {
				response.send({username: friendsName, messages: []})
			}
		} catch(e) {

		}
	}
})

export default chatRoute