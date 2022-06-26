import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const fetchAccountData = createAsyncThunk(
	'fetchAccountData',
	async (id) => {
		const response = await fetch(`user/accountData/${id}`)

	}
)

const initialState = {
	account: {
		login: JSON.parse(localStorage.getItem('details')),
		socketId: '',
		status: '',
		bio: '',
		settings: JSON.parse(localStorage.getItem('settings')) || {
			notifications: true,
			privacy: {
				gmail: true
			}
		}
	},
}

const accountSlice = createSlice({
	name: 'account',
	initialState,
	reducers: {
		changeSettings: (state, action) => {
			const payload = action.payload
			state.account.settings = {...payload}
			localStorage.setItem('settings', JSON.stringify(state.account.settings))
		},
	},
	extraReducers: builder => {
		builder.addCase(fetchAccountData.fulfilled, (state, action) => {

		})
	}

})

export const {
	changeSettings
} = accountSlice.actions

export default accountSlice.reducer