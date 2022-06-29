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

import UserAvatar from '../UserAvatar'	
import { Link } from 'react-router-dom'
import Preloader from '../../Preloader'

import UserList from './UserList'
import Header from './Header'

const useStyles = makeStyles({
	add: {
		fontSize: '2.9rem !important'
	},
	menu: {
		'& div': {
			top: '58px !important'
		}
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
	},
	searchbar: {
		width: '100%',
		marginLeft: 20,
		alignSelf: 'stretch',
		'& .MuiInputBase-root': {height: '100%'}

	},
	menu: {
		'& .MuiListItemIcon-root': {
			minWidth: 40
		}
	}
})

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
					recentChats.map(user => {
						return (
							<UserList user={user} key={user.username} />
						)
					})
				}
			</div>
			
		</>

	)
}

export default RecentChats