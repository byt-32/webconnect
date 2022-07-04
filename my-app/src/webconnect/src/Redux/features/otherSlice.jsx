import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	fetched: [],
	currentSelectedUser: {}
}

const otherSlice = createSlice({
	name: 'other',
	initialState,
	reducers: {
		setSelectedUser: (state, action) => {
			state.currentSelectedUser = action.payload
		},
		assertFetch: (state, action) => {
			const username = action.payload
			state.fetched.push(username)
		},
	},
})

export const {
	setSelectedUser,
	assertFetch,
} = otherSlice.actions

export default otherSlice.reducer