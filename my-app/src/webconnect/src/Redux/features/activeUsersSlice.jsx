import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchActiveUsers = createAsyncThunk(
	'fetchActiveUsers', 
	async (id) => {
		const response = await fetch(`/api/users/${id}`)
		if (response.ok) {
			const users = await response.json()
			return users
		}
	}
)

const initialState = {
	activeUsers: [],
	showActiveUsersLoader: false
}

const activeUsersSlice = createSlice({
	name: 'activeUsers',
	initialState,
	reducers: {
		search: (state, action) => {
			
		},
		setActiveOnline: (state, action) => {
			const users = action.payload
			state.activeUsers.sort((a, b) => {
				if (a.username.toUpperCase() < b.username.toUpperCase()) return -1
				if (a.username.toUpperCase() > b.username.toUpperCase()) return 1
			})
			users.forEach(user => {
				const index = state.activeUsers.findIndex(i => i.username === user.username)
				if (index !== -1) {
					state.activeUsers[index].online = true
					let spliced = state.activeUsers.splice(index, 1)
					state.activeUsers.unshift(...spliced)
				}
			})

			
		},
		setActiveDisconnect: (state, action) => {
			const {username} = action.payload
			const index = state.activeUsers.findIndex(i => i.username === username)
			if (index !== -1) {
				state.activeUsers[index].online = false
			}
		}
	},
	extraReducers: builder => {
		builder.addCase(fetchActiveUsers.pending, (state, action) => {
			state.showActiveUsersLoader = true
		})
		.addCase(fetchActiveUsers.fulfilled, (state, action) => {
			action.payload.users.forEach(i => i.online = false)
			state.activeUsers = action.payload.users
			state.showActiveUsersLoader = false
		})
	}
})

export const {
	search,
	setActiveOnline,
	setActiveDisconnect
} = activeUsersSlice.actions

export default activeUsersSlice.reducer