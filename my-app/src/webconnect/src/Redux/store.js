import { configureStore } from '@reduxjs/toolkit'
import globalPropsSlice from './globalPropsSlice'

const store = configureStore({
	reducer: {
		globalProps: globalPropsSlice
	}
})

export default store

