import React from 'react'
import styles from '../../../stylesheet/main.module.css'
import IconButton from '@material-ui/core/IconButton'
import { useSelector, useDispatch } from 'react-redux'

import {setComponents} from '../../../Redux/features/componentSlice'

import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem';
import InputBase from '@material-ui/core/InputBase'

import GroupIcon from '@material-ui/icons/Group'
import MenuIcon from '@material-ui/icons/Menu'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications'

import { setSelectedUser, assertFetch } from '../../../Redux/features/otherSlice'
import { fetchMessages } from '../../../Redux/features/chatSlice'
import { resetUnread } from '../../../Redux/features/recentChatsSlice'

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'

import UserAvatar from '../UserAvatar'	
import { Link } from 'react-router-dom'
import Preloader from '../../Preloader'

import { socket } from '../Main'

import Header from './Header'

const useStyles = makeStyles({
	add: {
		fontSize: '2.9rem !important'
	},
	menu: {
		'& div': {
			top: '58px !important'
		},
		'& .MuiListItemIcon-root': {
			minWidth: 40
		}
	},
	searchbar: {
		width: '100%',
		marginLeft: 20,
		alignSelf: 'stretch',
		'& .MuiInputBase-root': {height: '100%'}

	},
	listItem: {
		position: 'relative',
		padding: '12px 15px',
		'& .MuiAvatar-root': {
			width: 45, height: 45
		},
		'& .MuiListItemText-root': {
			marginLeft: '.3rem',
			'& .MuiListItemText-secondary': {
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				paddingInlineEnd: 10
			}
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
	},
	lastChat: {
		color: 'initial',
		'& span': {
			color:' #9d9d9d'
		}
	}
	
})

const UserList = ({user, style, secondaryItems}) => {
	const {id, username} = JSON.parse(localStorage.getItem('details'))
	const {useState, useEffect} = React
	const classses = useStyles()
	const dispatch = useDispatch()
	const selectedUser = useSelector(state => state.other.currentSelectedUser)
	const fetchedUsers = useSelector(state => state.other.fetched)

	const handleClick = () => {

		if (selectedUser.username !== user.username) {
				
			if (user.unread > 0) {
				dispatch(resetUnread(user.username))
				socket.emit('chatIsRead', user.username, username)
			}
			if (fetchedUsers.find(i => i === user.username) !== undefined) {
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
	      			user.typing ?
	      				<span className={classses.typingStatus}> {'typing...'} </span>
	      			: <span className={classses.lastChat}
	      				> 
	      					{user.messages.sentBy === username && 
	      						<span style={{fontWeight: 'bold'}}> {'You: '} </span> 
	      					} 
	      					 <span style={{fontStyle: 'italic'}}> {user.messages.message} </span>
	      				</span>
	      		}
	      	/>
		     { (user.unread !== 0 && user.unread) &&
		     	<div className={classses.unread} > {user.unread} </div>
		     }
	    </ListItem>
    </Link>
	)
}

const RecentChats = () => {
	const { useEffect } = React
	const classes = useStyles()
	const dispatch = useDispatch()
	const [anchorEl, setAnchorEl] = React.useState(null)
	const open = Boolean(anchorEl)
	const toggleMenu = (event) => {
		setAnchorEl(event.target)
	}
	const handleClose =() => {
		setAnchorEl(null)
	}

	const recentChats = useSelector(state => state.recentChats.recentChats)
	const showLoader = useSelector(state => state.recentChats.showRecentUsersLoader)

	const setComp = (obj) => {
		dispatch(setComponents(obj))
	}
	
	const performSearch = (searchVal) => {
		dispatch(handleSearch({input: searchVal, component: 'recentChats'}))
	}
	return (
		<>
			<Header>
				<IconButton onClick={toggleMenu} >
					<MenuIcon />
				</IconButton>
				<Menu open={open} 
				  transformOrigin={{
				    vertical: 'top',
				    horizontal: 'left',
				  }}
					onClose={handleClose} anchorEl={anchorEl} className={classes.menu} >
						<MenuItem onClick={() => { 
							handleClose()
							setComp({component: 'activeUsers', value: true})
						}} >
							<Typography variant='inherit'> users </Typography>
						</MenuItem>
						<MenuItem onClick={() => { 
							handleClose()
							setComp({component: 'settings', value: true})
						}} >
							<Typography variant='inherit'> profile </Typography>
						</MenuItem>
				</Menu>
				<InputBase
					className={classes.searchbar}
		      placeholder='@user'
		      type="text"
		    />

			</Header>
			<div className={classes.userslist}>
				{
					showLoader ? <Preloader /> : 
					recentChats.map((user, i) => {
						return (
							<UserList user={user} key={i} />
						)
					})
				}
			</div>
			
		</>

	)
}

export default RecentChats