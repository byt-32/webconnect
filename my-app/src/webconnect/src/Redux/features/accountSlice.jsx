import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const fetchAccountData = createAsyncThunk(
	'fetchAccountData',
	async (id) => {
		const response = await fetch(`user/accountData/${id}`)

	}
)

const initialState = {
	account: {
		...JSON.parse(localStorage.getItem('details')),
		socketId: '',
		status: '',
		bio: '',
		socials: [],
		privacy: JSON.parse(localStorage.getItem('privacy')) || {
			gmail: true,
			Twitter: true,
			Facebook: true,
			Instagram: true
		},
		settings: JSON.parse(localStorage.getItem('settings')) || {
			notifications: true,
			sound: true,
		}
	},
}

const accountSlice = createSlice({
	name: 'account',
	initialState,
	reducers: {
		updateSettings: (state, action) => {
			const payload = action.payload
			state.account.settings = {...state.account.settings, ...payload}
			localStorage.setItem('settings', JSON.stringify(state.account.settings))
		},
		addSocial: (state, action) => {
			state.account.socials.push(action.payload)
		},
		updateSocial: (state, action) => {
			const {name, link} = action.payload
			const findIndex = state.account.socials.findIndex(social => social.name === name)
			if (findIndex !== -1) {
				state.account.socials[findIndex]  = action.payload
			}
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
	addSocial,
	updateSocial
} = accountSlice.actions

export default accountSlice.reducer