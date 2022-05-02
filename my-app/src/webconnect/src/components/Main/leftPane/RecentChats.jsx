import React from 'react'
import styles from '../../../stylesheet/main.module.css'
import IconButton from '@material-ui/core/IconButton'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedUser, fetchMessages,setComponents, handleSearch } from '../../../Redux/globalPropsSlice'

import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu'
import { makeStyles } from '@material-ui/core/styles';
import GroupIcon from '@material-ui/icons/Group'
import MenuIcon from '@material-ui/icons/Menu'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import UserAvatar from '../UserAvatar'	
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications'
import { Link } from 'react-router-dom'
import GradientLoader from '../../Preloaders'

const useStyles = makeStyles({
	add: {
		fontSize: '2.9rem !important'
	},
	menu: {
		'& div': {
			top: '58px !important'
		}
	},
	appBody: {
		overflow: 'scroll'
	},
	unread: {
		color: '#fff',
		position: 'absolute',
		right: '15px',
		borderRadius: '200px',
		height: '18px',
		width: '18px',
		fontFamily: 'sans-serif !important',
		fontSize: '13px',
		display: 'flex',
		background: '#6495ed',
		alignItems: 'center',
		justifyContent: 'center'
	}
})
const User = ({user, color}) => {
	const dispatch = useDispatch()
	const classes = useStyles()
	const token = useSelector(state => state.globalProps.user.contacts.id)

	const selectedUser = useSelector(state => state.globalProps.currentSelectedUser)
	const userInChats = useSelector(state => state.globalProps.privateChats.findIndex(chat => chat.username === user.username))
	
	// window.addEventListener('unload', () => {
	// 	if (navigator.sendBeacon) {
	// 		navigator.sendBeacon(`/saveUnread/${JSON.stringify(us)}`)
	// 	}
	// })
	const setSelected = args => {
		if (selectedUser.username !== args.username) {
			if (user.unread !== 0) {
				fetch(`/resetUnread/${token}/${user.username}`)
			}
			dispatch(setSelectedUser(args))
			dispatch(setComponents({component: 'rightPane', value: true}))

			if (userInChats === -1) {
				dispatch(fetchMessages({friendsName: args.username, token: token}))
			}
		}
	}

	return (
		<ListItem	button 
			style={{position: 'relative'}}
			selected={user.username === selectedUser.username}
  		onClick={() =>{
  		 setSelected(user)
  		}}>
    		<ListItemIcon>
		      <UserAvatar 
		      	name={user.username} 
		      	badge={user.status === 'online' ? 'true' : 'false'} 
		      	color={user.color}
		      	status={user.status}  
		      />
		    </ListItemIcon>
      	<ListItemText primary={user.username} secondary={''} />
      	{user.unread > 0 && <div className={classes.unread} > {user.unread} </div>}
    </ListItem>
	)
}
const RecentChats = () => {
	const dispatch = useDispatch()
	const [anchorEl, setAnchorEl] = React.useState(null)
	const open = Boolean(anchorEl)
	const toggleMenu = (event) => {
		setAnchorEl(event.target)
	}
	const handleClose =() => {
		setAnchorEl(null)
	}

	const recentChats = useSelector(state => state.globalProps.recentChats)
	const noMatch = useSelector(state => state.globalProps.noMatch.recentChats)
	const searchTerm = useSelector(state => state.globalProps.searchTerm.recentChats)
	const selectedUser = useSelector(state => state.globalProps.currentSelectedUser)
	const USER = useSelector(state => state.globalProps.user.contacts)
	const preload = useSelector(state => state.globalProps.preload.recentChats)

	React.useEffect(() => {
		const findUnread = recentChats.find(chat => chat.unread !== 0)
		if (findUnread !== undefined && selectedUser !== findUnread.username) {
			fetch(`/saveUnread/${USER.id}/${USER.username}/${findUnread.username}/${findUnread.unread}`)
		}
	}, [recentChats])
	
	const setComp = (obj) => {
		dispatch(setComponents(obj))
	}
	React.useEffect(() => {
		// dispatch(handleSearch({input: '', component: 'recentChats'}))
	}, [])
	const performSearch = (searchVal) => {
		dispatch(handleSearch({input: searchVal, component: 'recentChats'}))
	}
	const classes = useStyles()
	 const [height, setHeight] = React.useState(`${window.innerHeight - 30}px`)
  window.onresize = () => {
  	setHeight(`${window.innerHeight - 30}px`)
  }
	return (
		<section className={[styles.component, styles.recentChats, styles.animate__animated].join(' ')} >
			
			<div position="static" className={styles.app} >
			  <div className={styles.toolbar} >
			  	<div className={styles.headerItem} >
				  	<IconButton onClick={toggleMenu} style={{background: open && 'rgba(0, 0, 0, 0.04)'}} > 
							<MenuIcon classes={{root: styles.menu}} fontSize='medium' />
						</IconButton>
						
				   </div>
				   <div className={styles.appSearch} > 
							<TextField variant='standard' value={searchTerm} onChange={(e) => performSearch(e.target.value)}
							color='primary' classes={{root: styles.contactsSearch}} placeholder='Search' />
				   </div> 
			  </div>
			</div>
			{ preload ? <GradientLoader /> :
			<div className={styles.appBody} style={{
				height: height,
			}}>
				<div className={styles.menuBlock} >
					<Menu open={open}
						anchorEl={anchorEl}
						onClose={handleClose} 
						disableAutoFocusItem={true}
						getContentAnchorEl={null}
				    anchorOrigin={{
				      vertical: 'bottom',
				      horizontal: 'center',
				    }}
				    transformOrigin={{
			      vertical: 'top',
			      horizontal: 'center',
			    }}
			    className={classes.menu}
					variant='menu' >
						
						<MenuItem onClick={() => {
							handleClose()
							setComp({component: 'activeUsers', value: true})
						}} classes={{root: styles.menuItem}} >
							<GroupIcon fontSize='small' />
							<Typography variant='body1' component='span' classes={{root: styles.menuText}}>
								Active users
							</Typography>
						</MenuItem>
						 <MenuItem onClick={() => { 
						 	handleClose()
						 	setComp({component: 'settings', value: true})
						 }} classes={{root: styles.menuItem}} >
							<SettingsApplicationsIcon fontSize='small' />
							<Typography variant='body1' component='span' classes={{root: styles.menuText}}>
								Settings
							</Typography>
						</MenuItem>
					</Menu>
	   		</div>
				{noMatch && <div className={styles.noMatch} >
					<Typography color='error' component='span'>Search query did not match any entry</Typography> <br/>
					<Typography color='textPrimary' component='span'> Try another search </Typography>
				</div> }
				<List component="nav" style={{
					visibility: !noMatch ? 'visible' : 'hidden'
				}}>
				{
					recentChats.map((user, i) => {
						return (
							<User key={i} user={user} />
						)
					})

				}
				</List>
			</div>
		}
			
		</section>
	)
}

export default RecentChats