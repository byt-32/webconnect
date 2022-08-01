import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


const initialState = {
	selectedUsers: [],
}

const groupSlice = createSlice({
	name: 'groups',
	initialState,
	reducers: {
		addGroupUser: (state, action) => {
			const {username} = action.payload
			const find = state.selectedUsers.findIndex(i => i.username === username)
			if (find === -1) {
				state.selectedUsers.push({username})
			}
		},
		unselectUser: (state, action) => {
			const {username} = action.payload
			const find = state.selectedUsers.findIndex(i => i.username === username)
			if (find !== -1) {
				state.selectedUsers.splice(find ,1)
			}
		}
	}

})

export const {
	addGroupUser,
	unselectUser
} = groupSlice.actions

export default groupSlice.reducer