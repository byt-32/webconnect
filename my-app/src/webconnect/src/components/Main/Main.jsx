import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
// import addNotification from 'react-push-notification';
import { Outlet } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import {fetchRecentChats, setRecentOnline, setRecentDisconnect, setUnread, 
	handleUserTypingActivity, updateRecentChats, syncRecentsWithDeleted, syncRecentsWithRead} from '../../Redux/features/recentChatsSlice'
import { fetchActiveUsers, setActiveOnline, setActiveDisconnect } from '../../Redux/features/activeUsersSlice'

import { fetchAccountData, setOnline } from '../../Redux/features/accountSlice'

import { storeReceivedChat, setChatRead, handleStarredChat, performChatDelete } from '../../Redux/features/chatSlice'

import { setDisconnectedUsers, setOnlineUsers } from '../../Redux/features/otherSlice'

import { assert } from '../../lib/script'
import LeftPane from './leftPane/LeftPane'

export const socket = io('/', {autoConnect: false})

const useStyles = makeStyles({
	main: {
		background: grey[200] ,
		display: 'flex',
		height: '100%'
	}
})

const Main = () => {
	const myWorker = new Worker('./workers/worker.js')

	myWorker.postMessage('hi')

	const {id, username} = JSON.parse(localStorage.getItem('details'))
	const classes = useStyles()
	const dispatch = useDispatch()
	const selectedUser = useSelector(state => state.other.currentSelectedUser)
	const {leftPane} = useSelector(state => state.components)
	const { useEffect } = React

	useEffect(() => {
		socket.auth =  {
			token: id,
			username: username
		}
		socket.connect()

		// emit 'getOnlineUsers after fetch to prevent conflict'
		dispatch(fetchRecentChats(id)).then(() => socket.emit('getOnileUsers'))
		dispatch(fetchActiveUsers(id)).then(() => socket.emit('getOnileUsers'))
		dispatch(fetchAccountData(id))
	}, [])

	socket.on('connect', () => {
		dispatch(setOnline(true))
	})
	socket.on('disconnect', reason => {
		dispatch(setOnline(false))
	})

	socket.off('onlineUsers').on('onlineUsers', users => {
		dispatch(setRecentOnline(users.filter(user => user.username !== username)))
		dispatch(setActiveOnline(users.filter(user => user.username !== username)))
		dispatch(setOnlineUsers(users.filter(user => user.username !== username)))
	})
	socket.off('userDisconnect').on('userDisconnect', user => {
		dispatch(setActiveDisconnect(user))
		dispatch(setRecentDisconnect(user))
		dispatch(setDisconnectedUsers(user))
	})

	socket.off('starredChat').on('starredChat', (starredBy, starredChat) => {
		dispatch(handleStarredChat({friendsName: starredBy, starredChat}))
	})
	socket.off('deleteChat').on('deleteChat', obj => {
		dispatch(performChatDelete(obj))
		dispatch(syncRecentsWithDeleted(obj))
	})

	socket.off('chatFromUser').on('chatFromUser', chat => {
		dispatch(storeReceivedChat(chat))
		dispatch(updateRecentChats({
			username: chat.sentBy,
			lastSent: chat.message.chatId,
			online: true,
			messages: chat.message,
		}))

		if (!assert(selectedUser) || selectedUser.username !== chat.sentBy) {
			socket.emit('saveUnread', chat.sentBy, username, chat.message.chatId, () => {})
			dispatch(setUnread({friendsName: chat.sentBy, chatId: chat.message.chatId}))
		}
		if (assert(selectedUser) && selectedUser.username === chat.sentBy) {
			socket.emit('chatIsRead', selectedUser.username, username)
		}
	})

	socket.off('chatHasBeenRead').on('chatHasBeenRead', (sender, receiver) => {
		dispatch(setChatRead(receiver))
		dispatch(syncRecentsWithRead(receiver))
	})

	socket.off('userIsTyping').on('userIsTyping', obj => {
		dispatch(handleUserTypingActivity(obj))
	})

	return (
		<section className={classes.main} >
			{leftPane && <LeftPane />}
			<Outlet />
		</section>
	)
}

export default Main