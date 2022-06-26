import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	currentSelectedUser: {}
}

const otherSlice = createSlice({
	name: 'other',
	initialState,
	reducers: {
		setSelectedUser: (state, action) => {
			state.currentSelectedUser = action.payload
		},
	},
})

export const {
	setSelectedUser
} = otherSlice.actions

export default otherSlice.reducer