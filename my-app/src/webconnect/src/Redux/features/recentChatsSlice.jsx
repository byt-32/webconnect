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
	reducer: {
		search: (state, action) => {

		}
	},
	extraReducers: builder => {
		builder.addCase(fetchRecentChats.pending, (state, action) => {
			state.showRecentUsersLoader = true
		})
		.addCase(fetchRecentChats.fulfilled, (state, action) => {
			state.showRecentUsersLoader = false
			state.recentChats = action.payload.chats

		})
	}
})

export const {
	search
} = recentChatsSlice.actions

export default recentChatsSlice.reducer