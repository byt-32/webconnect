import 'dotenv/config'
import express from 'express'
import bcrypt from 'bcrypt'

import apiRoute from './routes/apiRoute.js'
import userRoute from './routes/userRoute.js'
import chatRoute from './routes/chatRoute.js'
import {saveChats, saveUnread, handleStarredChat, unstarChat, deleteChat, updateLastSeen} from './utils/script.js'

import UnreadCount from './models/UnreadCount.js'
import Chat from './models/Chat.js'

import mongoose from 'mongoose'

import { createServer } from 'http'
import { Server } from 'socket.io'

const port = process.env.PORT || 3001;
let connectedClients = [], onlineUsers = []

const db = mongoose.connection
mongoose.connect( process.env.LOCALURI , {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
db.once('open', () => {
	console.log('DB connected')
})

let app = express()
app.use(express.json())

app.use('/user/', userRoute)
app.use('/api/', apiRoute)
app.use('/chat/', chatRoute)

const server = createServer(app)
const io = new Server(server, {

})

/** ----- READ THIS ---------
NEVER EMIT OR BROADCAST A USER, WITH TOKEN INCLUDED,
 ONLY THE NAME AND SOCKETID IS NEEDED. 
 THAT EXPLAINS THE DIFFERENCE BTW ConnectedClients & OnlineUsers VARS ABOVE

 N/B: ConnectedClients VAR STORES AN ONLINE USER WITH TOKEN INCLUDED
 WHILE OnlineUsers VAR STORES AN ONLINE USER WITHOUT THE TOKEN

 DONT FOWARD/EMIT/BROADCAST A USER FROM ConnectedClients VAR
 **/

io.use((socket, next) => {
	const {token, username} = socket.handshake.auth
	const find = connectedClients.findIndex(i => i.token === token)
	if (find === -1) {
		connectedClients.push({token, username})
	} else {
		connectedClients.splice(find, 1)
		connectedClients.push({token, username})
	}
	socket.username = username
	socket.token = token
	next()
})

io.on('connection', socket => {
	for (let [id, socket] of io.of('/').sockets) {
		let find = connectedClients.findIndex(i => i.token === socket.token)
		let index = onlineUsers.findIndex(i => i.username === socket.username)

		if (find !== -1) {
			connectedClients[find].socketId = id
		}

		if (index === -1) {
			onlineUsers.push({socketId: id, username: socket.username})
		} else {
			onlineUsers[index] = {socketId: id, username: socket.username}
		}
	}

	socket.on('getOnileUsers', () => {
		io.emit('onlineUsers', onlineUsers)
	})

	

	socket.on('disconnect', async reason => {
		onlineUsers = onlineUsers.filter(user => user.username !== socket.username)
		connectedClients = connectedClients.filter(user => user.token !== socket.token)

		socket.broadcast.emit('userDisconnect', {username: socket.username, socketId: socket.id})

		updateLastSeen(socket.token)
	})

	socket.on('saveUnread', (sentBy, sentTo, chatId) => {
		saveUnread(sentBy, sentTo, chatId)
	})

	socket.on('chatIsRead', async (sender, receiver) => {
		const find = onlineUsers.find(i => i.username === sender)
		if (find !== undefined) {
			io.to(find.socketId).emit('chatHasBeenRead', sender, receiver)
		}

		await Chat.findOneAndUpdate(
			{username: sender, 'chats.username': receiver},
			{'$set': {'chats.$.messages.$[message].read': true}}, 
			{arrayFilters: [{'message.read': false}]}
		)

		await UnreadCount.findOneAndUpdate({username: receiver, 'users.username': sender}, {'users.$.unreadArray': []})
	})
	socket.on('starredChat', (obj) => {
		const {starredBy, friendsName, starredChat} = obj
		const find = onlineUsers.find(i => i.username === friendsName)
		if (find !== undefined) {
			io.to(find.socketId).emit('starredChat', starredBy, starredChat)
		}
		handleStarredChat(obj)
	})

	socket.on('unstarChat', obj => unstarChat(obj))

	socket.on('deleteChat', obj => {
		const {deletedBy, friendsName, chat} = obj
		const find = onlineUsers.find(i => i.username === friendsName)

		if (find !== undefined) {
			io.to(find.socketId).emit('deleteChat', {friendsName: deletedBy, chat})
		}

		deleteChat(obj)
	})

	socket.on('userIsTyping', obj => {
		const {selectedUser, user, typing} = obj
		const find = onlineUsers.find(i => i.username === selectedUser)
		if (find !== undefined) {
			io.to(find.socketId).emit('userIsTyping', {user, typing})
		}
	})

	socket.on('sentChat', chat => {
		const {sentTo, sentBy, message} = chat
		const find = onlineUsers.find(i => i.username === sentTo)

		saveChats(chat)

		if (find !== undefined) {
			//it means the user is currently online, forward to socket
			io.to(find.socketId).emit('chatFromUser', {sentBy, message})

		} else {
			saveUnread(sentBy, sentTo, chat.message.chatId)
		}
	})
})


app.use(express.static('./webconnect_build/dist'))

server.listen(port, () => console.log('webconnect running on port ' + port))