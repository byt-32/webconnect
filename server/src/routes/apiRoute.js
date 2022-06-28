import express from 'express'
import User from '../models/User.js'

const apiRoute = express.Router()

apiRoute.get('/users/:requesterId', async (request, response) => {
	const { requesterId } = request.params
 	const users = await User.find({_id: {$ne: requesterId}}, {username: 1,  _id: 0})
 	// console.log(users)
 	response.send({users: users})
})

export default apiRoute