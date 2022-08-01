import { configureStore } from '@reduxjs/toolkit'
import accountSlice from './features/accountSlice'
import chatSlice from './features/chatSlice'
import componentSlice from './features/componentSlice'
import recentChatsSlice from './features/recentChatsSlice'
import activeUsersSlice from './features/activeUsersSlice'
import groupSlice from './features/groupSlice'
import otherSlice from './features/otherSlice'

const store = configureStore({
	reducer: {
		account: accountSlice,
		chat: chatSlice,
		groups: groupSlice,
		components: componentSlice,
		recentChats: recentChatsSlice,
		activeUsers: activeUsersSlice,
		other: otherSlice,
	}
})

export default store

