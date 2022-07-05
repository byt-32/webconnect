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
				state.privateChats.push({username: sentBy, messages: [message]})
			}

		},
		setChatRead: (state, action) => {
			const receiver = action.payload
			const find = state.privateChats.find(i => i.username === receiver)
			const index = state.privateChats.findIndex(i => i.username === receiver)

			if (find !== undefined) {
				find.messages.forEach( i => {
					if (!i.read && i.read !== undefined) {
						i.read = true
					}
				})
				state.privateChats[index].messages = find.messages
			}
		},
		setReply: (state, action) => {
			const {open, friendsName} = action.payload
			const find = state.privateChats.findIndex(i => i.username === friendsName)

			if (open) {
				const {username, chatId, sentBy} = action.payload

				if (find !== -1) {
					const message = state.privateChats[find].messages.find(i => i.chatId === chatId).message
					state.privateChats[find].reply = {
						open: true,
						sentBy: sentBy,
						message: message,
						chatId: chatId
					}
				}
			} else {
				state.privateChats[find].reply = {open: false}
			}

				// const find = state.privateChats.findIndex(i => i.username === sentBy)
			// const 
		}
	},
	extraReducers: builder => {
		builder.addCase(fetchMessages.pending, (state, action) => {

		})
		.addCase(fetchMessages.fulfilled, (state, action) => {
			const { username, messages } = action.payload
			const reply = {open: false}

			const idx = state.privateChats.findIndex( chat => chat.username === username)
			
			if (idx === -1) {
				state.privateChats.push({...action.payload, reply})
			} else {// This will never execute, fetching messages is limited to once per user
				state.privateChats[idx].messages = messages
			}
		})
	}
})

export const {
	storeSentChat,
	storeReceivedChat,
	setChatRead,
	setReply
} = chatSlice.actions

export default chatSlice.reducer