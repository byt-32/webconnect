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
	chatObj: {},
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
		handleChatObj: (state, action) => {
			state.chatObj = action.payload
		},
		storeReceivedChat: (state, action) => {
			const {sentBy, message} = action.payload

			const find = state.privateChats.findIndex(i => i.username === sentBy)

			if (find !== -1) {
				state.privateChats[find].messages.push(message)
			} else {
				state.privateChats.push({username: sentBy, messages: [message]})
			}

		}
	},
	extraReducers: builder => {
		builder.addCase(fetchMessages.pending, (state, action) => {

		})
		.addCase(fetchMessages.fulfilled, (state, action) => {
			const { username, messages } = action.payload

			const idx = state.privateChats.findIndex( chat => chat.username === username)
			
			if (idx === -1) {
				state.privateChats.push(action.payload)
			} else {
				state.privateChats[idx].messages = messages
			}
		})
	}
})

export const {
	storeSentChat,
	storeReceivedChat,
	handleChatObj
} = chatSlice.actions

export default chatSlice.reducer