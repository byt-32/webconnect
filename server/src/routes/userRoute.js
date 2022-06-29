import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import Chat from '../models/Chat.js'
import UserSettings from '../models/UserSettings.js'
import UserPrivacy from '../models/UserPrivacy.js'

import shado from 'shado'

const userRoute = express.Router()

userRoute.post('/register', async (request, response) => {
	const login = request.body 
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
		if (daysSinceLastUpdate >= 60) {
			queryAndUpdate()
		} else {
			response.send({type: 'isMax', response: `You can only update your name once in 2 months.\n Wait until ${60 - daysSinceLastUpdate} days` })
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



userRoute.put('/updateSocials/:id', async (request, response) => {
	const {name, link} = request.body
	const {id} = request.params
	const find = await User.findOne({_id: id}, {_id: 0, socials: 1})
	const index = find.socials.findIndex(i => i.name === name)

	if (index !== -1) {
		find.socials[index] = {name, link}
		const update = await User.findByIdAndUpdate(id, {socials: find.socials}, {upsert: true, new: true})
		response.send(update.socials)
	} else {
		find.socials.push({link, name})
		const update = await User.findByIdAndUpdate(id, {socials: find.socials}, {upsert: true, new: true})
		response.send(update.socials)
	}
})

userRoute.put('/updatePrivacy/:id', async (request, response) => {
	const {id} = request.params
	const obj = request.body
	const update = await UserPrivacy.findById(id, {_id: 0, privacy: 1})
	if (update !== null) {
		const updateExisting = await UserPrivacy.findByIdAndUpdate(id, {privacy: {...update.privacy, ...obj}})
		// console.log(updateExisting)
		response.send(updateExisting.privacy)
	} else {
		const newUpdate = await UserPrivacy.create({
			_id: id,
			privacy: obj
		})
		// console.log(newUpdate)

		response.send(newUpdate.privacy)
	}
})


userRoute.delete('/deleteSocial/:id', async (request, response) => {
	const {id} = request.params
	const {name, link} = request.body
	const find = await User.findOne({_id: id}, {_id: 0, socials: 1})
	const index = find.socials.findIndex(i => i.name === name)
	find.socials.splice(index, 1)

	const update = await User.findByIdAndUpdate(id, {socials: find.socials}, {upsert: true, new: true})
	response.send(update.socials)
})


userRoute.get('/recentChats/:id', async (request, response) => {
	const {id} = request.params
	const recentChats = 
		await Chat.findOne({_id: id}, 
			{_id: 0, 'chats.username': 1, 'chats.lastSent': 1})

	response.send(recentChats === null ? [] : recentChats)
})

userRoute.get('/accountData/:id', async (request, response) => {
	const {id} = request.params
	const user = await User.findById(id, {_id: 0, socials: 1, bio: 1})
	response.send(user)
})

export default userRoute