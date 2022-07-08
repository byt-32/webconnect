import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	username: {required: true, index: {unique: true}, type: String},
	email: { type: String, lowercase: true, required: true, index: {unique: true}} ,
	password: { type: String, required: true },
	remember: {type: Boolean},
	bio: {type: String},
	updateNameTimestamp: {type: Date},
	lastSeen: {type: Number},
	socials: {type: Array},
	joined: {type: Date, default: Date.now},
})


const User = mongoose.model('user', userSchema)
export default User
