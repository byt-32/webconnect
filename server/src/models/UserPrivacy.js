import mongoose from 'mongoose'

const userPrivacySchema = new mongoose.Schema({
	_id: String,
	privacy: Object
})

const UserPrivacy = mongoose.model('userPrivacy', userPrivacySchema)

export default UserPrivacy