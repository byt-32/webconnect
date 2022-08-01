import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {setComponents} from '../../../Redux/features/componentSlice'

import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem';
import Badge from '@material-ui/core/Badge';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import Fade from '@material-ui/core/Fade';
import Avatar from '@material-ui/core/Avatar'

import PublicIcon from '@material-ui/icons/Public';
import GroupIcon from '@material-ui/icons/Group'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications'
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';
import DoneAllIcon from '@material-ui/icons/DoneAll'
import DoneIcon from '@material-ui/icons/Done';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'

import { Link } from 'react-router-dom'

import { socket } from '../Main'
import { assert, getLastSeen, handleFetch } from '../../../lib/script'


import { setSelectedUser, assertFetch, clearFromFetched } from '../../../Redux/features/otherSlice'
import { fetchMessages, clearChats } from '../../../Redux/features/chatSlice'
import { resetUnread, handleStarred, clearConversation, alertBeforeClear, searchRecentChats } from '../../../Redux/features/recentChatsSlice'
import { setSelectedGroup } from '../../../Redux/features/groupSlice'

import { TransitionGroup, CSSTransition } from 'react-transition-group'

import UserAvatar from '../UserAvatar'	
import Preloader from '../../Preloader'
import Header from '../Header'
import SearchBar from '../SearchBar'
import ChatActions from '../ChatActions'

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
	
	listItem: {
		position: 'relative',
		padding: 12,
		'&.MuiListItem-root.Mui-selected': {
			backgroundColor: '#e3e3e34d',
			// backgroundColor: 'rgb(248 247 255)'
		},
		'&:hover': {
			backgroundColor: '#e3e3e34d',
			// backgroundColor: 'rgb(248 247 255)'
		},
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
		whiteSpace: 'nowrap'
	},
	lastSent: {
		marginBottom: 6,
		textAlign: 'right',
		color: '#53555e'
	},
	chatProps: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center',

		'& > svg': {
			fontSize: '1.3rem',
			color: '#a2aab9'
		}
	},
	unread: {
		minWidth: 17,
		minHeight: 17,
		background: '#6495ed',
		borderRadius: '100%',
		color: '#fff',
		marginLeft: 6,
		textAlign: 'center'
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
	speedDial: {
		alignItems: 'flex-end',
		position: 'sticky',
		bottom: '1rem',
		right: '1rem',
		'& .MuiFab-primary': {
			background: 'cornflowerblue',
			color: '#fff'
		}
	},
	
})

function getTime(date) {
	let year, day

	let str = date.toDateString()
	let match = str.match(/[0-9][0-9][0-9][0-9]/)

	if (match !== null) {
		year = match[0]
		day = str.slice(0, match.index-1)
	}
	return {year, day}
}

const GroupList = ({chatType, group, isStarred, messages, visible}) => {
	const {useState, useEffect} = React
	const classes = useStyles()
	const dispatch = useDispatch()
	const [showMenu, setMenu] = useState(false)
	const [anchorEl, setAnchorEl] = React.useState(null)
	const selectedUser = useSelector(state => state.other.currentSelectedUser)

	const openContextMenu = (e) => {
		e.preventDefault()

		setMenu(true)
		setAnchorEl(e.currentTarget)
		return false
	}
	const closeContextMenu = (e) => {
		setMenu(false)
		setAnchorEl(null)
	}

	const starConversation = () => {
		const isStarred = {value: !user.isStarred.value, date: Date.now()}

		socket.emit('starConversation', username, user.username, 
			isStarred, () => {})
		dispatch(handleStarred({friendsName: user.username, isStarred }))
	}
	const handleDelete = () => {
		dispatch(alertBeforeClear(user))
	}

	const handleClick = () => {
		dispatch(setSelectedUser({}))
		dispatch(setSelectedGroup(group))
	}

	return (
		<><ListItem	
			button
			className={classes.listItem}
			onClick={handleClick}
			onContextMenu={openContextMenu}
			style={{display: visible ? 'flex' : 'none'}}
		>
			<ListItemIcon>
	      <Avatar>
	      	<GroupIcon />
	      </Avatar>
	    </ListItemIcon>
	    <ListItemText 
    		primary={
    			<Typography component='h6'> {group.groupName}</Typography>
    		} 
    	/>

		</ListItem>
		<ChatActions 
   		open={showMenu} 
   		anchorEl={anchorEl} 
   		onClose={closeContextMenu}
   		anchorOrigin={{
		    vertical: 'center',
		    horizontal: 'center',
		  }}
		  transformOrigin={{
		    vertical: 'center',
		    horizontal: 'center',
		  }}
   	>
   		<div> 
   			<IconButton onClick={() => {
   				starConversation()
   				closeContextMenu()
   			}} >	
   				{isStarred.value ? <StarIcon style={{color: '#6495ed'}} /> : 
   					<StarBorderIcon style={{color: '#6495ed'}} />
   				}
					<Typography component='span'> {`${isStarred.value ? 'Unstar' : 'Star'} conversation` }</Typography>
   			</IconButton>
   			<IconButton onClick={() => {
   				handleDelete()
   				closeContextMenu()
   			}} >	
   				<DeleteSweepIcon style={{color: '#ff6a6a'}} />
					<Typography component='span'> Leave group </Typography>
   			</IconButton>
   		</div>

   	</ChatActions>
		</>
	)
}


const UserList = ({user, style, secondaryItems}) => {
	const {id, username} = JSON.parse(localStorage.getItem('details'))
	const {useState, useEffect} = React
	const classes = useStyles()
	const dispatch = useDispatch()
	const [showMenu, setMenu] = useState(false)
	const [anchorEl, setAnchorEl] = React.useState(null)
	const selectedUser = useSelector(state => state.other.currentSelectedUser)
	const fetchedUsers = useSelector(state => state.other.fetched)
	const userOnline = useSelector(state => state.other.onlineUsers.find(i => i.username === user.username))

	let dateValue, yearPos, year, fullDate, timestamp

	if (assert(user.messages)) {
		const oldDate = getTime(new Date(user.messages.chatId))
		const newDate = getTime(new Date())

		if (oldDate.day === newDate.day) {
			dateValue = user.messages.timestamp.time
		} else {
			dateValue = oldDate.day
		}
		
	}

	const handleClick = (e) => {
		e.preventDefault()
		const setPane = () => {
			if (window.innerWidth < 660 ) {
				dispatch(setComponents({component: 'leftPane', value: false}))
			}
		}
		if (selectedUser.username !== user.username) {
			
			if (assert(user.unread)) {
				dispatch(resetUnread(user.username))
				socket.emit('chatIsRead', user.username, username)
			}
			if (assert(fetchedUsers.find(i => i === user.username))) {
				dispatch(setSelectedUser({username: user.username}))
				setPane()
			} else {
				dispatch(
					fetchMessages({friendsName: user.username, token: id})
				).then(() => {
					dispatch(assertFetch(user.username))
					dispatch(setSelectedUser({username: user.username}))
					setPane()
				})
			}
		}
	}

	const openContextMenu = (e) => {
		e.preventDefault()

		setMenu(true)
		setAnchorEl(e.currentTarget)
		return false
	}

	const closeContextMenu = (e) => {
		setMenu(false)
		setAnchorEl(null)
	}

	const starConversation = () => {
		const isStarred = {value: !user.isStarred.value, date: Date.now()}

		socket.emit('starConversation', username, user.username, 
			isStarred, () => {})
		dispatch(handleStarred({friendsName: user.username, isStarred }))
	}
	const handleDelete = () => {
		dispatch(alertBeforeClear(user))
	}
	
	return (
		<>
		<ListItem	button 
			className={classes.listItem}
			selected={user.username === selectedUser.username || showMenu}
			onContextMenu={openContextMenu}
			style={{display: user.visible ? 'flex' : 'none'}}
  		onClick={handleClick}>

    		<ListItemIcon>
		      <UserAvatar
			      username={user.username} 
			      badge={assert(userOnline) ? userOnline.online : false}
			     />
		    </ListItemIcon>
      	<ListItemText 
      		primary={
      			<Typography component='h6'> {user.username}</Typography>
      		} 
      		secondary={
      			assert(userOnline) && userOnline.typing === true ?
      				<span className={classes.typingStatus}> {'typing...'} </span>
      			: 
      				<span className={classes.lastChat}> 
      					{user.messages.sender === username && 
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
	     			{dateValue}
	     		</span>

	     			<span className={classes.chatProps}> 
	     				{
								user.isStarred.value &&
									<StarIcon />
							}
	     				{assert(user.unread) && 
	     					<span className={classes.unread}> {user.unread.length} </span>
	     				} 
	     				
	     			</span>
	     	</div>

	     
    </ListItem>
  	<ChatActions 
   		open={showMenu} 
   		anchorEl={anchorEl} 
   		onClose={closeContextMenu}
   		anchorOrigin={{
		    vertical: 'center',
		    horizontal: 'center',
		  }}
		  transformOrigin={{
		    vertical: 'center',
		    horizontal: 'center',
		  }}
   	>
   		<div> 
   			<IconButton onClick={() => {
   				starConversation()
   				closeContextMenu()
   			}} >	
   				{user.isStarred.value ? <StarIcon style={{color: '#6495ed'}} /> : 
   					<StarBorderIcon style={{color: '#6495ed'}} />
   				}
					<Typography component='span'> {`${user.isStarred.value ? 'Unstar' : 'Star'} conversation` }</Typography>
   			</IconButton>
   			<IconButton onClick={() => {
   				handleDelete()
   				closeContextMenu()
   			}} >	
   				<DeleteSweepIcon style={{color: '#ff6a6a'}} />
					<Typography component='span'> Clear conversation </Typography>
   			</IconButton>
   		</div>

   	</ChatActions>
   	</>
	)
}

const RecentChats = ({className}) => {
	const showRecentChats = useSelector(state => state.components.stack.recentChats)
	const chatToBeCleared = useSelector(state => state.recentChats.chatToBeCleared)

	const { useEffect, useState } = React
	const classes = useStyles()
	const dispatch = useDispatch()
	const [anchorEl, setAnchorEl] = useState(null)
	const open = Boolean(anchorEl)
	const input = useSelector(state => state.recentChats.input)

	const toggleMenu = (event) => {
		setAnchorEl(event.target)
	}
	const handleClose =() => {
		setAnchorEl(null)
	}

	const selectedUser = useSelector(state => state.other.currentSelectedUser)
	const recentChats = useSelector(state => state.recentChats.recentChats)
	const showLoader = useSelector(state => state.recentChats.showRecentUsersLoader)
	const fetchedUsers = useSelector(state => state.other.fetched)
	const { username} = JSON.parse(localStorage.getItem('details'))
	const [showDial, setDial] = useState(false)
	const [visible, setDialVisibility] = useState(false)

	const setComp = (obj) => {
		dispatch(setComponents(obj))
	}
	
	const closeDialog = ()=> {
		dispatch(alertBeforeClear({}))
	}

	const handleDelete = () => {
		if (assert(assert(fetchedUsers.find(i => i === chatToBeCleared.username)))) {
			dispatch(clearFromFetched(chatToBeCleared.username))
		}
		if (selectedUser.username === chatToBeCleared.username) {
			dispatch(setSelectedUser({}))
		}
		socket.emit('clearConversation', username, chatToBeCleared.username, () => {})
		dispatch(clearConversation(chatToBeCleared.username))
		dispatch(clearChats(chatToBeCleared.username))
	}

	const handleSearch = (value) => {
		dispatch(searchRecentChats(value))
	}

	const handleDial = () => {
		setDial(!showDial)
	}

	const createGroup = () => {
		dispatch(setComponents({component: 'newGroup', value: true}))
	}
	const handleDialVisibility = () => {
		setDialVisibility(!visible)
	}

	return (
			<section className={[classes.recentChats, className].join(' ')}
				onMouseEnter={handleDialVisibility}
				onMouseLeave={handleDialVisibility}
			>
				<Header>
					<IconButton onClick={toggleMenu} style={{background: open && '#0000000a'}} >
						<MoreVertIcon />
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
							<PublicIcon />
							<Typography variant='inherit'> Network </Typography>
						</MenuItem>
							
					</Menu>
					
					<SearchBar input={input} onChange={(val) => {
						handleSearch(val)
					}} />

				</Header>
				<div className={classes.userslist}>
					{
						showLoader ? <Preloader /> : 
						recentChats.map((user, i) => {
							if (user.chatType === 'group') {
								return <GroupList {...user} key={i} />
							} else {
								return <UserList user={user} key={i} />
							}
						})
					}
				</div>

				{ assert(chatToBeCleared) &&
					<Dialog
		        open={assert(chatToBeCleared)}
		        onClose={closeDialog}
		        aria-labelledby="alert-dialog-title"
		        aria-describedby="alert-dialog-description"
		      >
		        <DialogTitle id="alert-dialog-title">{"Clear conversation"}</DialogTitle>
		        <DialogContent>
		          <DialogContentText id="alert-dialog-description">
		            {`This action will permanently clear your entire chat history with ${chatToBeCleared.username}. Continue?`}
		          </DialogContentText>
		        </DialogContent>
		        <DialogActions>
		          <Button onClick={closeDialog} style={{color: 'red'}}>
		            Cancel
		          </Button>
		          <Button color="primary" autoFocus onClick={() => {
		          	handleDelete()
		          	closeDialog()
		          }} >
		            Delete
		          </Button>
		        </DialogActions>
		      </Dialog>
				}
				<Fade in={visible}>
					<SpeedDial
		        ariaLabel="SpeedDial openIcon"
		        className={classes.speedDial}
		        icon={<SpeedDialIcon openIcon={<GroupAddIcon />} />}
		        onClose={handleDial}
		        onOpen={handleDial}
		        open={showDial}
		      >
	          <SpeedDialAction
	            icon={<GroupAddIcon />}
	            tooltipTitle={'Create new group'}
	            onClick={() => {
	            	handleDial()
	            	createGroup()
	            }}
	          />
		      </SpeedDial>
		     </Fade>
			</section>

	)
}

export default RecentChats