import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
// import addNotification from 'react-push-notification';
import { Outlet } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import {fetchRecentChats} from '../../Redux/features/recentChatsSlice'
import { fetchActiveUsers } from '../../Redux/features/activeUsersSlice'

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
	const {id} = JSON.parse(localStorage.getItem('details'))
	const classes = useStyles()
	const dispatch = useDispatch()
	const { useEffect } = React
	useEffect(() => {
		dispatch(fetchRecentChats(id))
		dispatch(fetchActiveUsers(id))
		// socket.connect()
	}, [])

	return (
		<section className={classes.main} >
			<LeftPane />
			<Outlet />
		</section>
	)
}

export default Main