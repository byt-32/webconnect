import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
// import addNotification from 'react-push-notification';
import { Outlet } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import {
	fetchRecentChats, setRecentOnline, setRecentDisconnect, setUnread, 
	updateRecentChats, 
	syncRecentsWithDeleted, 
	addGroup,
	syncRecentsWithRead} from '../../Redux/features/recentChatsSlice'
import { fetchActiveUsers, setActiveOnline, setActiveDisconnect } from '../../Redux/features/activeUsersSlice'

import { fetchAccountData, setOnline } from '../../Redux/features/accountSlice'

import { storeReceivedChat, setChatRead, handleStarredChat, performChatDelete } from '../../Redux/features/chatSlice'

import { setDisconnectedUsers, setOnlineUsers, handleUserTypingActivity } from '../../Redux/features/otherSlice'
import { setComponents} from '../../Redux/features/componentSlice'

import { assert } from '../../lib/script'
import LeftPane from './leftPane/LeftPane'

export const socket = io('/', {autoConnect: false})

const useStyles = makeStyles({
	main: {
		background: 'linear-gradient(266deg, #e9e9e9, #d3920026)' ,
		display: 'flex',
		height: '100%'
	}
})

const Main = () => {
	// const myWorker = new Worker('./workers/worker.js')

	// myWorker.postMessage('hi')

	const {id, username} = JSON.parse(localStorage.getItem('details'))
	const classes = useStyles()
	const dispatch = useDispatch()
	const selectedUser = useSelector(state => state.other.currentSelectedUser)
	const {leftPane, rightPane} = useSelector(state => state.components)
	const activeUsers = useSelector(state => state.activeUsers.activeUsers)

	/** TODO: CLEAR THIS OR REFACTOR, 
			REASON: IT TRIGGERS MULTIPLE DISPATCHES **/
	// window.addEventListener('resize', () => {
	// 	if (window.innerWidth <= 660) {
	// 		if (assert(selectedUser) && leftPane) dispatch(setComponents({component: 'leftPane', value: false}))
	// 	} else if (window.innerWidth > 660) {
	// 		!leftPane && dispatch(setComponents({component: 'leftPane', value: true}))
	// 	}
	// })

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

	socket.off('connect').on('connect', () => {
		dispatch(setOnline(true))
	})
	socket.off('disconnect').on('disconnect', reason => {
		dispatch(setOnline(false))
	})

	socket.off('onlineUsers').on('onlineUsers', users => {
		dispatch(setActiveOnline(users.filter(user => user.username !== username)))
		dispatch(setOnlineUsers(users.filter(user => user.username !== username)))
	})
	socket.off('userDisconnect').on('userDisconnect', user => {
		dispatch(setActiveDisconnect(user))
		dispatch(setDisconnectedUsers(user))
	})

	socket.off('starredChat').on('starredChat', (starredBy, starredChat) => {
		dispatch(handleStarredChat({friendsName: starredBy, starredChat}))
	})
	socket.off('deleteChat').on('deleteChat', obj => {
		dispatch(performChatDelete(obj))
		dispatch(syncRecentsWithDeleted(obj))
	})

	socket.off('addedGroup').on('addedGroup', groupDetails => {
		dispatch(addGroup(groupDetails))
	})

	socket.off('chatFromUser').on('chatFromUser', chat => {
		function handleDispatch() {
			dispatch(storeReceivedChat(chat))
			dispatch(updateRecentChats({
				username: chat.sender,
				lastSent: chat.message.chatId,
				online: true,
				unread: [],
				isStarred: {value: false},
				messages: chat.message,
			}))
		}

		if (activeUsers.find(i => i.username === chat.sender) !== undefined) {
			handleDispatch()
		} else {
			dispatch(fetchActiveUsers(id)).then(() => {
				socket.emit('getOnileUsers')
				handleDispatch()
			})

		}

		if (!assert(selectedUser) || selectedUser.username !== chat.sender) {
			socket.emit('saveUnread', chat.sender, username, chat.message.chatId, () => {})
			dispatch(setUnread({friendsName: chat.sender, chatId: chat.message.chatId}))
		}
		if (assert(selectedUser) && selectedUser.username === chat.sender) {
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