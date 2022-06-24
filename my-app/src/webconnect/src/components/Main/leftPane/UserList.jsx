import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
	setSelectedUser, 
	setComponents, 
	handleReply, 
	hideCount 
} from '../../../Redux/globalPropsSlice'

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
			width: 48, height: 48
		},
		'& .MuiListItemText-root': {
			marginLeft: '.3rem'
		}
	}
})

const UserList = ({user, style, secondaryItems}) => {
	const classses = useStyles()
	const dispatch = useDispatch()
	const selectedUser = useSelector(state => state.globalProps.currentSelectedUser)
	// const userInRecent = useSelector(state => state.globalProps.recentChats.find(_user => _user.username === user.username))
	const token = useSelector(state => state.globalProps.user.contacts.id)
	// const setSelected = args => {
	// 	if (selectedUser.username !== args.username) {
	// 		if (userInRecent !== undefined) {
	// 			if (userInRecent.unread !== 0) {
	// 				fetch(`/resetUnread/${token}/${user.username}`)
	// 			}
	// 		}
	// 		dispatch(setSelectedUser(args))
	// 	}
	// }
	const setComp = (obj) => {
		dispatch(setComponents(obj))
	}
	return (
		<Link to='chat'>
			<ListItem	button 
				className={classses.listItem}
				selected={user.username === selectedUser.username}
	  		onClick={() => {
	  		 setSelected(user)
	  		}}>
	    		<ListItemIcon>
			      <UserAvatar 
				      username={user.username} 
				      badge={user.status === 'online' ? true : false}
				      status={user.status}
				     />
			    </ListItemIcon>
	      	<ListItemText primary={user.username} />
	    </ListItem>
    </Link>
	)
}

export default UserList