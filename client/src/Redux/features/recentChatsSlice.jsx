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


function traverse(arr) {
	let starred = []
	arr.forEach((chat, i) => {
		if (chat.isStarred.value) {
			starred.push(chat)
		}
	})

	starred.sort((a,b) => {
		if (a.isStarred.date > b.isStarred.date) return -1
		else return 1
	})

	arr = arr.filter(i => !i.isStarred.value)

	arr.sort((a,b) => {
		if (a.lastSent > b.lastSent) return -1
		else return 1
	})
	

	arr = [...starred, ...arr]

	return arr
}


const initialState = {
	recentChats: [],
	chatToBeCleared: [],
	temp: [],
	// defaultActions: {
	// 	online: false,
	// 	unread: [],
	// 	typing: false,
	// },
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
			const {lastSent, username, messages} = action.payload
			let index = state.recentChats.findIndex(i => i.username === username)
			let spliced

			if (index !== -1) {
				state.recentChats[index].lastSent = lastSent
				state.recentChats[index].messages = messages

			} else {
				state.recentChats.unshift(action.payload)
			}
			
			state.recentChats = traverse(state.recentChats)

		},

		handleStarred: (state, action) => {
			const {friendsName, isStarred} = action.payload
			const find = state.recentChats.findIndex(i => i.username === friendsName)

			if (find !== -1) {
				state.recentChats[find].isStarred = isStarred
			}

			state.recentChats = traverse(state.recentChats)
		},

		clearConversation: (state, action) => {
			const friendsName = action.payload
			const find = state.recentChats.findIndex(i => i.username === friendsName)
			if (find !== -1) {
				state.recentChats.splice(find, 1)
			}
		},
		syncRecentsWithDeleted: (state, action) => {
			const {friendsName, chat} = action.payload
			const find = state.recentChats.findIndex(i => i.username === friendsName)

			if (find !== -1) {
				const findInUnread = state.recentChats[find].unread.findIndex(i => i === chat.chatId)
				if (findInUnread !== -1) {
					state.recentChats[find].unread.splice(findInUnread, 1)
				}
				if (state.recentChats[find].messages.chatId === chat.chatId) {
					state.recentChats[find].messages = {}
				}
			}
		},
		syncRecentsWithRead: (state, action) => {
			const friendsName = action.payload
			const find = state.recentChats.findIndex(i => i.username === friendsName)

			if (find !== -1) {
				state.recentChats[find].messages.read = true
			}
		},

		alertBeforeClear: (state, action) => {
			state.chatToBeCleared = action.payload
		},

		searchRecentChats: (state, action) => {
			if (!temp.length) {
				// state.recentChats.forEach()
			}
		}
	},
	extraReducers: builder => {
		builder.addCase(fetchRecentChats.pending, (state, action) => {
			state.showRecentUsersLoader = true
		})
		.addCase(fetchRecentChats.fulfilled, (state, action) => {
			// console.log(action.payload)
			const {recentChats} = action.payload
			recentChats.forEach(i => {
				if (i.messages.length > 0) {
					i.typing = false 
					i.online = false
					i.messages = i.messages[0]
				}	
			})

			state.recentChats = traverse(recentChats)

			state.showRecentUsersLoader = false
		})
	}
})

export const {
	search,
	setRecentOnline,
	resetUnread,
	handleStarred,
	clearConversation,
	alertBeforeClear,
	setUnread,
	searchRecentChats,
	syncRecentsWithDeleted,
	updateRecentChats,
	syncRecentsWithRead,
	handleUserTypingActivity,
	setRecentDisconnect
} = recentChatsSlice.actions

export default recentChatsSlice.reducer