import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedUser, assertFetch } from '../../../Redux/features/otherSlice'
import { fetchMessages } from '../../../Redux/features/chatSlice'
import { resetUnread } from '../../../Redux/features/recentChatsSlice'

import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'

import UserAvatar from '../UserAvatar'

import { socket } from '../Main'

const useStyles = makeStyles({
	listItem: {
		position: 'relative',
		'& .MuiAvatar-root': {
			width: 45, height: 45
		},
		'& .MuiListItemText-root': {
			marginLeft: '.3rem'
		}
	},
	unread: {
		borderRadius: '100%',
		minWidth: 20,
		minHeight: 20,
		background: '#6495ed',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: '#fff',
		fontsize: '.8rem',
		// padding: 3
	},
	typingStatus: {
		color: '#6495ed'
	}
})

const UserList = ({user, style, secondaryItems}) => {
	const {id, username} = JSON.parse(localStorage.getItem('details'))
	const classses = useStyles()
	const dispatch = useDispatch()
	const selectedUser = useSelector(state => state.other.currentSelectedUser)
	const selectedUsersArr = useSelector(state => state.other.fetched)
	const handleClick = () => {

		if (selectedUser.username !== user.username) {
				
			if (user.unread > 0) {
				dispatch(resetUnread(user.username))
				socket.emit('chatIsRead', user.username, username)
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
	      		primary={user.username} 
	      		secondary={
	      			user.typing && <span className={classses.typingStatus}> {'typing...'} </span>
	      		}
	      	/>
		     { (user.unread !== 0 && user.unread) &&
		     	<div className={classses.unread} > {user.unread} </div>
		     }
	    </ListItem>
    </Link>
	)
}

export default UserList