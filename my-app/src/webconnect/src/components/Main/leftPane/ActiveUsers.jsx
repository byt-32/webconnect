import React from 'react'
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

import Header from './Header'
import UserAvatar from '../UserAvatar'
import { socket } from '../Main'


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

	const handleClick = () => {

		if (selectedUser.username !== user.username) {
				
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
	      		primary={<Typography component='h6'> {user.username}</Typography>} 
	      	/>
	    </ListItem>
    </Link>
	)
}


const ActiveUsers = () => {
	const { useEffect } = React
	const classes = useStyles()
	const dispatch = useDispatch()
	const activeUsers = useSelector(state => state.activeUsers.activeUsers)
	const showLoader = useSelector(state => state.activeUsers.showActiveUsersLoader)

	const setComponent = () => {
		dispatch(setComponents({component: 'recentChats', value: true}))
	}
	return (
		<>
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
		</>
	)
}
export default ActiveUsers