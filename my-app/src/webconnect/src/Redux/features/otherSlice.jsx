import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	fetched: [],
	typingStatus: {},
	currentSelectedUser: {}
}

const otherSlice = createSlice({
	name: 'other',
	initialState,
	reducers: {
		setSelectedUser: (state, action) => {
			state.currentSelectedUser = action.payload
		},
		assertFetch: (state, action) => {
			const username = action.payload
			state.fetched.push(username)
		},
		setTypingStatus: (state, action) => {
			state.typingStatus = action.payload
		},
		handleSocket: (state, action) => {
			// console.log(action.payload)
		}
	},
})

export const {
	setSelectedUser,
	assertFetch,
	handleSocket,
	setTypingStatus
} = otherSlice.actions

export default otherSlice.reducer