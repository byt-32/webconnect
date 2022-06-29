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



io.on('connection', socket => {
	console.log(socket)
})


app.use(express.static('./webconnect_build/dist'))

app.listen(port, () => console.log('webconnect running on port ' + port))