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
	docTitle: 'webconnect',
	loader: false,
	chatUpdate: {},
	preload: {
		recentChats: true, 
		activeUsers: true
	},
	recentChats: [],
	activeUsers: [],
	onlineUsers: [],
	components: {
		rightPane: false,
		leftPane: true,
		profile: false,
		stack: [
			{activeUsers: false, loader: false}, 
			{recentChats: true, loader: false}, 
			{settings: false, loader: false}, 
			{resetPassword: false},
			{contactInfo: false},
			{privacy: false}
		]
	},
	user: {
		contacts: {...JSON.parse(localStorage.getItem('details'))},
		socketId: '',
		status: '',
		bio: '',
		color: '',
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
		storeSocketId: (state, action) => {
			state.user.socketId = action.payload
			state.user.status = 'online'
		},
		updateUnreadReset: (state, action) => {
			state.chatUpdate = action.payload
		},
		updateChatStatus: (state, action) => {
			// let {count, username} = action.payload;

			// const find = state.privateChats.find(chat => chat.username === username).messages;
			// if (find !== undefined) {
			// 	for (let i = 0; i < find.length; i+=1) {
			// 		if (i >= (find.length - count)) {
			// 			find[i].read = true
			// 		}
			// 	}
			// }
				
		},
		addNewUser: (state, action ) => {
			action.payload.forEach(user => {
				const userInRecentChats = state.recentChats.findIndex(chat => chat.username === user.username)
				const userInActiveUsers = state.activeUsers.findIndex(chat => chat.username === user.username)
				const online = state.onlineUsers.findIndex(i => i.username === user.username)

				if (online !== -1) {
					state.onlineUsers.splice(online, 1)
					state.onlineUsers = [...state.onlineUsers, user]
				} else {
					state.onlineUsers = [...state.onlineUsers, user]
				}

				if (userInRecentChats !== -1) {
					let selected = state.recentChats[userInRecentChats]

					state.recentChats[userInRecentChats] = {...selected, ...user}

				}
				if (userInActiveUsers !== -1) {
					let selected = state.activeUsers[userInActiveUsers]
					state.activeUsers[userInActiveUsers] = {...selected, ...user}
					const spliced = state.activeUsers.splice(userInActiveUsers,1)[0]
					state.activeUsers.unshift(spliced)
				} else {
					state.activeUsers.unshift(user)
				}
				if (user.username === state.currentSelectedUser.username) {
					let selected = state.currentSelectedUser
					state.currentSelectedUser = {...selected, ...user}
				}
			})
		},
		userDisconnect: (state, action) => {
			const {username, socketId} = action.payload
			const offlineInRecentChats = state.recentChats.findIndex(chat => chat.username === username)
			const userInOnline = state.onlineUsers.findIndex(i => i.username === username)

			if (userInOnline !== -1) {
				state.onlineUsers.splice(userInOnline, 1)
			}

			offlineInRecentChats !== -1 &&
			(state.recentChats[offlineInRecentChats].status = 'offline')

			state.activeUsers.forEach(user => {
				if (user.username === username) {
					user.status = 'offline'
				}
				if (state.currentSelectedUser.socketId === socketId || state.currentSelectedUser.username === username) {
					state.currentSelectedUser.status = 'offline'
				}
			})
			state.activeUsers = state.activeUsers.sort((a, b) => {
				if (a.username.toLowerCase() < b.username.toLowerCase()) return -1
				if (a.username.toLowerCase() > b.username.toLowerCase()) return 1
			})
		},
		setLoginAlert: (state, action) => {
			const values = action.payload
			state.showLoginAlert.state = values.state
			state.showLoginAlert.type = values.type
		},
		afterLogin: (state, action) => {
			const responseFromServer = action.payload
			const {id, username, email} = responseFromServer
			localStorage.setItem('details', JSON.stringify({
				id: id, username: username, email: email
			}))
			state.user.contacts = JSON.parse(localStorage.getItem('details'))
			document.location.pathname = ''
		},
		afterRegistration: (state, action) => {
			const responseFromServer = action.payload
			const {id, username, email} = responseFromServer
			localStorage.setItem('details', JSON.stringify({
				id: id, username: username, email: email
			}))
			
			state.user.contacts = JSON.parse(localStorage.getItem('details'))
		},
		setStatus: (state, action) => {
			state.user.status = action.payload
		},
		setBio: (state, action) => {
			state.user.bio = action.payload
		},
		setSelectedUser: (state, action) => {
			if (state.components.profile) {
				state.components.profile = false
			}
			state.currentSelectedUser = action.payload
			const recentChatsInSelected = state.recentChats.findIndex(chat => chat.username === action.payload.username)
			if (recentChatsInSelected !== -1) {
				state.recentChats[recentChatsInSelected].unread = 0
			}

		},
		handleReply: (state, action) => {
			state.reply = {...state.reply, ...action.payload}
		},
		setHighlightedId: (state, action) => {
			state.highlightedId = action.payload
		},
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
		storeProfileInfos: (state, action) => {
			const data = action.payload
			state.profileInfos = [...state.profileInfos, ...data]
		},
		handleSearch: (state, action) => {
			const {input, component} = action.payload
			state.searchTerm[`${component}`] = input
			
			function updateListProps(updater, updated) {
				updater.forEach(user => {
					const userInUpdater = updated.findIndex(recent => recent.username === user.username)
					if (userInUpdater !== -1) {
						updated[userInUpdater] = {
							...updated[userInUpdater],
							username: user.username,
							status: user.status,
							socketId: user.socketId
						}
					}
				})
			}
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
		hideCount: (state, action) => {
			state.showCount = false
		},
		
		setComponents: (state, action) => {
			const {component, value} = action.payload

			if (component === 'leftPane' 
				|| component === 'rightPane' 
				|| component === 'profile') 
			{
				state.components[`${component}`] = value
			} else {
				state.components.stack.forEach((obj, i) => {
					const key = Object.getOwnPropertyNames(obj)[0]
					if (key === component) {
						obj[`${key}`] = true
					} else {
						obj[`${key}`] = false
					}
				})
			}

			if (window.innerWidth <= 500) {
				if (component === 'rightPane') {
					if (value) state.components.leftPane = false
					if (!value) {
						state.components.leftPane = true
						state.currentSelectedUser = {}
					}
				} 
				if (component === 'profile') {
					if (value) {
						state.components.rightPane = false
					} else {
						state.components.rightPane = true
					}
				}
			}
			if (window.innerWidth <= 995 && window.innerWidth > 500) {
				if (component === 'profile') {
					if (value) {
						state.components.leftPane = false
					} else {
						state.components.rightPane = true
						state.components.leftPane = true
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
			const { users, settings, props, recentChats, unread} = action.payload
			state.preload.recentChats = false

			state.activeUsers = users.sort((a, b) => {
				if (a.username.toLowerCase() < b.username.toLowerCase()) return -1
				if (a.username.toLowerCase() > b.username.toLowerCase()) return 1
			});

			state.activeUsers.forEach((user, i) => {
				const findOnline = state.onlineUsers.find(i => i.username === user.username);

				if (findOnline !== undefined) {
					state.activeUsers[i] = {...user, ...findOnline}
					let spliced = state.activeUsers.splice(i, 1)[0]
					state.activeUsers.unshift(spliced)
				}
			});

			state.preload.activeUsers = false
			if (settings) state.user.settings = settings
			if (props.bio) state.user.bio = props.bio
			state.user.color = props.color

			if (recentChats.chats) {
				let _recentChats = [...recentChats.chats]

				_recentChats.sort((a, b) => {
					if (a.lastSent > b.lastSent) return -1
					if (a.lastSent < b.lastSent) return 1
				});
				
				_recentChats.forEach((user, i) => {

					let userInUnread = unread.find(unread => unread.username === user.username)

					const userInActiveUsers = 
						state.activeUsers.find(_user => _user.username === user.username)
					const userInOnline = state.onlineUsers.find(i => i.username === user.username) || {}
					if (userInActiveUsers !== undefined) {
						_recentChats[i] = {
							...user, 
							...userInOnline,
							...userInActiveUsers, 
							unread: userInUnread !== undefined ? userInUnread.count : 0
						}
					}
				});

				state.recentChats = _recentChats
			} else {state.preload.recentChats = false}
		})
	}
})

export const { setLoginAlert, setComponents, handleSearch, handleReply,
 storeProfileInfos, updateUnreadReset, updateChatStatus, setHighlightedId,
	afterLogin, addNewUser,	setSelectedUser, afterRegistration, setStatus, hideCount,
	storePrivateChats, retrieveOTM, userDisconnect, storeSocketId, setBio, changeSettings
} = globalPropsSlice.actions
export default globalPropsSlice.reducer