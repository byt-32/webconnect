const express = require('express'),
	mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
	socketIO = require('socket.io'),
	http = require('http'),
	cors = require('cors'), 
	host = '0.0.0.0',
	port = process.env.PORT || 3001;
require('dotenv').config()

let app = express()

const uri = process.env.LOCALURI

const dbUrl = uri
let db = mongoose.connection
let connectedToDB
const connectToDB = async () => {
	console.log('Connecting to DB...')
	await mongoose.connect(dbUrl, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}).then(() => {
		console.log('Database connection successful')
		connectedToDB = true
	}).catch(() => {
		console.log('Database connection error')
		connectedToDB = false
	})
}
connectToDB()
db.on('error', () => connectedToDB = false)

mongoose.connection.on('disconnected', () => {
	connectedToDB = false
})

const userSchema = new mongoose.Schema({
	username: {required: true, index: {unique: true}, type: String},
	email: { type: String, required: true, index: {unique: true}} ,
	password: { type: String, required: true },
	remember: {type: Boolean},
	bio: {type: String},
	color: {type: String},
	joined: {type: Date, default: Date.now},
})

const chatSchema = new mongoose.Schema({
	_id: String,
	username: String,
	chats: Array
})

const userPrefSchema = new mongoose.Schema({
	_id: String,
	preferences: {}
})

const unreadCountSchema = new mongoose.Schema({
	_id: String,
	username: String,
	users: [
		{
			_id: String,
			username: String,
			count: Number
		}
	]
})
const User = mongoose.model('user', userSchema)
const Chat = mongoose.model('chat', chatSchema)
const UserPref = mongoose.model('userPref', userPrefSchema)
const UnreadCount = mongoose.model('unreadCount', unreadCountSchema)

let server = http.createServer(app)
let io = socketIO(server)

var connected = []
io.use(async(socket, next) => {
	const {username, sessionId} = socket.handshake.auth

	if (!username && !sessionId) {
		return next(new Error())
	}
	
	if (connected.length >= 1) {
		const find = connected.find(entry => entry.token === sessionId)
		const pos = connected.findIndex( i => i.token === sessionId)
		if (find !== undefined) {
			const sockets = await io.in(find.socketId).fetchSockets()
			sockets[0].disconnect(true)
		}
	}
	socket.username = username
	socket.sessionId = sessionId
	next()
})
function retrieveDate(date) {
	const index = (/[0-9](?=[0-9]{3})/).exec(date)['index']
	const year = date.split('').splice(index).join('')
	const day = date.split('').splice(0, index-1).join('')
	const fullDate = date

	return {year: year, day: day, fullDate: fullDate}
}
async function saveChats(token1, name, token2, recepientName, me, message, time) {
	const _date = new Date()

	const date =
	{ ...retrieveDate(_date.toDateString()), 
			time: time
	}

	try{
		if (await Chat.findById(token1) === null) {
			await Chat.create({
				_id: token1,
				username: name,
				chats: [{
					id: token2, username: recepientName,
					lastSent: Date.now(),
					messages: [{me: me, message: message, timestamp: date}]
				}]
			})
		} else {
			let findChat = await Chat.findById(token1)
			let idx = await findChat.chats.findIndex(chat => chat.id === token2)
			if (idx !== -1) {
				findChat.chats[idx].lastSent = Date.now()
				findChat.chats[idx].messages.push({me: me, message: message, timestamp: date})
				await Chat.findByIdAndUpdate(token1, {chats: findChat.chats})
			} else {
				findChat.chats.push({
					id: token2, username: recepientName, lastSent: Date.now(), messages: [{me: true, message: message, timestamp: date}]
				})
				await Chat.findByIdAndUpdate(token1, {chats: findChat.chats})
			}
		}
	} catch (e) {
		console.log('Err' , e)
	}
}
io.on('connection', socket => {
	let users = []
	function pushUsers(argument) {
		users = []
		connected = []
		for (let [id, socket] of io.of('/').sockets) {
			users.unshift({socketId: id, username: socket.username, status: 'online'})
			connected.unshift({username: socket.username, token: socket.sessionId, socketId: id, status: 'online'})
		}
	}
	pushUsers()
	io.emit('users', users)
	socket.on('disconnect', (reason) => {
		pushUsers()
		socket.broadcast.emit('user disconnect', socket.username, socket.id)
	})
	socket.on('sendMessage', async (reciepientName, sendersToken, sendersName, message, time) => {
		const reciepient = connected.find(user => user.username === reciepientName);
		if (reciepient !== undefined) {//receiver is online
			io.to(reciepient.socketId).emit('sentFromSocket', socket.username, message)
		} else {//reciever is offline
			let offlineUser = await User.findOne({username: reciepientName}, {_id: 1})
			saveUnread(offlineUser.id, sendersToken, reciepientName, sendersName)

		}
		const user = await User.findOne({username: reciepientName}, { _id: 1, username: 1})
		saveChats(user.id, user.username, sendersToken, socket.username, false, message, time)
		saveChats(sendersToken, sendersName, user.id, reciepientName, true, message, time)
		
	})
})
async function saveUnread(RecieverId, SenderId, RecieverName, SenderName) {
	let unread = await UnreadCount.findOne({_id: RecieverId}, {_id: 0, users: 1})
			
	if (unread !== null) {
		const senderInUnread = unread.users.findIndex(user => user._id === SenderId)
		if (senderInUnread !== -1) {
			const count = unread.users[senderInUnread].count
			unread.users[senderInUnread].count = (count + 1)
			await UnreadCount.findByIdAndUpdate(RecieverId, {users: unread.users})
		} else {
			unread.users.unshift({
				_id: SenderId,
				username: SenderName,
				count: 1
			})
			await UnreadCount.findByIdAndUpdate(RecieverId, {users: unread.users})
		}
	} else {
		UnreadCount.create({
			_id: RecieverId,
			username: RecieverName,
			users: [{
				_id: SenderId,
				username: SenderName,
				count: 1
			}]
		})
	}
}
app.use(express.json())
app.use(express.static('webconnect_build/dist/'))
app.use(cors())

app.get('/fetchInitialData/:requesterId', async (request, response) => {
	const { requesterId } = request.params
	if (requesterId !== '' || requesterId) {
		const users = await User.find({_id: {$ne: requesterId}}, {username: 1, color: 1, _id: 0})
		const props = await User.findOne({_id: requesterId}, {_id: 0, bio: 1, color: 1})
		const userPref = await UserPref.findOne({_id: requesterId}, {_id: 0, preferences: 1})
		const recentChats = 
			await Chat.findOne({_id: requesterId}, 
				{_id: 0, 'chats.username': 1, 'chats.lastSent': 1})

		const offlineChatsCount = 
			await UnreadCount.findOne({_id: requesterId}, 
				{_id: 0, 'users.username': 1, 'users.count': 1}
			)

		if (userPref !== null) {
			response.send({users: users, 
				settings: userPref !== null ? userPref.preferences : {}, 
				props: props !== null ? props : {} ,
				recentChats: recentChats !== null ? recentChats : {},
				unread: offlineChatsCount !== null ? offlineChatsCount.users : []
			})
		} else {
			await UserPref.create({
				_id: requesterId, 
				preferences: {
					notifications: true,
					privacy: {gmail: true}
				}
			})
			response.send({
				users: users, 
				recentChats: recentChats !== null ? recentChats : {},
				unread: offlineChatsCount !== null ? offlineChatsCount.users : []
			})
		}
	}

})

app.get('/resetUnread/:requesterId/:friendsName', async (request, response) => {
	const {requesterId, friendsName} = request.params
	const unread = await UnreadCount.findOne({
		_id: requesterId}, {_id: 0})
	if (unread !== null) {
		const find = unread.users.findIndex(user => user.username === friendsName)
		if (find !== -1) {
			unread.users.splice(find, 1)
			await UnreadCount.findByIdAndUpdate(requesterId, {users: unread.users})
		}
	}
})

app.get('/saveUnread/:requesterId/:requesterName/:friendsName/:unread', async (request, response) => {
	const { friendsName, requesterName, requesterId, unread } = request.params
	const friend = await User.findOne({username: friendsName}, {_id: 1})
	saveUnread(requesterId, friend.id, requesterName, friendsName, )
	// let unread = await UnreadCount.findOne({_id: requesterId}, {_id: 0, users: 1})

	
})

app.get('/chats/:friendsName/:requesterId', async (request, response) => {
	const { friendsName, requesterId } = request.params
	if (requesterId === '' || friendsName === '') response.status(404).send()
	else {
		try {
			const user = await Chat.findOne({_id: requesterId}, {chats: 1, _id: 0})
			// const chats = await user.chats.filter(chat => chat.username === friendsName)
			const chats = await Chat.findOne({_id: requesterId, 'chats.username': friendsName},
				{username: 1, 'chats.$': 1}
			)
			if (chats !== null) {
				response.send({username: chats.chats[0].username, messages: chats.chats[0].messages})
			} else {
				response.send({username: friendsName, messages: []})
			}
		} catch(e) {

		}
	}
})

app.post('/savePreferences', async (request, response) => {
	const {id, obj} = request.body
	if (id === '' || !id) {

	} else {
		const userInPref = await UserPref.findOne({_id: id})
		if (userInPref === null) {
			const savePref = await UserPref.create({
				_id: id,
				preferences: obj
			})
			if (savePref) {
				response.send({data: savePref.preferences})
			}
		} else {
			const updatePref = await UserPref.findByIdAndUpdate(id, 
				{preferences: {...userInPref.preferences, ...obj}}, {upsert: true, new: true}
			)

			response.send({data: updatePref.preferences})
		}
	}

})

app.post('/editBio', async (request, response) => {
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

app.get('/getUserSettings/:username/:id', async (request, response) => {
	const {id, username} = request.params
	if (id && username) {
		const user = await User.findOne({username: username}, {email: 1, bio: 1})
		const pref = await UserPref.findOne({_id: user._id}, {'preferences.privacy.gmail': 1, _id: 0})
		if (pref !== null) {
			if (!pref.preferences.privacy.gmail) {
				response.send({gmail: user.email, bio: user.bio, username: username})
			} else {
				response.send({bio: user.bio, username: username})
			}
		} else {
			response.send({bio: user.bio, username: username})
		}
	}
})

app.post('/api/form/matchPassword/:userId', async (request, response) => {
	const id = request.params.userId
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

app.post('/api/form/updatePassword/:userId', async (request, response) => {
	const hashedPassword = await bcrypt.hash(request.body.value, 10)
	const user = await User.findByIdAndUpdate(request.params.userId, {password: hashedPassword})
	if (user) response.send({type: 'success'})
})

app.post('/api/form/login', async (request, response) => {
	const loginDets = request.body
	try {
		const user = await User.findOne({ username: loginDets.username })
		if (user) {
			try {
				const compare = await bcrypt.compare(loginDets.password, user.password)
				if (compare) {
					response.send({type: 'success', id: user.id, username: user.username, email: user.email})

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

app.post('/api/form/register', async (request, response)=>{
	const dets = request.body 
	const hashedPassword = await bcrypt.hash(dets.password, 10)
	const colors = [
	'#64ed94',
	 '#6495ed', 
	 '#cb64ed',
	  '#7364ed',
	  '#64a1ed',
	  '#64c7ed',
	  '#edb664',
	  '#eda364',
	  '#ed7d64',
	  '#ed6471'
	]
	try {
		const foundName = await User.findOne({username: dets.username})
		const foundEmail = await User.findOne({email: dets.email})
		if (foundName) {
			response.send({nameError: 'This name has been taken'})
		} else if (foundEmail) {
			response.send({emailError: 'Email not valid for this account'})
		} else {
			const inserToDB = await User.create({
				username: dets.username,
				email: dets.email,
				password: hashedPassword,
				remember: dets.remember,
				joined: Date.now(),
				color: colors[Math.floor(Math.random() * (colors.length))],
				chats: []
			})
			if (inserToDB) {
				response.send({
					sent: true, 
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

app.use('/images', express.static('webconnect_build/resources/images'))
app.use('/audio', express.static('webconnect_build/resources/audio'))
app.get('/', (req, res) => {
	res.sendFile(__dirname, + 'webconnect_build/dist/index.html')
})
app.get('/login', (req, res) => {
	res.redirect('/')
})
app.get('/signup', (req, res) => {
	res.redirect('/')
})
server.listen(port, ()=>console.log(`server on ${port} @ ${host}`))
