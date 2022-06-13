import React from 'react'
import styles from '../../../stylesheet/main.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedUser, 
	setComponents, 
	handleSearch,
	handleReply, 
	hideCount } from '../../../Redux/globalPropsSlice'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import UserAvatar from '../UserAvatar'
import { Link } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import { TextField } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

const useStyles = makeStyles({
	backBtn: {
		fontSize: '1.2rem !important',
	},
	avatarGrp: {
		justifyContent: 'center',
		'& .MuiAvatar-root': {
			width: '30px',
			height: '30px',
			fontSize: '12px !important'
		}
	},
	arrow: {
		textAlign: 'right',
		cursor: 'pointer'
	}
})

const User = ({user}) => {
	const dispatch = useDispatch()
	const selectedUser = useSelector(state => state.globalProps.currentSelectedUser)
	const userInRecent = useSelector(state => state.globalProps.recentChats.find(_user => _user.username === user.username))
	const token = useSelector(state => state.globalProps.user.contacts.id)
	const setSelected = args => {
		if (selectedUser.username !== args.username) {
			if (userInRecent !== undefined) {
				if (userInRecent.unread !== 0) {
					fetch(`/resetUnread/${token}/${user.username}`)
				}
			}
			dispatch(setSelectedUser(args))
			dispatch(setComponents({component: 'rightPane', value: true}))
		}
	}
	return (
		<ListItem	button 
			selected={user.username === selectedUser.username}
  		onClick={() => {
  		 setSelected(user)
  		}}>
    		<ListItemIcon>
		      <UserAvatar 
		      	color={user.color}
			      name={user.username} 
			      badge={user.status === 'online' ? 'true' : 'false'}
			      status={user.status} 
			     />
		    </ListItemIcon>
      	<ListItemText primary={user.username} />
    </ListItem>
	)
}

const ActiveUsers = () => {
	const classes = useStyles()
	const dispatch = useDispatch()
	const activeUsers = useSelector(state => state.globalProps.activeUsers)

	const thisUser = useSelector(state => state.globalProps.user)
	const registeredUsers = useSelector(state => state.globalProps.registeredUsers)
	const searchTerm = useSelector(state => state.globalProps.searchTerm.activeUsers)

	const colors = useSelector(state => state.globalProps.colors)
	const noMatch = useSelector(state => state.globalProps.noMatch.activeUsers)
	const setCount = () => {
		dispatch(hideCount())
	}
	
	React.useEffect(() => {
		// dispatch(handleSearch({input: '', component: 'activeUsers'}))
	}, [])
	const performSearch = (input) => {
		dispatch(handleSearch({input: input, component: 'activeUsers'}))
	}
	const setComp = (obj) => {
		dispatch(setComponents(obj))
	}
	return (
		<section className={[styles.component, styles.animate__animated, styles.animate__fadeInLeft].join(' ')} >
			<div position="static" className={styles.app} >
			  <div className={styles.toolbar} >
			  	<div className={[styles.headerItem, styles.backBtn].join(' ')} >
				    <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => {
				    	setComp({component: 'recentChats', value: true})
				    }} >
				      <KeyboardBackspaceIcon className={classes.backBtn} />
				    </IconButton>
			   </div>
			   <div className={styles.appSearch} > 
						<TextField variant='standard' color='primary' value={searchTerm} onChange={(e) => performSearch(e.target.value)}
						classes={{root: styles.contactsSearch}} placeholder='Search' />
			    </div>
			  </div>
			</div>
			<section className={[styles.activeUsers, styles.appBody, classes.appBody].join(' ')}>
				{noMatch && <div className={styles.noMatch} >
					<Typography color='error' component='span'>Search query did not match any entry</Typography> <br/>
					<Typography color='textPrimary' component='span'> Try another search </Typography>
				</div> }
				<List component="nav">
					{activeUsers.map( (user, i) => {
						return (
							thisUser.socketId !== user.socketId && 
								<User 
									user={user} 
									key={i} 
								/>
						)
					} )}
					
				</List>
			</section>
		</section>
	)
}
export default ActiveUsers