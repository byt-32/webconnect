import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchActiveUsers = createAsyncThunk(
	'fetchActiveUsers', 
	async (id) => {
		const response = await fetch(`/api/users/${id}`)
		if (response.ok) {
			const users = await response.json()
			console.log(users)
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
	reducer: {
		search: (state, action) => {
			
		}
	},
	extraReducers: builder => {
		builder.addCase(fetchActiveUsers.pending, (state, action) => {
			state.showActiveUsersLoader = true
		})
		.addCase(fetchActiveUsers.fulfilled, (state, action) => {
			state.activeUsers = action.payload.users
			state.showActiveUsersLoader = false
		})
	}
})

export const {
	search
} = activeUsersSlice.actions

export default activeUsersSlice.reducer