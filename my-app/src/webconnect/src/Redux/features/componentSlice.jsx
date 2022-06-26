import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	component: {
		rightPane: false,
		leftPane: true,
		profile: false,
		stack: {
			recentChats: true,
			activeUsers: false,
			settings: false,
			resetPassword: false,
			contactInfo: false,
			privacy: false,
		}
		
	},
}

const componentSlice = createSlice({
	name: 'components',
	initialState,
	reducer: {
		setComponents: (state, action) => {
			const {component, value} = action.payload
			const leftPaneComponents = state.components.stack

			if (component === 'leftPane' 
				|| component === 'rightPane' 
				|| component === 'profile') 
			{
				state.components[`${component}`] = value
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