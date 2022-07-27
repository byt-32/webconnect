const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/User.js')

const apiRoute = express.Router()

apiRoute.get('/users/:id', async (request, response) => {
	const { id } = request.params
 	const users = await User.find({_id: {$ne: id}}, {username: 1, displayName: 1, lastSeen: 1, bio: 1, joined: 1,  _id: 0})

 	response.send({users: users})
})

apiRoute.get('/profiles/:id/:username', async (request, response) => {
	const {id, username} = request.params
	
	const friend = await User.findOne({username}, {_id: 0, bio: 1, socials: 1})

	response.send({profile: {
		username,
		bio: friend.bio || '',
		socials: friend.socials.filter(i => !i.hidden)
	}})
})

module.exports =apiRoute