const mongoose = require('mongoose')

const userPrivacySchema = new mongoose.Schema({
	_id: String,
	privacy: Object
})

const UserPrivacy = mongoose.model('userPrivacy', userPrivacySchema)

module.exports = UserPrivacy