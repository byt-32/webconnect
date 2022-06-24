import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import retrieveDate from '../retrieveDate'

export const fetchMessages = createAsyncThunk('user/fetchMessages', 
	async (args) => {
		const response = await fetch(`/chats/${args.friendsName}/${args.token}`)
		if (response.ok) {
			const messages = await response.json()
			return messages
		}
	}
)
export const fetchInitialData = createAsyncThunk('user/fetchInitialData', 
	async (id) => {
		const response = await fetch(`/fetchInitialData/${id}`)
		if (response.ok) {
			const userData = await response.json()
			return userData
		}
	}
)
function chats() {
	let chats = []
	if (JSON.parse(localStorage.getItem('messages')) !== null) {
		chats = JSON.parse(localStorage.getItem('messages'))
	}
	return chats
}

let temp = []
const initialState = {
	oneTimeMessage: {
		input: '',
		chatId: Number()
	},
	highlightedId: '',
	reply: {
		open: false,
		person: '',
		to: '',
	},
	noMatch: {
		recentChats: false,
		activeUsers: false
	},
	privateChats: [],
	profileInfos: [],
	temp: {
		recentChats: [],
		activeUsers: []
	},
	searchTerm: {
		recentChats: '',
		activeUsers: ''
	},
	currentSelectedUser: {},
	showCount: true,
	loader: false,
	chatUpdate: {},
	preload: {
		recentChats: true, 
		activeUsers: true
	},
	recentChats: [],
	activeUsers: [],
	components: {
		rightPane: false,
		leftPane: true,
		profile: false,
		stack: {
			recentChats: false,
			activeUsers: true,
			settings: false,
			resetPassword: false,
			contactInfo: false,
			privacy: false,
		}
		
	},
	user: {
		contacts: {...JSON.parse(localStorage.getItem('details'))},
		socketId: '',
		status: '',
		bio: '',
		settings: JSON.parse(localStorage.getItem('settings')) || {
			notifications: true,
			privacy: {
				gmail: true
			}
		}
	},
}

const globalPropsSlice = createSlice({
	name: 'globalProps',
	initialState,
	reducers: {
		
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
		
		handleSearch: (state, action) => {
			const {input, component} = action.payload
			state.searchTerm[`${component}`] = input
			
			// function updateListProps(updater, updated) {
			// 	updater.forEach(user => {
			// 		const userInUpdater = updated.findIndex(recent => recent.username === user.username)
			// 		if (userInUpdater !== -1) {
			// 			updated[userInUpdater] = {
			// 				...updated[userInUpdater],
			// 				username: user.username,
			// 				status: user.status,
			// 				socketId: user.socketId
			// 			}
			// 		}
			// 	})
			// }
			function matchUsername(arr) {
				let matched = []
				arr.forEach( (obj, i) => {
					if (obj.username.toLowerCase().lastIndexOf(input.toLowerCase()) !== -1){
					 matched.push(obj)
					}
				})
				return matched
			}

			if (component === 'recentChats') {
				if (state.temp.recentChats.length === 0) {
					state.temp.recentChats = state.recentChats
				}

				if (state.searchTerm.recentChats === '') {
					state.recentChats = state.temp.recentChats
					updateListProps(state.temp.recentChats, state.recentChats)
					state.temp.recentChats = []
				}

				state.recentChats = matchUsername(state.recentChats)
				updateListProps(state.temp.recentChats, state.recentChats)
			}

			if (component === 'activeUsers') {
				if (state.temp.activeUsers.length === 0) {
					state.temp.activeUsers = state.activeUsers
				}

				if (state.searchTerm.activeUsers === '') {
					state.activeUsers = state.temp.activeUsers
					updateListProps(state.temp.activeUsers, state.activeUsers)
					state.temp.activeUsers = []
				}

				state.activeUsers = matchUsername(state.activeUsers)
				updateListProps(state.temp.activeUsers, state.activeUsers)
			}
		},
		retrieveOTM: (state, action) => {
			state.oneTimeMessage = {...state.oneTimeMessage, ...action.payload}
		},
		
		setComponents: (state, action) => {
			const {component, value} = action.payload
			const leftPaneComponents = state.components.stack

			if (component === 'leftPane' 
				|| component === 'rightPane' 
				|| component === 'profile') 
			{
				state.components[`${component}`] = value
			} else {
				for (let val in leftPaneComponents) {
					if (val === component) {
						leftPaneComponents[val] = true
					} else {
						leftPaneComponents[val] = false
					}
				}
			}

		},
		
		changeSettings: (state, action) => {
			const payload = action.payload
			state.user.settings = {...payload}
			localStorage.setItem('settings', JSON.stringify(state.user.settings))
		},
	}, 
	extraReducers: (builder) => {
		builder.addCase(fetchMessages.pending, (state, action) => {
			state.loader = true
		})
		.addCase(fetchMessages.fulfilled, (state, action) => {
			const payload = action.payload
			const idx = state.privateChats.findIndex( chat => chat.username === payload.username)
			
			if (idx !== -1) {
				state.privateChats[idx] = payload
			} else {
				state.privateChats.push(payload)
			}
			
			state.loader = false
		})
		.addCase(fetchInitialData.pending, (state, action) => {

		})
		.addCase(fetchInitialData.fulfilled, (state, action) => {
			const { props, recentChats, settings, unread, users } = action.payload
			state.activeUsers = users
		})
		.addCase(fetchInitialData.rejected, (state, action) => {

		})
	}
})

export const { setLoginAlert, setComponents, handleSearch, handleReply,
 storeProfileInfos, updateUnreadReset, updateChatStatus, setHighlightedId,
	afterLogin, addNewUser,	setSelectedUser, afterRegistration, setStatus, hideCount,
	storePrivateChats, retrieveOTM, userDisconnect, storeSocketId, setBio, changeSettings
} = globalPropsSlice.actions
export default globalPropsSlice.reducer