import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { storeSocketId, setStatus, handleReply,
	fetchMessages, 
	addNewUser, storePrivateChats, updateChatStatus,
	userDisconnect, fetchInitialData } from '../../Redux/globalPropsSlice'
import { io } from 'socket.io-client'
// import addNotification from 'react-push-notification';
import { Outlet } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import LeftPane from './leftPane/LeftPane'
import RightPane from './rightPane/RightPane'

const socket = io('/', {autoConnect: false})

const useStyles = makeStyles({
	main: {
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
		socket.connect()
		dispatch(fetchInitialData(id))
	}, [])

	return (
		<section className={classes.main} >
			<LeftPane />
			<RightPane />
		</section>
	)
}

export default Main