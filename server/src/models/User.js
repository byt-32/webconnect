const mongoose = require('mongoose')

const socialsSchema = new mongoose.Schema({
	name: {type: String},
	link: {type: String},
	hidden: {type: Boolean},
},{ _id: false})

const userSchema = new mongoose.Schema({
	username: {required: true, index: {unique: true}, type: String},
	displayName: {type: String, default: ''},
	email: { type: String, lowercase: true, required: true, index: {unique: true}} ,
	password: { type: String, required: true },
	remember: {type: Boolean},
	bio: {type: String},
	updateNameTimestamp: {type: Date},
	lastSeen: {type: Number},
	socials: [socialsSchema],
	joined: {type: Date, default: Date.now},
})


const User = mongoose.model('user', userSchema)
module.exports = User
