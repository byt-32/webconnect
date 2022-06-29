import { configureStore } from '@reduxjs/toolkit'
import accountSlice from './features/accountSlice'
import chatSlice from './features/chatSlice'
import componentSlice from './features/componentSlice'
import recentChatsSlice from './features/recentChatsSlice'
import activeUsersSlice from './features/activeUsersSlice'
import otherSlice from './features/otherSlice'
import socketSlice from './features/socketSlice'

const store = configureStore({
	reducer: {
		account: accountSlice,
		chat: chatSlice,
		components: componentSlice,
		recentChats: recentChatsSlice,
		activeUsers: activeUsersSlice,
		other: otherSlice,
		socketSlice: socketSlice
	}
})

export default store

