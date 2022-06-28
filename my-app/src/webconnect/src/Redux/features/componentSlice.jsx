import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	component: {
		rightPane: false,
		leftPane: true,
		profile: false,
		stack: {
			recentChats: false,
			activeUsers: false,
			settings: false,
			resetPassword: false,
			contactInfo: true,
			privacy: false,
		}
		
	},
}

const componentSlice = createSlice({
	name: 'components',
	initialState,
	reducers: {
		setComponents: (state, action) => {
			const {component, value} = action.payload
			const leftPaneComponents = state.component.stack

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