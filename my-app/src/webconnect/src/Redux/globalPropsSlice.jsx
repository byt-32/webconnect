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

// function populateRecentChats() {
// 	let recentChats = []
// 	chats() !== null && chats().map( chat => {
// 		recentChats.unshift({ unread: 0, username: chat.username, status: 'offline', color: chat.color})
// 	})
	
// 	return recentChats
// }
function SORT(arr) {
	let result = []
	let sortedNames = [...arr.map(user => user.username)].sort()
	sortedNames.forEach((name, i) => {
		const find = arr.find(user => user.username === name)
		if (find !== undefined) {
			result.push(find)
		}
	})
	return result
}
let temp = []
const initialState = {
	oneTimeMessage: '',
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
	recentChats: [],
	showCount: true,
	docTitle: 'webconnect',
	loader: false,
	preload: {
		recentChats: true, 
		activeUsers: true
	},
	activeUsers: [],
	components: {
		rightPane: false,
		leftPane: true,
		profile: false,
		stack: [
			{activeUsers: false}, 
			{recentChats: true}, 
			{settings: false}, 
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
		addNewUser: (state, action ) => {
			
			action.payload.forEach(user => {
				const userInRecentChats = state.recentChats.findIndex(chat => chat.username === user.username)
				const userInActiveUsers = state.activeUsers.findIndex(chat => chat.username === user.username)

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
		
		storePrivateChats: (state, action) => {
			const {username, message, me} = action.payload
			const _date = new Date()
			
			const date =
			{...retrieveDate(_date.toDateString()), 
				time: _date.toLocaleTimeString('en-US', {hour12: true, hour: '2-digit', minute: '2-digit'})
			}
			const senderInRecentChats = state.recentChats.findIndex(chat => chat.username === username)

			const senderInUsers = state.activeUsers.find(user => user.username === username)
			
			if (senderInRecentChats !== -1) {
				state.recentChats[senderInRecentChats] = {
					...state.recentChats[senderInRecentChats], 
				}
				if (!me) {
					if (Object.keys(state.currentSelectedUser).length === 0) {
						state.recentChats[senderInRecentChats].unread += 1
					} else {
						if (state.currentSelectedUser.username !== username) {
							state.recentChats[senderInRecentChats].unread += 1
						}
					}
				}

				const spliced = state.recentChats.splice(senderInRecentChats, 1)[0]
				state.recentChats.unshift(spliced)
			} else {
				state.recentChats.unshift({
					...senderInUsers,
					unread: 1
				})
			}

			//handle storage of message in privateChats object
			function pushToLS() {
				let ls = JSON.parse(localStorage.getItem('messages')) || []
				if (ls.length === 0) {
					ls.push({username: username, color: senderInUsers.color,  messages: [{me: me, message: message, timestamp: date}]})
					localStorage.setItem('messages', JSON.stringify(ls))
				} else {
					const foundIndex = ls.findIndex( chat => chat.username === username)
					if (foundIndex !== -1) {
						ls[foundIndex].messages.push({me: me, message: message, timestamp: date})
						localStorage.setItem('messages', JSON.stringify(ls))
						
						// if (ls[foundIndex].messages.length >= 5) {
						// 	ls[foundIndex].messages.splice(0,1)
						// 	localStorage.setItem('messages', JSON.stringify(ls))
						// }
					} else {
						ls.push({
							username: username, 
							color: senderInUsers.color, 
							messages: [{me: me, message: message,  timestamp: date}]
						})
						localStorage.setItem('messages', JSON.stringify(ls))
					}
				}
			}
			function pushToStore() {
				const privateChats = state.privateChats
				if (privateChats.length === 0) {
					state.privateChats.push({username: username, messages: [{me: me, message: message, timestamp: date}]})

				} else {
					const foundIndex = privateChats.findIndex( chat => chat.username === username)
					if (foundIndex !== -1) {
						// if (state.privateChats[foundIndex].messages.length >= 5) {
						// 	state.privateChats[foundIndex].messages.splice(0,1)
						// }
						state.privateChats[foundIndex].messages.push({me: me, message: message, timestamp: date})
					} else {
						state.privateChats.push({username: username, messages: [{me: me, message: message,  timestamp: date}]})
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
			state.oneTimeMessage = action.payload
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
			state.activeUsers = SORT(users)
			state.preload.activeUsers = false
			if (settings) state.user.settings = settings
			if (props.bio) state.user.bio = props.bio
			state.user.color = props.color

			if (recentChats.chats) {
				let _recentChats = [...recentChats.chats]
				let sorted = []

				let lastSents = [..._recentChats.map((user, i) => {
					return user.lastSent || []
				})].sort((a,b) => b - a)

				lastSents.forEach((a, i) => {
					if (a !== undefined) {
						const find = _recentChats.find(user => user.lastSent === a) 
						find !== undefined && sorted.push(find)
					}
				})
				sorted.forEach((user, i) => {

					let userInUnread = unread.find(unread => unread.username === user.username)

					const userInActiveUsers = 
						state.activeUsers.find(_user => _user.username === user.username)
					if (userInActiveUsers !== undefined) {
						sorted[i] = {
							...user, 
							...userInActiveUsers, 
							unread: userInUnread !== undefined ? userInUnread.count : 0
						}
					}
				})
				state.recentChats = sorted
			} else {state.preload.recentChats = false}
		})
	}
})

export const { setLoginAlert, setComponents, handleSearch, storeProfileInfos,
	afterLogin, addNewUser,	setSelectedUser, afterRegistration, setStatus, hideCount,
	storePrivateChats, retrieveOTM, userDisconnect, storeSocketId, setBio, changeSettings
} = globalPropsSlice.actions
export default globalPropsSlice.reducer