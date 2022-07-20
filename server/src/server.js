import 'dotenv/config'
import express from 'express'
import bcrypt from 'bcrypt'

import apiRoute from './routes/apiRoute.js'
import userRoute from './routes/userRoute.js'
import chatRoute from './routes/chatRoute.js'
import {
	chatsUtil,
	unreadUtil,
	validateUtil,
} from './utils/script.js'

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

const error = (msg) => {
	throw new Error(msg)
}

const search = (arr, testCase, str, callback) => {
	if (!arr || !testCase || !str) error('expected 3 arguments')
	if (!Array.isArray(arr)) error('first argument must be an array')

	const result = arr.find(i => i[`${testCase}`] === str)
	const index = arr.findIndex(i => i[`${testCase}`] === str)

	callback({result, index})
}


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

	validateUtil.id(token, (id) => {
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

})

io.on('connection', socket => {
	for (let [id, socket] of io.of('/').sockets) {

		search(onlineUsers, 'token', socket.token, ({result, index}) => {
			if (index > -1) {
				onlineUsers[index] = {socketId: id, username: socket.username}
			} else {
				onlineUsers.push({socketId: id, username: socket.username})
			}
		})
	}

	socket.on('getOnileUsers', () => {
		io.emit('onlineUsers', onlineUsers)
	})

	socket.on('disconnect', async reason => {
		onlineUsers = onlineUsers.filter(user => user.username !== socket.username)
		connectedClients = connectedClients.filter(user => user.token !== socket.token)

		socket.broadcast.emit('userDisconnect', {username: socket.username, socketId: socket.id})

		// updateLastSeen(socket.token)
	})


	socket.on('saveUnread', (sender, receiver, chatId) => {
		unreadUtil.save(sender, receiver, chatId)
	})


	socket.on('chatIsRead', async (sender, receiver) => {
		search(onlineUsers, 'username', sender, ({result, index}) => {
			result && io.to(result.socketId).emit('chatHasBeenRead', sender, receiver)
		})

		unreadUtil.reset(sender, receiver)

	})


	socket.on('starredChat', (obj) => {
		const {starredBy, friendsName, starredChat} = obj

		search(onlineUsers, 'username', friendsName, ({result, index}) => {
			result && io.to(result.socketId).emit('starredChat', starredBy, starredChat)
		})

		// handleStarredChat(obj)
	})


	socket.on('unstarChat', obj => unstarChat(obj))


	socket.on('deleteChat', obj => {
		const {deletedBy, friendsName, chat} = obj

		search(onlineUsers, 'username', friendsName, ({result, index}) => {

			if (chat.sender === deletedBy) {
				chatsUtil.deleteForAll(obj)
				result && io.to(result.socketId).emit('deleteChat', {friendsName: deletedBy, chat})
			} else {
				chatsUtil.deleteForOne(obj)
			}
			
		})
		
	})

	socket.on('userIsTyping', obj => {
		const {selectedUser, user, typing} = obj

		search(onlineUsers, 'username', selectedUser, ({result, index}) => {
			result && io.to(result.socketId).emit('userIsTyping', {user, typing})
		})
	})



	socket.on('sentChat', chat => {
		const {receiver, sender,lastSent, message } = chat

		chatsUtil.save(sender, receiver, lastSent, message)
		chatsUtil.save(receiver, sender, lastSent, message)

		search(onlineUsers, 'username', receiver, ({result, index}) => {
			if (result) {// user is online
				io.to(result.socketId).emit('chatFromUser', {sender, message})
			} else {// user is currently offline
				unreadUtil.save(sender, receiver, chat.message.chatId)
			}
		})
	})
})


app.use(express.static('./webconnect_build/dist'))

app.get('/', (req, res) => {
	res.sendFile(__dirname, + 'webconnect_build/dist/index.html')
})

server.listen(port, () => console.log('webconnect running on port ' + port))