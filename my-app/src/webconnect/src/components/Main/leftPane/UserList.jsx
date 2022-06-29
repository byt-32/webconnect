import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedUser } from '../../../Redux/features/otherSlice'
import { fetchMessages } from '../../../Redux/features/chatSlice'

import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'

import UserAvatar from '../UserAvatar'

const useStyles = makeStyles({
	listItem: {
		'& .MuiAvatar-root': {
			width: 45, height: 45
		},
		'& .MuiListItemText-root': {
			marginLeft: '.3rem'
		}
	}
})

const UserList = ({user, style, secondaryItems}) => {
	const {id} = JSON.parse(localStorage.getItem('details'))
	const classses = useStyles()
	const dispatch = useDispatch()
	const selectedUser = useSelector(state => state.other.currentSelectedUser)
	const handleClick = () => {
		if (selectedUser.username !== user.username) {
				// if (userInRecent.unread !== 0) {
				// 	fetch(`/resetUnread/${token}/${user.username}`)
				// }
			dispatch(setSelectedUser(user))
			dispatch(fetchMessages({friendsName: user.username, token: id}))
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
	      	<ListItemText primary={user.username} />
	    </ListItem>
    </Link>
	)
}

export default UserList