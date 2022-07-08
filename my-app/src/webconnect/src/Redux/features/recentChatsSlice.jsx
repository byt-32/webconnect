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
	defaultActions: {
		online: false,
		unread: [],
		typing: false,
	},
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
				state.recentChats[index].lastSeen = Date.now()
			}
		},
		resetUnread: (state, action) => {
			const username = action.payload
			const find = state.recentChats.findIndex(i => i.username === username)

			if (find !== -1) {
				state.recentChats[find].unread = []
			}
		},
		setUnread: (state, action) => {
			const {friendsName, chatId} = action.payload

			const find = state.recentChats.findIndex(i => i.username === friendsName)

			if (find !== -1) {
				state.recentChats[find].unread.push(chatId)
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
			const {lastSent, username, online, messages} = action.payload

			const findIndex = state.recentChats.findIndex(i => i.username === username)
			if (findIndex !== -1) {
				state.recentChats[findIndex].lastSent = lastSent
				state.recentChats[findIndex].messages = messages
				state.recentChats[findIndex].unread = []

			} else {
				state.recentChats.unshift(action.payload)
			}
			state.recentChats.sort((a, b) => {
				if (a.lastSent < b.lastSent) return 1
				if (a.lastSent > b.lastSent) return -1
			})
		},
		syncRecentsWithDeleted: (state, action) => {
			const {friendsName, chat} = action.payload
			const find = state.recentChats.findIndex(i => i.username === friendsName)

			if (find > -1) {
				const findInUnread = state.recentChats[find].unread.findIndex(i => i === chat.chatId)
				if (findInUnread > -1) {
					state.recentChats[find].unread.splice(findInUnread, 1)
				}
				if (state.recentChats[find].messages.chatId === chat.chatId) {
					state.recentChats[find].messages = {}
				}
			}
		}
	},
	extraReducers: builder => {
		builder.addCase(fetchRecentChats.pending, (state, action) => {
			state.showRecentUsersLoader = true
		})
		.addCase(fetchRecentChats.fulfilled, (state, action) => {
			// console.log(action.payload)
			const {recentChats, unread} = action.payload
			recentChats.forEach(i => {
				if (i.messages.length > 0) {
					const findInUnread = unread.find(user => user.username === i.username)
					if (findInUnread !== undefined) {
						i.unread = findInUnread.unreadArray
					}
					i.typing = false
					i.online = false
					i.messages = i.messages[0]
				}	
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
	syncRecentsWithDeleted,
	updateRecentChats,
	handleUserTypingActivity,
	setRecentDisconnect
} = recentChatsSlice.actions

export default recentChatsSlice.reducer