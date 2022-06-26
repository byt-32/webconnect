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
	oneTimeMessage: {
		input: '',
		chatId: Number()
	},
}

const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducer: {
		storePrivateChats: (state, action) => {
			const {username, message, me, chatId, reply} = action.payload
			const _date = new Date()
			
			const date =
			{...retrieveDate(_date.toDateString()), 
				time: _date.toLocaleTimeString('en-US', {hour12: true, hour: '2-digit', minute: '2-digit'})
			}
			const senderInRecentChats = state.recentChats.findIndex(chat => chat.username === username)

			const senderInUsers = state.activeUsers.find(user => user.username === username)
			
			if (senderInRecentChats !== -1) {
				const spliced = state.recentChats.splice(senderInRecentChats, 1)[0]
				state.recentChats.unshift(spliced)
			} else {
				state.recentChats.unshift({
					...senderInUsers,
					unread: 0
				})
			}
			if (!me) {
				if (Object.keys(state.currentSelectedUser).length === 0) {
					state.recentChats.find(user => user.username === username).unread += 1
				} else {
					if (state.currentSelectedUser.username !== username) {
						state.recentChats.find(user => user.username === username).unread += 1
					}
				}
			}
			//handle storage of message in privateChats object
			function pushToLS() {
				let ls = JSON.parse(localStorage.getItem('messages')) || []
				if (ls.length === 0) {
					ls.push({
						username: username, color: senderInUsers.color, 
						messages: [{me: me, message: message, reply: reply, timestamp: date, chatId: chatId}]
					})
					localStorage.setItem('messages', JSON.stringify(ls))
				} else {
					const foundIndex = ls.findIndex( chat => chat.username === username)
					if (foundIndex !== -1) {
						ls[foundIndex].messages.push({me: me, message: message, reply: reply, timestamp: date, chatId: chatId})
						localStorage.setItem('messages', JSON.stringify(ls))
						
						// if (ls[foundIndex].messages.length >= 5) {
						// 	ls[foundIndex].messages.splice(0,1)
						// 	localStorage.setItem('messages', JSON.stringify(ls))
						// }
					} else {
						ls.push({
							username: username, 
							color: senderInUsers.color, 
							messages: [{me: me, message: message, reply: reply, timestamp: date, chatId: chatId}]
						})
						localStorage.setItem('messages', JSON.stringify(ls))
					}
				}
			}
			function pushToStore() {
				const privateChats = state.privateChats
				if (privateChats.length === 0) {
					state.privateChats.push({
						username: username, 
						messages: [{
							me: me, message: message, reply: reply, timestamp: date, chatId: chatId
						}]
					})

				} else {
					const foundIndex = privateChats.findIndex( chat => chat.username === username)
					if (foundIndex !== -1) {
						// if (state.privateChats[foundIndex].messages.length >= 5) {
						// 	state.privateChats[foundIndex].messages.splice(0,1)
						// }
						state.privateChats[foundIndex].messages.push({
							me: me, message: message, reply: reply, timestamp: date, chatId: chatId
						})
					} else {
						state.privateChats.push({
							username: username, 
							messages: [{
								me: me, message: message, reply: reply, timestamp: date, chatId: chatId
							}]
						})
					}
					
				}
			}

			pushToLS()
			pushToStore()
		},
		retrieveOTM: (state, action) => {
			state.oneTimeMessage = {...state.oneTimeMessage, ...action.payload}
		},
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
	storePrivateChats,
	retrieveOTM
} = chatSlice.actions

export default chatSlice.reducer