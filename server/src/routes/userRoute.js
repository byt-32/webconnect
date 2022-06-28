import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import Chat from '../models/Chat.js'
import UserSettings from '../models/UserSettings.js'

import shado from 'shado'

const userRoute = express.Router()

userRoute.post('/register', async (request, response) => {
	const login = request.body 
	console.log(login)
	const hashedPassword = await bcrypt.hash(login.password, 10)
	try {
		const foundName = await User.findOne({username: login.username})
		const foundEmail = await User.findOne({email: login.email})
		if (foundName) {
			response.send({nameError: 'This name has been taken'})
		} else if (foundEmail) {
			response.send({emailError: 'Email not valid for this account'})
		} else {
			const inserToDB = await User.create({
				username: login.username,
				email: login.email,
				password: hashedPassword,
				remember: login.remember,
				joined: Date.now(),
				chats: []
			})
			if (inserToDB) {
				response.send({
					id: inserToDB.id,
					username: inserToDB.username,
					email: inserToDB.email,
				})
			}
		}
	} catch (e) {
		if (e) {
			console.log('Catch err: ' + e)
			response.status(404).send()
		}
	}
})

userRoute.post('/login', async (request, response) => {
	const login = request.body
	try {
		const user = await User.findOne({ username: login.username })
		if (user) {
			try {
				const compare = await bcrypt.compare(login.password, user.password)
				if (compare) {
					response.send({id: user.id, username: user.username, email: user.email})

				} else {
					response.send({type: 'error'})
				}
			} catch (e) {
				e && console.log(e)
			}
		} else {
			response.send({type: 'error'})
		}
	} catch (e) {
		if (e) {
			console.log(e)
			response.status(404).send()
		}
	}
})

userRoute.post('/updateSettings', async (request, response) => {
	const {id, obj} = request.body
	if (id !== '' && id) {
		const user = await UserSettings.findOne({_id: id})
		if (user === null) {
			const saveSettings = await UserSettings.create({
				_id: id,
				settings: obj
			})
			if (saveSettings) {
				response.send(saveSettings.settings)
			}
		} else {
			const updateSettings = await UserSettings.findByIdAndUpdate(id, 
				{settings: {...user.settings, ...obj}}, {upsert: true, new: true}
			)
			response.send(updateSettings.settings)
		}
	}
})

userRoute.post('/editProfile', async (request, response) => {
	const {id, bio} = request.body
	if (id !== '' || id) {
		try {
			const update = await User.findByIdAndUpdate(id, {bio: bio}, {upsert: true, new: true})
			response.send({bio: update.bio})
		} catch (e) {
			e && console.log(e)
		}
	}
})

userRoute.post('/updatePassword', async (request, response) => {

})

userRoute.put('/updateName/:id', async (request, response) => {
	const { id } = request.params
	const {newName} = request.body
	const date = new Date().toLocaleDateString()
	const getLastUpdate = await User.findById(id, {updateNameTimestamp: 1, _id: 0})

	async function queryAndUpdate() {
		const checkName = await User.findOne({username: newName}, {_id: 0})
		if (checkName === null) {//if name has not been taken
			await User.findByIdAndUpdate(id, {updateNameTimestamp: date})
			const updateName = await User.findByIdAndUpdate(id, {username: newName}, {upsert: true, new: true})
			console.log(updateName)
			response.send({type: 'success', response: updateName.username})
		} else {//name has been taken, leave!!!
			response.send({type: 'error', response: 'This name is unavailable'})
			response.end()
		}
	}

	if (getLastUpdate.updateNameTimestamp === undefined) {//if the user has not updated his name before
		queryAndUpdate()
	} else {//oh, he has done it before
		const daysSinceLastUpdate = 
			shado.date.set(getLastUpdate.updateNameTimestamp, new Date()).getDays(true)
		if (daysSinceLastUpdate >= 30) {
			queryAndUpdate()
		} else {
			response.send({type: 'isMax', response: `You can only update your name once a month.\n Wait until ${30 - daysSinceLastUpdate} days` })
		}
	}
})

userRoute.put('/matchPassword/:id', async (request, response) => {
	const id = request.params.id
 	const user = await User.findById(id)
 	if (user) {
 		try {
 			const compare = await bcrypt.compare(request.body.value, user.password)
 			if (compare) {
 				response.send({type: 'success'})
 			} else {
 				response.send({type: 'error'})
 			}
 		} catch (e) {
 			e && console.log(e)
 		}
 	}
})
 userRoute.put('/updatePassword/:userId', async (request, response) => {
	const hashedPassword = await bcrypt.hash(request.body.value, 10)
	const user = await User.findByIdAndUpdate(request.params.userId, {password: hashedPassword})
	if (user) response.send({type: 'success'})
})

userRoute.get('/recentChats/:requesterId', async (request, response) => {
	const {requesterId} = request.params
	const recentChats = 
		await Chat.findOne({_id: requesterId}, 
			{_id: 0, 'chats.username': 1, 'chats.lastSent': 1})

	response.send(recentChats === null ? [] : recentChats)
})

userRoute.put('/updateSocials/:id', async (request, response) => {
	const {name, link} = request.body
	const {id} = request.params
	const update = await User.findByIdAndUpdate(id, { [`socials.${name}`]: link }, {upsert: true, new: true})
	response.send({link: update.socials[`${name}`], name: name})
})

export default userRoute