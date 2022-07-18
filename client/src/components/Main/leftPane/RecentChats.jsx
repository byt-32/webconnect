import React from 'react'
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
import Badge from '@material-ui/core/Badge';

import GroupIcon from '@material-ui/icons/Group'
import MenuIcon from '@material-ui/icons/Menu'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications'
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';
import DoneAllIcon from '@material-ui/icons/DoneAll'
import DoneIcon from '@material-ui/icons/Done';

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
import { assert, getLastSeen } from '../../../lib/script'

import { TransitionGroup, CSSTransition } from 'react-transition-group'
import Header from '../Header'

const useStyles = makeStyles({
	add: {
		fontSize: '2.9rem !important'
	},
	menu: {
		'& div': {
			top: '58px !important',
			// background: 'transparent'
		},
		'& .MuiMenuItem-root': {
			paddingRight: 55
			// background: '#ffffffde',
			// backdropFilter: 'blur(7px)'
		},
		'& svg': {
			marginRight: 15,
			color: '#57565c',
			fontSize: '1.5rem'
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
		padding: 12,
		'& .MuiAvatar-root': {
			width: 45, height: 45
		},
		'& .MuiListItemText-root': {
			marginLeft: '.3rem',
			'& .MuiListItemText-secondary': {
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				paddingInlineEnd: 10,
				marginTop: 2
			}
		}
	},
	chatMisc: {
		display: 'flex',
		alignItems: 'flex-end',
		flexDirection: 'column',
		justifyContent: 'center',
		fontSize: '.8rem',
	},
	lastSent: {
		marginBottom: 6,
		color: '#53555e'
	},
	unread: {
		minWidth: 17,
		minHeight: 17,
		background: '#6495ed',
		borderRadius: '100%',
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center',
		color: '#fff',
	},
	typingStatus: {
		color: '#6495ed'
	},
	lastChat: {
		color: 'initial',
		fontSize: '.9rem',
		'& span': {
			color:' #9d9d9d'
		}
	},
	chatRead: {
		'& svg': {
			fontSize: '.8rem',
			position: 'relative',
			top: 2
		}
	},
	
})

const UserList = ({user, style, secondaryItems}) => {
	const {id, username} = JSON.parse(localStorage.getItem('details'))
	const {useState, useEffect} = React
	const classes = useStyles()
	const dispatch = useDispatch()
	const selectedUser = useSelector(state => state.other.currentSelectedUser)
	const fetchedUsers = useSelector(state => state.other.fetched)

	const handleClick = () => {
		if (window.innerWidth < 660 ) {
			dispatch(setComponents({component: 'leftPane', value: false}))
		}
		if (selectedUser.username !== user.username) {
			
			if (assert(user.unread)) {
				dispatch(resetUnread(user.username))
				socket.emit('chatIsRead', user.username, username)
			}
			if (assert(fetchedUsers.find(i => i === user.username))) {
				dispatch(setSelectedUser({username: user.username}))
			} else {
				dispatch(assertFetch(user.username))
				dispatch(
					fetchMessages({friendsName: user.username, token: id})
				).then(() => {
					dispatch(setSelectedUser({username: user.username}))
				})
			}
			
		}
	}
	return (
		<Link to='chat'>
			<ListItem	button 
				className={classes.listItem}
				selected={user.username === selectedUser.username}
	  		onClick={handleClick}>
	    		<ListItemIcon>
			      <UserAvatar
				      username={user.username} 
				      badge={user.online ? true : false}
				     />
			    </ListItemIcon>
	      	<ListItemText 
	      		primary={
	      			<Typography component='h6'> {user.username}</Typography>
	      		} 
	      		secondary={
	      			user.typing ?
	      				<span className={classes.typingStatus}> {'typing...'} </span>
	      			: 
	      				<span className={classes.lastChat}> 
	      					{user.messages.sentBy === username && 
	      						<span className={classes.chatRead}> 
											{user.messages.read ? <DoneAllIcon style={{color: '#00c759'}} /> : <DoneIcon />}
	      						</span> 
	      					} 
	      					 <span> {user.messages.message} </span>
	      				</span>
	      		}
	      	/>
		     	<div className={classes.chatMisc} > 
		     		<span 
		     			className={classes.lastSent} 
		     			style={{color: assert(user.unread) ? '#6495ed' : 'initial'}}
		     		> 
		     			{getLastSeen(user.lastSent)} 
		     		</span>

		     		{ assert(user.unread) &&
		     			<span className={classes.unread}> {user.unread.length} </span>
		     		}
		     	</div>
	    </ListItem>
    </Link>
	)
}

const RecentChats = ({className}) => {
	const showRecentChats = useSelector(state => state.components.stack.recentChats)

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
			<section className={[classes.recentChats, className].join(' ')}>
				<Header>
					<IconButton onClick={toggleMenu} style={{background: open && '#0000000a'}} >
						<MenuIcon />
					</IconButton>
					<Menu 
						open={open} 
					  transformOrigin={{
					    vertical: 'top',
					    horizontal: 'left',
					  }}
						onClose={handleClose} 
						anchorEl={anchorEl} 
						className={classes.menu} 
					>
						<MenuItem onClick={() => { 
							handleClose()
							setComp({component: 'settings', value: true})
						}} >
							<AccountCircleRoundedIcon />
							<Typography variant='inherit'> Profile </Typography>
						</MenuItem>
						<MenuItem onClick={() => { 
							handleClose()
							setComp({component: 'activeUsers', value: true})
						}} >
							<PeopleAltRoundedIcon />
							<Typography variant='inherit'> Network </Typography>
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
			</section>

	)
}

export default RecentChats