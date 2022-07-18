import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchAccountData = createAsyncThunk(
	'fetchAccountData',
	async (id) => {
		const response = await fetch(`/user/accountData/${id}`)
		return response.json()
	}
)

const initialState = {
	account: {
		showLoader: true,
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
		setNewSocial: (state, action) => {
			const newSocial = action.payload
			const find = state.account.socials.findIndex(i => i.name === newSocial.name)

			if (find === -1) {
				state.account.socials.push(newSocial)
			} else {
				state.account.socials[find] = newSocial
			}
			localStorage.setItem('socials', JSON.stringify({ ...state.account.socials, ...action.payload}))

		},
		handleDeleteSocial: (state, action) => {
			const social = action.payload
			const find = state.account.socials.findIndex(i => i.name === social.name)

			state.account.socials.splice(find)
		},
		editAccountInfo: (state, action) => {
			state.account = {...state.account, ...action.payload}
		}
	},
	extraReducers: builder => {
		builder.addCase(fetchAccountData.fulfilled, (state, action) => {
			state.account = {...state.account, ...action.payload}
			state.account.showLoader = false
		})
	}

})

export const {
	updateSettings,
	setNewSocial,
	setOnline,
	handleDeleteSocial,
	editAccountInfo,
} = accountSlice.actions

export default accountSlice.reducer