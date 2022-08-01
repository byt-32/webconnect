const express = require('express')
const bcrypt = require('bcrypt')

const User = require('../models/User.js')
const Chat = require('../models/Chat.js')

const UserSettings = require('../models/UserSettings.js')

const shado = require('shado')

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
				socials: [{
					name: 'email',
					link: login.email,
					hidden: true
				}],
				password: hashedPassword,
				remember: login.remember,
				joined: Date.now(),
				chats: []
			})
			if (inserToDB) {
				response.send({
					id: inserToDB.id,
					username: inserToDB.username,
					socials: inserToDB.socials,
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
					response.send({id: user.id, username: user.username})

				} else {
					response.send({type: 'error'})
				}
			} catch (e) {
				e && console.log('Err' + e)
			}
		} else {
			response.send({type: 'error'})
		}
	} catch (e) {
		if (e) {
			console.log('Err' + e)
			response.status(404).send()
		}
	}
})

// userRoute.put('*', (req, res, next) => {
// 	// const params = req.params
// 	console.log(req)
// })

userRoute.put('/updateSettings/:id', async (request, response) => {
	const {id} = request.params
	const {obj} = request.body
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
				{settings: {...user.settings, ...obj}}, { new: true}
			)
			response.send(updateSettings.settings)
		}
	}
})

userRoute.put('/saveProfileInfo/:id', async (request, response) => {
	const info = request.body
	const id = request.params.id
	// const getLastUpdate = await User.findById(id, {updateNameTimestamp: 1, _id: 0})


	// if (getLastUpdate.updateNameTimestamp === undefined || getLastUpdate.updateNameTimestamp === null) {
	// 	let {displayName} = await User.findOneAndUpdate(id, {
	// 		displayName
	// 	},{upsert: true, new: true})
	// 	updated = {...updated, displayName}
	// } else {
	// 	const daysSinceLastUpdate = 
	// 		shado.date.set(getLastUpdate.updateNameTimestamp, new Date()).getDays(true)

	// 	if (daysSinceLastUpdate >= 60) {
	// 		let {displayName} = await User.findByIdAndUpdate(id, {
	// 			displayName
	// 		}, {upsert: true, new: true})
	// 		updated = {...updated, displayName}
	// 	}
	// }

	let {displayName, bio} = await User.findByIdAndUpdate(id, {
		bio: info.bio, displayName: info.displayName
	}, {upsert: true, new: true})
	response.send({displayName, bio})
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
 userRoute.put('/updatePassword/:id', async (request, response) => {
	const hashedPassword = await bcrypt.hash(request.body.value, 10)
	const user = await User.findByIdAndUpdate(request.params.id, {password: hashedPassword})
	if (user) response.send({type: 'success'})
})



userRoute.put('/updateSocials/:id', async (request, response) => {
	const social = request.body
	const {id} = request.params

	const saved = await User.findOne({_id: id}, {_id:0, socials: 1})
	const index = saved.socials.findIndex(i => i.name === social.name)
	// const saved
	let update

	if (index === -1) {
		 update = await User.findOneAndUpdate(
			{_id: id},
			{$push: {'socials': social}}, 
		)
	} else {
		update = await User.findOneAndUpdate(
			{_id: id},
			{'$set': {'socials.$[social]': social}}, 
			{arrayFilters: [{'social.name': social.name}]},
		)
	}
	// response.send(update.socials)
})


userRoute.delete('/deleteSocial/:id', async (request, response) => {
	const {id} = request.params
	const social = request.body

	await User.findByIdAndUpdate(id, 
		{
			$pull: {socials: {name: social.name}}
		}
	)	

})


userRoute.get('/recentChats/:id', async (request, response) => {
	const {id} = request.params
	const recentChats = 
		await Chat.findOne({_id: id}, 
			{
				_id: 0,
				'groups.group': 1,
				'groups.chatType': 1,
				'groups.messages': {$slice: -1},
				'chats.username': 1, 
				'chats.displayName': 1,
				'chats.lastSent': 1, 
				'chats.unread': 1,
				'chats.isStarred': 1,
				'chats.messages': {$slice: -1}, 
			}) || []

		// console.log(recentChats)
	response.send({
		recentChats: recentChats || [],
	})
})

userRoute.get('/accountData/:id', async (request, response) => {
	const {id} = request.params
	const user = await User.findById(id, {_id: 0, socials: 1, bio: 1, displayName: 1, updateNameTimestamp: 1})
	response.send(user)
})

module.exports = userRoute