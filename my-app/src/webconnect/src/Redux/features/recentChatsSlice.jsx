import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchRecentChats = createAsyncThunk(
	'fetchRecentChats',
	async (id) => {
		const response = await fetch(`/user/recentChats/${id}`)
		if (response.ok) {
			const recentChats = await response.json()
			return recentChats
		}
	}
)

const initialState = {
	recentChats: [],
	showRecentUsersLoader: false
}

const recentChatsSlice = createSlice({
	name: 'recentChats',
	initialState,
	reducers: {
		search: (state, action) => {

		},
		setRecentOnline: (state, action) => {
			const users = action.payload
			
			users.forEach(user => {
				const index = state.recentChats.findIndex(i => i.username === user.username)
				if (index !== -1) {
					state.recentChats[index].online = true
				}
			})
		},
		setRecentDisconnect: (state, action) => {
			const {username} = action.payload
			const index = state.recentChats.findIndex(i => i.username === username)
			if (index !== -1) {
				state.recentChats[index].online = false
			}
		},
		resetUnread: (state, action) => {
			const username = action.payload
			const find = state.recentChats.findIndex(i => i.username === username)

			if (find !== -1) {
				state.recentChats[find].unread = 0
			}
		},
		setUnread: (state, action) => {
			const sentBy = action.payload
			const find = state.recentChats.findIndex(i => i.username === sentBy)

			if (find !== -1) {
				const value = state.recentChats[find].unread
				if (typeof value === 'number') {
					state.recentChats[find].unread = value + 1
				} else {
					state.recentChats[find].unread = 0
				}
			}
			
		},
		handleUserTypingActivity: (state, action) => {
			const {user, typing} = action.payload
			const find = state.recentChats.findIndex(i => i.username === user)
			if (find !== -1) {
				state.recentChats[find].typing = typing
			}
		},
		updateRecentChats: (state, action) => {
			const {lastSent, user, online, messages} = action.payload

			const findIndex = state.recentChats.findIndex(i => i.username === user)
			if (findIndex !== -1) {
				state.recentChats[findIndex].lastSent = lastSent
				state.recentChats[findIndex].messages = messages

			} else {
				state.recentChats.unshift(action.payload)
			}
			state.recentChats.sort((a, b) => {
				if (a.lastSent < b.lastSent) return 1
				if (a.lastSent > b.lastSent) return -1
			})
		}
	},
	extraReducers: builder => {
		builder.addCase(fetchRecentChats.pending, (state, action) => {
			state.showRecentUsersLoader = true
		})
		.addCase(fetchRecentChats.fulfilled, (state, action) => {
console.log(action.payload)
			const {recentChats, unread} = action.payload
			recentChats.forEach(i => {
				const findInUnread = unread.find(user => user.username === i.username)
				if (findInUnread !== undefined) {
					i.unread = findInUnread.unreadArray.length
				}
				i.typing = false
				i.online = false
				i.messages = i.messages[0]
			})

			state.recentChats = recentChats.sort((a, b) => {
				if (a.lastSent < b.lastSent) return 1
				if (a.lastSent > b.lastSent) return -1
			})

			state.showRecentUsersLoader = false
		})
	}
})

export const {
	search,
	setRecentOnline,
	resetUnread,
	setUnread,
	updateRecentChats,
	handleUserTypingActivity,
	setRecentDisconnect
} = recentChatsSlice.actions

export default recentChatsSlice.reducer