import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchMessages = createAsyncThunk('fetchMessages', 
	async (args) => {
		const response = await fetch(`/chat/fetchMessages/${args.friendsName}/${args.token}`)
		if (response.ok) {
			const messages = await response.json()
			return messages
		}
	}
)

const actionValues = {
	pendingDelete: {},
	reply: {open: false},
	starredChat: {}
}

const initialState = {
	privateChats: [],
	
}

const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		storeSentChat: (state, action) => {

			const {sentTo, message} = action.payload

			const find = state.privateChats.findIndex(i => i.username === sentTo)

			if (find !== -1) {
				state.privateChats[find].messages.push(message)
			} else {
				state.privateChats.push({username: sentTo, messages: [message]})
			}

		},
		storeReceivedChat: (state, action) => {
			const {sentBy, message} = action.payload

			const find = state.privateChats.findIndex(i => i.username === sentBy)

			if (find !== -1) {
				state.privateChats[find].messages.push(message)
			} else {
				state.privateChats.push({
					username: sentBy,
					messages: [message],
					actionValues
				})
			}

		},
		setChatRead: (state, action) => {
			const receiver = action.payload
			const find = state.privateChats.findIndex(i => i.username === receiver)

			if (find > -1) {
				state.privateChats[find].messages.forEach( i => {
					if (!i.read && i.read !== undefined) {
						i.read = true
					}
				})
			}
		},

		setReply: (state, action) => {
			const {open, friendsName} = action.payload
			const find = state.privateChats.findIndex(i => i.username === friendsName)

			if (open) {
				const {username, chatId, sentBy} = action.payload

				if (find !== -1) {
					const message = state.privateChats[find].messages.find(i => i.chatId === chatId).message
					state.privateChats[find].actionValues.reply = {
						open,
						sentBy: sentBy,
						message: message,
						chatId: chatId
					}
				}
			} else {
				state.privateChats[find].actionValues.reply = {open: false}
			}

		},

		setHighlighted: (state, action) => {
			const {friendsName, chatId, show} = action.payload
			const find = state.privateChats.findIndex(i => i.username === friendsName)

			if (show) {
				if (find !== -1) {
					state.privateChats[find].messages.find(i => i.chatId === chatId).highlightChat = true
				}
			} else {
				state.privateChats[find].messages.find(i => i.chatId === chatId).highlightChat = false
			}
		},

		setReaction: (state, action) => {
			const {reaction, chatId, friendsName} = action.payload
			const find = state.privateChats.findIndex(i => i.username === friendsName)

			if (find !== -1) {
				state.privateChats[find].messages.find(i => i.chatId === chatId).reaction = reaction
			}
		},

		handleStarredChat: (state, action) => {
			const {friendsName, starredChat} = action.payload
			const find = state.privateChats.findIndex(i => i.username === friendsName)
			if (find !== -1) {
				state.privateChats[find].actionValues.starredChat = starredChat
			}
			
		},

		setPendingDelete: (state, action) => {
			const {friendsName, chat} = action.payload
			const find = state.privateChats.findIndex(i => i.username === friendsName)

			if (find > -1) {
				if (Object.keys(state.privateChats[find].actionValues.pendingDelete).length === 0) {
					state.privateChats[find].actionValues.pendingDelete = chat
				}
			}

		},
		undoPendingDelete: (state, action) => {
			const {friendsName} = action.payload
			const find = state.privateChats.findIndex(i => i.username === friendsName)

			if (find > -1) {
				state.privateChats[find].actionValues.pendingDelete = {}
			}

		},
		performChatDelete: (state, action) => {
			const {friendsName, chat} = action.payload

			const find = state.privateChats.findIndex(i => i.username === friendsName)

			if (find !== -1) {
				if (state.privateChats[find].actionValues.starredChat.chatId === chat.chatId) {
					state.privateChats[find].actionValues.starredChat = {}
				}
				state.privateChats[find].actionValues.pendingDelete = {}

				function redoDelete() {
					/** we use forEach because chatId could match 1 or more replied chats,
						so if it finds a match:
							* splice it from messages array
							* re-run the function to refresh the index (i)
					 */
					state.privateChats[find].messages.forEach((message, i) => {
						if (message.reply.chatId === chat.chatId) {
							state.privateChats[find].messages[i].reply.message = ''
						}
						if (message.chatId === chat.chatId) {
							state.privateChats[find].messages.splice(i, 1)
							redoDelete()
						}
					})
				}
				redoDelete()
				
			}
		},

	},
	extraReducers: builder => {
		builder.addCase(fetchMessages.pending, (state, action) => {

		})
		.addCase(fetchMessages.fulfilled, (state, action) => {
			const { username, messages, starredChat } = action.payload

			const idx = state.privateChats.findIndex( chat => chat.username === username)
			
			if (idx === -1) {
				state.privateChats.push({
					username,
					messages,
					actionValues: {...actionValues, starredChat}
				})
			} else {
				state.privateChats[idx] = {messages, actionValues, username, starredChat}
			}
		})
	}
})

export const {
	storeSentChat,
	setHighlighted,
	storeReceivedChat,
	setChatRead,
	setReaction,
	handleStarredChat,
	performChatDelete,
	setPendingDelete,
	undoPendingDelete,
	setReply
} = chatSlice.actions

export default chatSlice.reducer