import React from 'react'
import shado from 'shado'

import { useSelector, useDispatch } from 'react-redux'
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { setComponents} from '../../../Redux/features/componentSlice'
import Preloader from '../../Preloader'

import { setSelectedUser, assertFetch } from '../../../Redux/features/otherSlice'
import { fetchMessages } from '../../../Redux/features/chatSlice'
import { resetUnread } from '../../../Redux/features/recentChatsSlice'

import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import { Link } from 'react-router-dom'
import {CSSTransition } from 'react-transition-group'

import Header from '../Header'
import UserAvatar from '../UserAvatar'
import { socket } from '../Main'
import { getLastSeen, assert } from '../../../lib/script'


const useStyles = makeStyles({
	backBtn: {
		fontSize: '1.2rem !important',
	},	
	searchbar: {
		width: '100%',
		marginLeft: 20,
		alignSelf: 'stretch',
		'& .MuiInputBase-root': {height: '100%'}

	},
	arrow: {
		textAlign: 'right',
		cursor: 'pointer'
	},
	listItem: {
		position: 'relative',
		'& .MuiAvatar-root': {
			width: 45, height: 45
		},
		'& .MuiListItemText-root': {
			marginLeft: '.3rem'
		}
	},
})

const UserList = ({user, style, secondaryItems}) => {
	const {id, username} = JSON.parse(localStorage.getItem('details'))
	const classses = useStyles()
	const dispatch = useDispatch()
	const selectedUser = useSelector(state => state.other.currentSelectedUser)
	const selectedUsersArr = useSelector(state => state.other.fetched)
	const find = useSelector(state => state.recentChats.recentChats).find(i => i.username === user.username)
	const [timer, setTimer] = React.useState(null)
	const [secondaryText, setText] = React.useState('')

	React.useEffect(() => {
		if (user.online) {
			setText('')
		} else {
			setText('last seen ' + getLastSeen(user.lastSeen))
		}
		// if(!user.online) {
		// 	setDate(getLastSeen( user.lastSeen))
		// 	const newTimer = setInterval(() => {
		// 		setDate(getLastSeen( user.lastSeen))
		// 	}, 50000)

		// 	setTimer(newTimer)
		// }

		return () => clearInterval(timer)
	}, [])

	React.useEffect(() => {
		if (user.online) {
			setText('')
		} else {
			setText('last seen ' + getLastSeen(user.lastSeen))
		}
	}, [user.online])

	const handleClick = () => {

		if (selectedUser.username !== user.username) {
			if (window.innerWidth < 660 ) {
				dispatch(setComponents({component: 'leftPane', value: false}))
			}
			if (find !== undefined) {
				if (find.unread > 0) {
					dispatch(resetUnread(user.username))
					socket.emit('chatIsRead', user.username, username)
				}
			}
			
			if (selectedUsersArr.find(i => i === user.username) !== undefined) {
				dispatch(setSelectedUser(user))
				
			} else {
				dispatch(assertFetch(user.username))
				dispatch(
					fetchMessages({friendsName: user.username, token: id})
				).then(() => {
					dispatch(setSelectedUser(user))

				})
			}
			
		}
	}
	return (
		<Link to='chat'>
			<ListItem	button 
				className={classses.listItem}
				selected={user.username === selectedUser.username}
	  		onClick={handleClick}>
	    		<ListItemIcon>
			      <UserAvatar
				      username={user.username} 
				      badge={user.online ? true : false}
				     />
			    </ListItemIcon>
	      	<ListItemText 
	      		primary={<Typography component='h6' style={{fontFamily: 'Roboto'}}> {user.username}</Typography>} 
	      		secondary={user.lastSeen && secondaryText}
	      	/>
	    </ListItem>
    </Link>
	)
}


const ActiveUsers = ({className}) => {
	const { useEffect } = React
	const classes = useStyles()
	const dispatch = useDispatch()
	const activeUsers = useSelector(state => state.activeUsers.activeUsers)
	const showLoader = useSelector(state => state.activeUsers.showActiveUsersLoader)

	const setComponent = () => {
		dispatch(setComponents({component: 'recentChats', value: true}))
	}
	return (
			<section className={[classes.activeUsers, className].join(' ')}>
				<Header>
					<IconButton onClick={setComponent} >
						<KeyboardBackspaceIcon />
					</IconButton>

					<InputBase
						className={classes.searchbar}
			      placeholder='@user'
			      type="text"
			    />

				</Header>
				<div className={classes.userslist}>
					{
						showLoader ? <Preloader /> : 
						activeUsers.map(user => {
							return (
								<UserList user={user} key={user.username} />
							)
						})
					}
				</div>
			</section>
	)
}
export default ActiveUsers