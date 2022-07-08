import express from 'express'
import User from '../models/User.js'

const apiRoute = express.Router()

apiRoute.get('/users/:id', async (request, response) => {
	const { id } = request.params
 	const users = await User.find({_id: {$ne: id}}, {username: 1, lastSeen: 1, bio: 1, joined: 1,  _id: 0})
 	response.send({users: users})
})

export default apiRoute