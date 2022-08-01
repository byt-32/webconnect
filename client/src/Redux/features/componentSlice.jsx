import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	rightPane: false,
	leftPane: true,
	profile: false,
	stack: {
		recentChats: true,
		activeUsers: false,
		settings: false,
		resetPassword: false,
		contactInfo: false,
		newGroup: false
	}
		
}

const componentSlice = createSlice({
	name: 'components',
	initialState,
	reducers: {
		setComponents: (state, action) => {
			const {component, value} = action.payload
			const leftPaneComponents = state.stack

			if (component === 'leftPane' 
				|| component === 'rightPane' 
				|| component === 'profile') 
			{
				state[`${component}`] = value
			} else {
				for (let val in leftPaneComponents) {
					if (val === component) {
						leftPaneComponents[val] = true
					} else {
						leftPaneComponents[val] = false
					}
				}
			}

		},
	}
})

export const {
	setComponents
} = componentSlice.actions

export default componentSlice.reducer