import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import LeftPane from './leftPane/LeftPane'
import ResetPassword from './leftPane/settings/ResetPassword'
import RightPane from './rightPane/RightPane'
import Profile from './rightPane/Profile'
import styles from '../../stylesheet/main.module.css'
import { storeSocketId, setStatus,
	addNewUser, storePrivateChats, 
	userDisconnect, fetchInitialData } from '../../Redux/globalPropsSlice'
import { io } from 'socket.io-client'
import { Route, Routes } from 'react-router-dom'
const socket = io('/', {autoConnect: false})
let audio;
if (!document.querySelector('audio')) {
	audio = document.createElement('audio')
	audio.src = '/audio/pop.mp3'
	document.querySelector('body').appendChild(audio)
}
const Main = () => {
	const dispatch = useDispatch()
	const contacts = useSelector(state => state.globalProps.user.contacts)
	const status = useSelector(state => state.globalProps.user.status)
	const OTM = useSelector(state => state.globalProps.oneTimeMessage)
	const components = useSelector(state => state.globalProps.components)
	const reciepient = useSelector(state => state.globalProps.currentSelectedUser)

	const notify = useSelector(state => state.globalProps.user.settings.notifications)

	React.useEffect(() => {
		if (sessionStorage.getItem('refresh') == 'false') {
			document.location.pathname = ''
		}
		sessionStorage.setItem('refresh', 'true')

		dispatch(fetchInitialData(contacts.id))
	}, [])

	if (Notification.permission !== 'granted') {
		Notification.requestPermission()
	}
	React.useEffect(() => {
		if (Object.keys(reciepient).length > 0) {
			const ele = document.querySelectorAll('.Wzm2GKa4C2sh_8jVswOw')
			if (ele.length > 0) {
				setTimeout(() => ele[0].scrollTop = ele[0].scrollHeight, 1000)
			}
		}
	}, [reciepient])

	React.useEffect(() => {
		if (contacts.username !== '') {
			socket.auth = {...socket.auth, username: contacts.username, sessionId: contacts.id}
			socket.connect()
		}
		socket.on('connect', () => {
			setStatus('online')
			dispatch(storeSocketId(socket.id))
		})
	}, [contacts])

	socket.off('connect_error').on('connect_error', (err) => status !== 'offline' && dispatch(setStatus('offline')))

	socket.off('disconnect').on('disconnect', () => {
		dispatch(setStatus('offline'))
	})

	React.useEffect(() => {
	 	reciepient.token !== undefined && socket.emit('typing', contacts.id, reciepient.id, {typing: contacts.typing})
	 }, [contacts.typing])

	socket.off('user disconnect').on('user disconnect', (username, socketId) => {
		dispatch(userDisconnect({username: username, socketId: socketId}))
	})

	socket.off('users').on('users', users => {
		dispatch(addNewUser(users))
	})

	socket.off('sentFromSocket').on('sentFromSocket', (username, message) => {
		if (!components.rightPane) {
			if(notify) {
				const alert = new Notification('1 new message')
			}
			audio.play()
		}
		let me = false;
		username === contacts.username ? me = true : me = false
		dispatch(storePrivateChats({username: username, message: message, me: me}))

	})

	React.useEffect( () => {
		if(OTM !== '') {
			socket.emit('sendMessage', reciepient.username, contacts.id, 
				contacts.username, OTM, 
				new Date().toLocaleTimeString('en-US', {hour12: true, hour: '2-digit', minute: '2-digit'}))
		}
	}, [OTM])
	
	const [height, setHeight] = React.useState(`${window.innerHeight}px`)
  window.onresize = () => {
  	setHeight(`${window.innerHeight}px`)
  }
	return (
		<section className={styles.main} style={{
			height: height
		}} >
			{components.leftPane && <LeftPane /> }
			{components.rightPane && <RightPane /> }
			{components.profile && <Profile /> }
		</section>
	)
}

export default Main