import 'dotenv/config'
import express from 'express'
import bcrypt from 'bcrypt'
import apiRoute from './routes/apiRoute.js'
import userRoute from './routes/userRoute.js'
import chatRoute from './routes/chatRoute.js'
import mongoose from 'mongoose'
import path from 'path'
import { createServer } from 'http'
import { Server } from 'socket.io'

const port = process.env.PORT || 3001;
let connectedClients = [], onlineUsers = []

const db = mongoose.connection
mongoose.connect('mongodb://localhost:27017/webconnect', {
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

 N/B: ConnectedCLients VAR STORES AN ONLINE USER WITH TOKEN INCLUDED
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

	io.emit('getOnileUsers', onlineUsers)

	socket.on('disconnect', reason => {
		onlineUsers = onlineUsers.filter(user => user.token !== socket.token)
		connectedClients = connectedClients.filter(user => user.token !== socket.token)

		socket.broadcast.emit('userDisconnect', {username: socket.username, socketId: socket.id})

	})

	socket.on('sentChat', chat => {
		const {sentTo, sentBy, message} = chat
		const find = onlineUsers.find(i => i.username === sentTo)
		if (find !== undefined) {
			//it means the user is currently online, forward to his socket
			io.to(find.socketId).emit('chatFromUser', {sentBy, message})

		} else {
			console.log(find)
		}
	})
})


app.use(express.static('./webconnect_build/dist'))

server.listen(port, () => console.log('webconnect running on port ' + port))