import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchAccountData = createAsyncThunk(
	'fetchAccountData',
	async (id) => {
		const response = await fetch(`user/accountData/${id}`)
		return response.json()
	}
)

const initialState = {
	account: {
		...JSON.parse(localStorage.getItem('details')),
		socketId: '',
		online: '',
		bio: '',
		socials: [],
		privacy: JSON.parse(localStorage.getItem('privacy')) || {
			email: true,
			Twitter: true,
			Facebook: true,
			Instagram: true
		},
		settings: JSON.parse(localStorage.getItem('settings')) || {
			notifications: true,
			sound: true,
		}
	}
}

const accountSlice = createSlice({
	name: 'account',
	initialState,
	reducers: {
		setOnline: (state, action) => {
			state.account.online = action.payload
		},
		updateSettings: (state, action) => {
			const payload = action.payload
			state.account.settings = {...state.account.settings, ...payload}
			localStorage.setItem('settings', JSON.stringify(state.account.settings))
		},
		updateSocial: (state, action) => {
			state.account.socials = [...action.payload]
		},
		updatePrivacy: (state, action) => {
			localStorage.setItem('privacy', JSON.stringify({ ...state.account.privacy, ...action.payload}))
			state.account.privacy = {...state.account.privacy, ...action.payload}
		}
	},
	extraReducers: builder => {
		builder.addCase(fetchAccountData.fulfilled, (state, action) => {
			state.account = {...state.account, ...action.payload}
		})
	}

})

export const {
	updateSettings,
	updateSocial,
	setOnline,
	updatePrivacy
} = accountSlice.actions

export default accountSlice.reducer