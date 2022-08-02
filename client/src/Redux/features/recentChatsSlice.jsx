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

const defaultValues = {
	online: false,
	typing: false,
	visible: true
}

const initialState = {
	recentChats: [],
	chatToBeCleared: [],
	temp: [],
	input: '',
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
		
		updateRecentChats: (state, action) => {
			const {lastSent, username, messages} = action.payload
			let index = state.recentChats.findIndex(i => i.username === username)
			let spliced

			if (index !== -1) {
				state.recentChats[index].lastSent = new Date(messages.timestamp.fullDate).getTime()
				state.recentChats[index].messages = messages

			} else {
				action.payload = {...action.payload, ...defaultValues}
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

		starGroup: (state, action) => {
			const {group, starredObj} = action.payload
			const find = state.recentChats.findIndex(i => i.chatType === 'group' && i.group.groupId === group.groupId)

			if (find !== -1) {
				state.recentChats[find].isStarred = starredObj
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
		addGroup: (state, action) => {
			action.payload.visible = true
			state.recentChats.unshift(action.payload)

			state.recentChats = traverse(state.recentChats)
			// state.recentChats.push(groupDetails)
		},

		exitGroup: (state, action) => {
			const {groupId} = action.payload
			const find = state.recentChats.findIndex(i => i.chatType === 'group' && i.group.groupId === groupId)
			if (find !== -1) {
				state.recentChats.splice(find ,1)
			}
		},

		searchRecentChats: (state, action) => {
			const input = action.payload
			state.input = input
			
			state.recentChats.forEach((a, i) => {
				if (a.chatType === 'group') {
					if (a.group.groupName.toLowerCase().includes(input.toLowerCase())) {
						state.recentChats[i].visible = true
					} else {
						state.recentChats[i].visible = false
					}
				}
				if (a.chatType === 'user') {
					if (a.username.toLowerCase().includes(input.toLowerCase())) {
						state.recentChats[i].visible = true
					} else {
						state.recentChats[i].visible = false
					}
				}
			})
		}
	},
	extraReducers: builder => {
		builder.addCase(fetchRecentChats.pending, (state, action) => {
			state.showRecentUsersLoader = true
		})
		.addCase(fetchRecentChats.fulfilled, (state, action) => {
			const {recentChats} = action.payload
			const allChats = recentChats.chats.concat(recentChats.groups)

			allChats.forEach(i => {
				i.visible = true
				if (i.chatType === 'group') {
					if (i.messages.length === 0) {
						i.lastSent = new Date(i.group.created).getTime()
					} else {
						i.lastSent = new Date(i.messages.timestamp.fullDate).getTime()
					}
				}
				if (i.chatType === 'user') {
					if (i.messages.length > 0) {
						i.typing = false 
						i.online = false
						i.messages = i.messages[0]
						i.lastSent = new Date(i.messages.timestamp.fullDate).getTime()
					}	
				}
			})

			state.recentChats = traverse(allChats)

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
	addGroup,
	exitGroup,
	starGroup,
	setRecentDisconnect
} = recentChatsSlice.actions

export default recentChatsSlice.reducer