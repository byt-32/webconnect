import { configureStore } from '@reduxjs/toolkit'
// import globalPropsSlice from './globalPropsSlice'
import accountSlice from './features/accountSlice'
import chatSlice from './features/chatSlice'
import componentSlice from './features/componentSlice'
import recentChatsSlice from './features/recentChatsSlice'
import activeUsersSlice from './features/activeUsersSlice'
import otherSlice from './features/otherSlice'

const store = configureStore({
	reducer: {
		account: accountSlice,
		chat: chatSlice,
		components: componentSlice,
		recentChats: recentChatsSlice,
		activeUsers: activeUsersSlice,
		other: otherSlice
		// globalProps: globalPropsSlice
	}
})

export default store

