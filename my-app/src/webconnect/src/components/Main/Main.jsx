import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
// import addNotification from 'react-push-notification';
import { Outlet } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import {fetchRecentChats, setRecentOnline, setRecentDisconnect} from '../../Redux/features/recentChatsSlice'
import { fetchActiveUsers, setActiveOnline, setActiveDisconnect } from '../../Redux/features/activeUsersSlice'
import { fetchAccountData, setOnline } from '../../Redux/features/accountSlice'
import { storeReceivedChat } from '../../Redux/features/chatSlice'

import LeftPane from './leftPane/LeftPane'

const socket = io('/', {autoConnect: false})

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
	const OTM = useSelector(state => state.chat.oneTimeMessage)
	const { useEffect } = React

	useEffect(() => {
		if (Object.keys(OTM).length) {
			socket.emit('sentChat', {...OTM, id: id})
		}
	}, [OTM])

	useEffect(() => {
		socket.auth =  {
			token: id,
			username: username
		}
		socket.connect()

		socket.on('connect', () => {
			dispatch(setOnline(true))
		})
		socket.on('disconnect', reason => {
			dispatch(setOnline(false))
		})

		socket.off('getOnileUsers').on('getOnileUsers', users => {
			dispatch(setRecentOnline(users.filter(user => user.username !== username)))
			dispatch(setActiveOnline(users.filter(user => user.username !== username)))
		})
		socket.off('userDisconnect').on('userDisconnect', user => {
			dispatch(setActiveDisconnect(user))
			dispatch(setRecentDisconnect(user))
		})

		socket.off('chatFromUser').on('chatFromUser', chat => {
			dispatch(storeReceivedChat(chat))
		})

		dispatch(fetchRecentChats(id))
		dispatch(fetchActiveUsers(id))
		dispatch(fetchAccountData(id))
	}, [])

	return (
		<section className={classes.main} >
			<LeftPane />
			<Outlet />
		</section>
	)
}

export default Main