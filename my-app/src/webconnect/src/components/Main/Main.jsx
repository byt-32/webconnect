import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
// import addNotification from 'react-push-notification';
import { Outlet } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import {fetchRecentChats, setRecentOnline, setRecentDisconnect, setUnread, 
	handleUserTypingActivity, updateRecentChats} from '../../Redux/features/recentChatsSlice'
import { fetchActiveUsers, setActiveOnline, setActiveDisconnect } from '../../Redux/features/activeUsersSlice'
import { fetchAccountData, setOnline } from '../../Redux/features/accountSlice'
import { storeReceivedChat, setChatRead } from '../../Redux/features/chatSlice'

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
	const {id, username} = JSON.parse(localStorage.getItem('details'))
	const classes = useStyles()
	const dispatch = useDispatch()
	const selectedUser = useSelector(state => state.other.currentSelectedUser)
	const { useEffect } = React

	useEffect(() => {
		socket.auth =  {
			token: id,
			username: username
		}
		socket.connect()

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
	})
	socket.off('userDisconnect').on('userDisconnect', user => {
		dispatch(setActiveDisconnect(user))
		dispatch(setRecentDisconnect(user))
	})


	socket.off('chatFromUser').on('chatFromUser', chat => {
		dispatch(storeReceivedChat(chat))
		dispatch(updateRecentChats({
			user: chat.sentBy, lastSent: chat.message.chatId, online: true, lastChat: chat.message.message
		}))

		if ((Object.keys(selectedUser).length !== 0 && selectedUser.username !== chat.sentBy) || Object.keys(selectedUser).length === 0) {
			socket.emit('saveUnread', chat.sentBy, username, chat.message.chatId, () => {})
			dispatch(setUnread(chat.sentBy))
		}
		if (Object.keys(selectedUser).length !== 0 && selectedUser.username === chat.sentBy) {
			socket.emit('chatIsRead', selectedUser.username, username)
		}
	})

	socket.off('chatHasBeenRead').on('chatHasBeenRead', (sender, receiver) => {
		dispatch(setChatRead(receiver))
	})

	socket.off('userIsTyping').on('userIsTyping', obj => {
		dispatch(handleUserTypingActivity(obj))
	})

	return (
		<section className={classes.main} >
			<LeftPane />
			<Outlet />
		</section>
	)
}

export default Main