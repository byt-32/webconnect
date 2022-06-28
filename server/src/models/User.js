import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	username: {required: true, index: {unique: true}, type: String},
	email: { type: String, required: true, index: {unique: true}} ,
	password: { type: String, required: true },
	remember: {type: Boolean},
	bio: {type: String},
	updateNameTimestamp: {type:  Date} ,
	socials: {type: Object},
	joined: {type: Date, default: Date.now},
})


const User = mongoose.model('user', userSchema)
export default User
