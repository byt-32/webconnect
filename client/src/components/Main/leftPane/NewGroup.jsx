import React from 'react'
import {v4 as uuid} from 'uuid'

import { useSelector, useDispatch } from 'react-redux'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase'
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar'
import Badge from '@material-ui/core/Badge'
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DoneIcon from '@material-ui/icons/Done';

import { makeStyles } from '@material-ui/core/styles';

import { setComponents} from '../../../Redux/features/componentSlice'
import { addGroupUser, unselectUser} from '../../../Redux/features/groupSlice'
import { addGroup } from '../../../Redux/features/recentChatsSlice'

import { assertChar } from '../../../lib/script'
import { socket } from '../Main'

import UserAvatar from '../UserAvatar'
import Header from '../Header'
import Preloader from '../../Preloader'
import SearchBar from '../SearchBar'

const useStyles = makeStyles({
	groupUsers: {

	},
	header: {
		// position: 'sticky',
		// top: 0,
		// background: '#fff',
		// zIndex: 20
	},
	searchbar: {
		width: '94%',
		paddingLeft: '20px',
		margin: '15px 0 10px 12px',
		// border: '1px solid #b3b3c1',
		borderRadius: '30px',
		boxShadow: '0 0 5px 2px #e9e9e9',
		height: '40px'
	},
	chips: {
		padding: '10px',
		'& .MuiChip-root': {
			marginRight: 5,
			marginBottom: 5
		},
		'& .MuiChip-iconColorPrimary': {
			color: '#fafafa'
		},
		'& .MuiAvatar-root': {
			height: '28px',
			width: '28px',
			fontSize: '1rem'
		},
		'& .MuiChip-label': {

		}
	},
	listItem: {
		position: 'relative',
	},
	checked: {
		position: 'absolute',
		right: '10px',

		'& .MuiSvgIcon-root': {
			fontSize: '1rem',
			color: '#8e9bb1'
		}
	},
	fab: {
		'&:hover': {
			backgroundColor: 'cornflowerblue'
		},
		height: 'auto',
		width: 'auto',
		padding: '3% !important',
		background: 'cornflowerblue',
		color: '#fff',
		boxShadow: '0 0 5px 1px #0000001c',
		position: 'sticky',
		bottom: '1rem',
		left: '85%'
	},
	participants: {
		margin: '20px 0' ,

		'& > div': {
			paddingLeft: 5,
			marginTop: 8,
			display: 'flex',

			'& > div': {
				marginRight: 3
			}
		}
	},
	dialog: {
		'& .MuiDialog-paperScrollPaper': {
			minWidth: '285px'
		}
	}

})

const UserList = ({user, isSelected}) => {
	const classes = useStyles()
	const dispatch = useDispatch()
	const handleClick = () => {
		dispatch(addGroupUser(user))
	}
	return (
		<ListItem	
			button 
			className={classes.listItem}
			// selected={user.username === selectedUser.username}
			// style={{display: user.hidden === true ? 'none' : 'flex'}}
  		onClick={handleClick}
  		disabled={isSelected}
  	>
  		<ListItemIcon>
	      <UserAvatar username={user.username} />
	    </ListItemIcon>
    	<ListItemText 
    		primary={<Typography component='h6' style={{fontFamily: 'Roboto'}}> {user.username}</Typography>} 
    	/>
    	{ isSelected &&
	    	<div className={classes.checked}>
	    		<CheckCircleIcon />
	    	</div>
	    }
    </ListItem>
	)
}

const NewGroup = ({className}) => {
	// TODO: ADD group rules on dialog
	const {username, id} = JSON.parse(localStorage.getItem('details'))
	const classes = useStyles()
	const dispatch = useDispatch()
	const { useEffect, useState} = React
	const showLoader = useSelector(state => state.activeUsers.showActiveUsersLoader)
	const selectedUsers = useSelector(state => state.groups.selectedUsers)

	const activeUsers = useSelector(state => state.activeUsers.activeUsers)
	const [users, setUsers] = useState(activeUsers)
	const [dialog, setDialog] = useState(false)
	const [groupName, setGroupName ]= useState('')
	const [inputProps, setInputProps] = useState({
		error: false, helperText: ''
	})

	const setComponent = () => {
		dispatch(setComponents({component: 'recentChats', value: true}))
	}

	const removeUser = (user) => {
		dispatch(unselectUser(user))
	}

	const handleSearch = (value) => {
		setUsers(activeUsers.filter(user => user.username.toLowerCase().includes(value.toLowerCase())))
	}
	const handleActionDialog = () => {
		setDialog(!dialog)
	}
	const handleGroupName = (name) => {
		setInputProps({error: false, helperText: ''})
		setGroupName(name)
	}
	const createGroup = () => {
		if (groupName.match(/[0-9a-z]/i) !== null) {
			const groupInfo = {
				userId: id,
				chatType: 'group',
				createdBy: {username},
				participants: selectedUsers.concat({username}),
				isStarred: {value: false},
				messages: [],
				group: {
					groupName, 
					groupId: uuid(),
					created: new Date()
				}, 
			}
			socket.emit('newGroup', {
				...groupInfo,
			})
			// dispatch(addGroup({...groupInfo, lastSent: new Date().getTime()}))
			dispatch(setComponents({component: 'recentChats', value: true}))
		} else {
			setInputProps({error: true, helperText: 'Please enter a group name'})
		}
			
	}
	return (
		<section className={[classes.groupUsers, className].join(' ')}>
			<Header>
				<IconButton onClick={setComponent} >
					<KeyboardBackspaceIcon />
				</IconButton>
				<Typography component='h6'> Create New Group </Typography>
			</Header>
			<InputBase
					className={classes.searchbar}
		      placeholder='Search a user'
		      type="text"
		      onChange={({target}) => {
		      	handleSearch(target.value)
		      }}
		    />
			<div className={classes.chips}>
				{
					selectedUsers.map((user, i) => {
						return (
							<Chip
								key={user.username}
				        icon={
				        	<UserAvatar username={user.username} badge={false} />
				        }
				        label={user.username}
				        color="primary"
				        onDelete={() => removeUser(user)}
				        variant="outlined"
				      />
				     )
					})
				}
			</div>
			<div className={classes.userslist}>
				{
					showLoader ? <Preloader /> : 
					users.map((user) => {
						return (
							<UserList user={user} key={user.username} 
								isSelected={
									selectedUsers.findIndex(i => i.username === user.username) === -1 ? false 
									: true
								} 
							/>
						)
					})
				}
			</div>
			<IconButton
        variant="extended"
        size="small"
        color="primary"
        aria-label="add"
        className={classes.fab}
        onClick={handleActionDialog}
        disabled={selectedUsers.length > 0 ? false : true}
      >
        <DoneIcon className={classes.extendedIcon} />
      </IconButton>

      <Dialog open={dialog} className={classes.dialog} 
      	onClose={handleActionDialog} aria-labelledby="form-dialog-title">
      	<DialogTitle id="form-dialog-title">
       	 	Create New Group
        </DialogTitle>
        <DialogContent>
        	{/*<div className={classes.groupRules}>

        	</div>*/}

        	<TextField 
        		placeholder='Enter group name here'
        		style={{width: '100%'}}
        		value={groupName}
        		onChange={({target}) => handleGroupName(target.value)}
        		error={inputProps.error}
        		helperText={inputProps.helperText}
        	/>
        	<div className={classes.participants}>
        		<Typography> Participants </Typography>
        		<div>
	        		{
	        			selectedUsers.map((user, i) => {
	        				return (
	        					<Tooltip title={user.username} aria-label="username" key={i}>
							        <div className={classes.groupUser} >
		        						<UserAvatar 
		        							username={user.username}
		        							badge={false}
		        						/>
		        					</div>
								    </Tooltip>
		        					
	        				)
	        			})
	        		}
	        	</div>
        	</div>
        </DialogContent>
        <DialogActions>
        	<Button color="primary" onClick={handleActionDialog}> Cancel </Button>
        	<Button 
        		style={{color: 'red'}} 
        		onClick={createGroup}
        	 > Create </Button>
        </DialogActions>
      </Dialog>
		</section>
	)
}

export default NewGroup