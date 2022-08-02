import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchGroupChats = createAsyncThunk('fetchGroupChats', 
	async ({token, groupName, groupId}) => {
		const response = await fetch(`/chat/fetchGroupChats/${token}/${groupName}/${groupId}`)
		if (response.ok) {
			const messages = await response.json()
			return messages
		}
	}
)

const initialState = {
	selectedUsers: [],
	selectedGroup: {},
	groupChats: [],
	fetched: []
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
		setSelectedGroup: (state, action) => {
			state.selectedGroup = action.payload
		},
		
		unselectUser: (state, action) => {
			const {username} = action.payload
			const find = state.selectedUsers.findIndex(i => i.username === username)
			if (find !== -1) {
				state.selectedUsers.splice(find ,1)
			}
		},
		deleteFetched: (state, action) => {
			const {groupId} = action.payload
			const find = state.fetched.findIndex(i => i.group.groupId === groupId)
			if (find !== -1) {
				state.fetched.splice(find, 1)
			}
		},
		setFetched: (state, action) => {
			state.fetched.push(action.payload)
		}
	},
	extraReducers: builder => {
		builder.addCase(fetchGroupChats.fulfilled, (state, action) => {
			state.groupChats.push(action.payload)
		})
	}

})

export const {
	addGroupUser,
	unselectUser,
	setSelectedGroup,
	deleteFetched,
	setFetched
} = groupSlice.actions

export default groupSlice.reducer