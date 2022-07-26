const mongoose = require('mongoose')

const userSettingsSchema = new mongoose.Schema({
	_id: String,
	settings: {}
})

const UserSettings = mongoose.model('userSettings', userSettingsSchema)
module.exports = UserSettings