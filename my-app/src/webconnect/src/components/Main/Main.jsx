import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import LeftPane from './leftPane/LeftPane'
import ResetPassword from './leftPane/settings/ResetPassword'
import RightPane from './rightPane/RightPane'
import Profile from './rightPane/Profile'
import styles from '../../stylesheet/main.module.css'
import { storeSocketId, setStatus, handleReply,
	fetchMessages, 
	addNewUser, storePrivateChats, updateChatStatus,
	userDisconnect, fetchInitialData } from '../../Redux/globalPropsSlice'
import { io } from 'socket.io-client'
import addNotification from 'react-push-notification';
import { Route, Routes } from 'react-router-dom'
import * as SW from './sw.js'
const socket = io('/', {autoConnect: false})
console.log(SW)
let audio;
if (!document.querySelector('audio')) {
	audio = document.createElement('audio')
	audio.src = '/audio/pop.mp3'
	document.querySelector('body').appendChild(audio)
}

// if (Notification.permission !== 'granted') {
// 	Notification.requestPermission()
// }

// const publicKey = 'BJaEYfMe3Ei35iNTxUtTFK09kzCfvgWxdRsVj-Fg9qUpFH18XAAtVyjot-znZIz2TikBBl1KIW6ZXbShn200Ruw';

// if ('serviceWorker' in navigator) {
// 	send().catch(err => console.log(err))
// }

// async function send() {
// 	console.log('Registring SW')
// 	const register = await navigator.serviceWorker.register(SW, {
// 		scope: '/'
// 	})
// 	console.log('registered SW')

// 	console.log('Registering push')

// 	const sub = await register.pushManager.subscribe({
// 		userVisibleOnly: true,
// 		applicationServerKey: publicKey
// 	})
// 	await fetch('/subscribe', {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json'
// 		},
// 		body: JSON.stringify(sub),
// 	})
// 	console.log('push sent')
// }

const Main = () => {
	const dispatch = useDispatch()
	const contacts = useSelector(state => state.globalProps.user.contacts)
	const status = useSelector(state => state.globalProps.user.status)
	const OTM = useSelector(state => state.globalProps.oneTimeMessage)
	const components = useSelector(state => state.globalProps.components)
	const selectedUser = useSelector(state => state.globalProps.currentSelectedUser)
	const chatUpdate = useSelector(state => state.globalProps.chatUpdate)
	const recentChats = useSelector(state => state.globalProps.recentChats)
	const reply = useSelector(state => state.globalProps.reply)
	const userInChats = useSelector(state => state.globalProps.privateChats.findIndex(chat => chat.username === selectedUser.username))

	const notify = useSelector(state => state.globalProps.user.settings.notifications)

	React.useEffect(() => {
		if (sessionStorage.getItem('refresh') == 'false') {
			document.location.pathname = ''
		}
		sessionStorage.setItem('refresh', 'true')
		dispatch(fetchInitialData(contacts.id))
	}, [])

	React.useEffect(() => {
		if (Object.keys(selectedUser).length > 0) {
			if (userInChats === -1) {
				dispatch(fetchMessages({friendsName: selectedUser.username, token: contacts.id}))
			}
		}
	}, [selectedUser])

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

	React.useEffect( () => {
		if(OTM.input !== '') {
			socket.emit('sendMessage', 
				selectedUser.username, 
				contacts.id, 
				contacts.username, 
				OTM.input,
				OTM.chatId,
				reply,
				new Date().toLocaleTimeString('en-US', {hour12: true, hour: '2-digit', minute: '2-digit'},
			))
			dispatch(handleReply({open: false, to: '', person: '', chatId: ''}))
		}
	}, [OTM])

	React.useEffect(() => {
		if (Object.keys(chatUpdate).length > 0) {
			socket.emit('updateChatStatus', 
				chatUpdate.socketId, 
				chatUpdate.username, 
				contacts.username, 
				chatUpdate.unread
			)
		}
	}, [chatUpdate])

	React.useEffect(() => {
	 	selectedUser.token !== undefined && socket.emit('typing', 
	 		contacts.id, 
	 		selectedUser.id, 
	 		{typing: contacts.typing})

	 }, [contacts.typing])

	socket.off('connect_error').on('connect_error', (err) => status !== 'offline' && dispatch(setStatus('offline')))

	socket.off('disconnect').on('disconnect', () => {
		dispatch(setStatus('offline'))
	})

	socket.off('user disconnect').on('user disconnect', (username, socketId) => {
		dispatch(userDisconnect({
			username: username, 
			socketId: socketId
		}))
	})

	socket.off('chatIsSeen').on('chatIsSeen', (friendName, unreadLen) => {
		dispatch(updateChatStatus({
			username: friendName, 
			count: unreadLen
		}))
	})

	socket.off('users').on('users', users => {
		dispatch(addNewUser(users))
	})

	socket.off('sentFromSocket').on('sentFromSocket', (username, message, chatId, reply) => {
		if (!components.rightPane) {
			if(notify) {
				// navigator.serviceWorker.getRegistration().then(function(reg) {
		  //     reg.showNotification('Hello world!');
		  //   })
			}
			audio.play()
		}
		if (userInChats === -1) {
			dispatch(storePrivateChats({
				username: username, message: message, me: false, chatId: chatId, reply: reply
			}))
			dispatch(fetchMessages({friendsName: username, token: contacts.id}))
		} else {
			dispatch(storePrivateChats({
				username: username, message: message, me: false, chatId: chatId, reply: reply
			}))
		}
		
		if (Object.keys(selectedUser).length === 0) {
			const find = recentChats.find(user => user.username === username)
			if (find !== undefined) {
				fetch(`/saveUnread/${contacts.id}/${contacts.username}/${find.username}/${find.unread}`)
			}
		} else {
			if (selectedUser.username !== username) {
				fetch(`/saveUnread/${contacts.id}/${contacts.username}/${find.username}/${find.unread}`)
			}
		}
	})

	return (
		<section className={styles.main}>
			{components.leftPane && <LeftPane /> }
			{components.rightPane && <RightPane /> }
			{components.profile && <Profile /> }
		</section>
	)
}

export default Main