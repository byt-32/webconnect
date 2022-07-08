import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	fetched: [],
	currentSelectedUser: {},
	onlineUsers: []
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
		setOnlineUsers: (state, action) => {
			const users = action.payload

			users.forEach(user => {
				const index = state.onlineUsers.findIndex(i => i.username === user.username)
				user.online = true
				if (index > -1) {
					state.onlineUsers[index].online = true
				} else {
					state.onlineUsers.push(user)
				}
			})
			
		},
		setDisconnectedUsers: (state, action) => {
			const {username} = action.payload
			const index = state.onlineUsers.findIndex(i => i.username === username)
			if (index > -1) {
				state.onlineUsers[index].online = false
				state.onlineUsers[index].lastSeen = Date.now()
			}
		}
	},
})

export const {
	setSelectedUser,
	assertFetch,
	setOnlineUsers,
	setDisconnectedUsers
} = otherSlice.actions

export default otherSlice.reducer