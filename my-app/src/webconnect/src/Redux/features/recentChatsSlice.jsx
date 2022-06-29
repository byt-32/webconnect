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
			}
		}
	},
	extraReducers: builder => {
		builder.addCase(fetchRecentChats.pending, (state, action) => {
			state.showRecentUsersLoader = true
		})
		.addCase(fetchRecentChats.fulfilled, (state, action) => {
			state.showRecentUsersLoader = false
			state.recentChats = action.payload.chats
			state.recentChats.sort((a, b) => {
				if (a.lastSent < b.lastSent) return -1
				if (a.lastSent > b.lastSent) return 1
			})

		})
	}
})

export const {
	search,
	setRecentOnline,
	setRecentDisconnect
} = recentChatsSlice.actions

export default recentChatsSlice.reducer