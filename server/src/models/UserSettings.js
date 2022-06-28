import mongoose from 'mongoose'

const userSettingsSchema = new mongoose.Schema({
	_id: String,
	settings: {}
})

const UserSettings = mongoose.model('userSettings', userSettingsSchema)
export default UserSettings