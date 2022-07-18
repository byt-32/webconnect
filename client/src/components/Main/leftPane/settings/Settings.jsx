import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import InputAdornment from '@material-ui/core/InputAdornment';

import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import { Preloader, Oval } from 'react-preloader-icon'

import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import LocalPhoneIcon from '@material-ui/icons/LocalPhone'
import Switch from '@material-ui/core/Switch';
import PhotoIcon from '@material-ui/icons/Photo'
import CheckIcon from '@material-ui/icons/Check'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import EditIcon from '@material-ui/icons/Edit';
import SecurityIcon from '@material-ui/icons/Security'
import LockIcon from '@material-ui/icons/Lock'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import CancelIcon from '@material-ui/icons/Cancel';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import OutlinedInput from '@material-ui/core/OutlinedInput';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import CircularProgress from '@material-ui/core/CircularProgress';

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';

import { CSSTransition } from 'react-transition-group'
import { Link } from 'react-router-dom'

import { setComponents} from '../../../../Redux/features/componentSlice'
import { updateSettings, editAccountInfo} from '../../../../Redux/features/accountSlice'

import UserAvatar from '../../UserAvatar'
import Header from '../../Header'
import NetworkProgress from './NetworkProgress'

import { handleFetch } from '../../../../lib/script'

const useStyles = makeStyles((theme) => ({
	
	inputs: {
		display: 'flex',
	},
	editButton: {
		textTransform: 'none',
		color: '#486eb3',
		background: '#f3f3f3',
		padding: 0,
		fontSize: '1rem'
	},
	headerActions: {
		position: 'absolute',
		right: 0,
		
	},
	logout: {
		'& svg': {
			marginRight: 5
		},
		'& svg, p': {
			color: '#b30f2e'
		}
	},
	banner: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		paddingTop: '1rem'
	},
	profileInfo: {
		padding: '1rem 0 .5rem 0',
		width: '100%'
	},
	profileImage: {
		position: 'relative'
	},
	avatarPlaceholder: {
		position: 'absolute',
		top: 0,
		width: '100%',
		cursor: 'pointer',
		height: '100%',
		zIndex: 20,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
		background: '#ffffffb5',
		borderRadius: '100%',
		'& .MuiSvgIcon-root': {
			fontSize: '3rem',
			color: '#494f5af2'
		},
		'& .MuiTypography-body1': {
			fontSize: '1.2rem',
			color: '#13171e',
			textShadow: '1px 1px 0px #e9e9e9'
		}
	},
	info: {
		margin: '0 auto',
		// justifyContent: 'center',
		alignItems: 'center',
		display: 'flex',
		marginBottom: 12,
		'& .MuiListItem-root': {
			padding: '0 16px'
		},
		'& .MuiListItemIcon-root': {
			minWidth: 0,
			marginRight: 6
		},
		'& .MuiTypography-body1': {
			fontSize: '1.07rem'
		},
		'& .MuiTypography-h2':{
			fontSize: '1.3rem'
		},
		'& .MuiIconButton-root': {
			alignSelf: 'flex-end'
		}
	},
	list: {
		width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    '& .MuiListItemIcon-root': {
    	'& .MuiSvgIcon-root': {
    		color: '#484848'
    	}
    },
    '& > .MuiListItem-root': {
    	'& .MuiTypography-body1': {
    		color: '#6a3f3c'
    	}
    },
    '& .MuiCollapse-root': {
    	'& .MuiTypography-body1, .MuiSvgIcon-root': {
    		color: '#5c5b5b'
    	}, 
    }
	},
	nested: {
		padding: '3px 10px 0 25px'
	}
}))

const DropDownList = ({children, listItem}) => {
	const [openList, setOpen] = React.useState(true)
	const expandList = () => {
		// setOpen(!openList)
	}
	return (
		<>
	  	<ListItem button onClick={expandList}>
	      {listItem}
	      {/*{openList ? <ExpandLess /> : <ExpandMore />}*/}
	    </ListItem>
	    <Collapse in={openList} timeout="auto" unmountOnExit>
	      {children}
	    </Collapse>
    </>
	)
}

const Settings = ({className}) => {
	const {id} = JSON.parse(localStorage.getItem('details'))
	const classes = useStyles()
	const dispatch = useDispatch()
	const { username, bio, status, email, settings} = useSelector(state => state.account.account)
	const [showProgress, setProgress] = React.useState(false)

	const [showInput, setInputs] = React.useState({name: false, bio: false})

	const [nameInput, setNameValue] = React.useState('')

	const [bioInput, setBioValue] = React.useState('')

	const [timerToValidateName, setTimer] = React.useState(null)
	const [isUpdatingName, updateNameStatus] = React.useState(false)
	const [helperText, setHelperText] = React.useState({name: ''})
	const [inputError, setInputError] = React.useState({name: false})
	const [showInputCloseIcon, setInputCloseIcon] = React.useState({name: true})
	const [openDialog, setDialog] = React.useState(false);
	const [daysUntil, setDaysUntil] = React.useState('')

	const [showPhotoIcon, setIcon] = React.useState(false)

	const [anchorEl, setAnchorEl] = React.useState(null)
	const open = Boolean(anchorEl)

  const handleClickOpen = () => {
    setDialog(true);
  };
  const handleMenu = (e) => {
  	setAnchorEl(e.currentTarget)
  }
  const handleClose = () => setAnchorEl(null)

  const handleBioInput = (value) => {
  	setBioValue(value)
  }

	const setComp = (obj) => {
		dispatch(setComponents(obj))
	}
	const handleInputVisibility = input => {
		setInputs({...showInput, ...input})
	}

	const updateProfileName = ({target}) => {
		const value = target.value
		clearTimeout(timerToValidateName)
		updateNameStatus(false)

		if (/[^a-z0-9_ ]/ig.test(value)) {
			updateNameStatus(false)
			setInputError({name: true})
			setHelperText({name: `name cannot contain ${value[value.length-1]}`})

		} else if (value.length < 3) {
			setNameValue({name: value})
			setInputError({name: true})
			setHelperText({name: `name is too short`})
		} else {
			setNameValue({name: value})
			setInputError({name: false})
			setHelperText({name: ''})
		}

		if (value === '') {
			setInputCloseIcon({name: true})
		} else {
			if (value.length >= 3 ) {
				callTimer()
				setInputCloseIcon({name: false})
			}	
		}

		function callTimer() {
			const newTimer = setTimeout(() => {
				updateNameStatus(true)
				handleFetch(`/user/updateName/${id}`, 'put', {newName: target.value}, (res) => {
					const {type, response} = res
					updateNameStatus(false)
					if (type === 'error') {
						setInputError({name: true})
						setHelperText({name: response })
					} else if (type === 'isMax') {
						setDaysUntil(response)
						setDialog(true)
					} else {
						const login = JSON.parse(localStorage.getItem('details'))
						localStorage.setItem('details', JSON.stringify({...login, username: response}))

						setInputError({name: false})
						setHelperText({name: '' })
						setInputs({name: false})
						document.location.pathname = ''
					}
					res.error && updateNameStatus(false)
				})
				setTimer(newTimer)
				
			})
		}
	}

	const handleSettings = (obj) => {
		setProgress(true)
		handleFetch(`/user/updateSettings/${id}`, 'put', {obj: obj}, (res) => {
			dispatch(updateSettings(res))
			setProgress(false)
		})
	}

	const changeBio = () => {
		setInputs({bio: false})
		if (bioInput !== '') {
			setProgress(true)

			handleFetch(`/user/editBio/${id}`, 'put', {bio: bioInput}, (res) => {
				setProgress(false)
				dispatch(editAccountInfo(res))
				if (res.error) {
					setProgress(false)
				}
			})
		}
	}

	const showAvatarPlaceholder = (bool) => {
		setIcon(bool)
	}
	return (
		<section className={[classes.settings, className].join(' ')}>
			<Header>
				<IconButton onClick={() => setComp({component: 'recentChats', value: true})}>
					<KeyboardBackspaceIcon />
				</IconButton>
				<Typography component='h6'> Profile </Typography>
				<div className={classes.headerActions}>
					<IconButton onClick={(e) => handleMenu(e)}> <MoreVertIcon /> </IconButton>
					<Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose} className={classes.logout}>
            	<ExitToAppIcon />
            	<Typography style={{color:''}} > Log out </Typography>
            </MenuItem>
          </Menu>
				</div>
				{ showProgress &&
					<NetworkProgress />
				}
			</Header>
				
			<Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
	    	 <DialogContent>
	        <DialogContentText id="alert-dialog-description">
	          {daysUntil}
	        </DialogContentText>
	      </DialogContent>
      </Dialog>
			<div className={classes.profileBody}>
				<div className={classes.banner}>
					<div className={classes.profileImage} 
						onMouseOver={() => showAvatarPlaceholder(true)} 
						onMouseLeave={() => showAvatarPlaceholder(false)} 
					>
						<Fade in={showPhotoIcon}>
							<div className={classes.avatarPlaceholder}>
								<AddAPhotoIcon />
								{/*<Typography > Upload photo </Typography>*/}
							</div>
						</Fade>
		        <UserAvatar username={username} style={{
		        	width: 200, height: 200, fontSize: '4rem'
		        }} badge={false} />
					</div>
					<div className={classes.profileInfo}>
						<div className={classes.info}>
							<ListItem>
				        <ListItemIcon>
						 			<AccountBoxIcon style={{marginRight: 10, fontSize: '1.2rem', color: '#95898b'}} />
				        </ListItemIcon>
				        <ListItemText onDoubleClick={() => handleInputVisibility({name: true})} primary={username} />
				      </ListItem>
						</div>

						 <div className={classes.info}>
							 <ListItem>
					        <ListItemIcon>
							 			<InfoOutlinedIcon style={{marginRight: 10, fontSize: '1.2rem'}} />
					        </ListItemIcon>

									{showInput.bio ?	
										<OutlinedInput
											onChange={({target}) => handleBioInput(target.value)} 
											placeholder='Give a short description about yourself'
											style={{width: '100%'}}
											multiline
											endAdornment={
												<InputAdornment position="end" style={{height: '100%'}}>
													<IconButton onClick={changeBio} >
														<CheckIcon />
													</IconButton>
												</InputAdornment>
											}

										/>
										:
						        <ListItemText 
						        	primary={bio} 
						        	secondary={
						        		<Button className={classes.editButton} onClick={() => handleInputVisibility({bio: true})}> edit </Button>
						        	}
						        /> 
					      	}
					      </ListItem>
							</div> 
					</div>
				</div>
				<Divider />
				<div className={classes.settings}>
					<List
			      component="nav"
			      aria-labelledby="nested-list-subheader"
			      subheader={
			        <ListSubheader component="div" id="nested-list-subheader">
			          Account Settings
			        </ListSubheader>
			      }
			      className={classes.list}
			    >
						<DropDownList 
						listItem={
							<>
								<ListItemIcon> <AccountCircleIcon /> </ListItemIcon>
								
							</>
						} >
							<List component="div" disablePadding>
			          <ListItem button className={classes.nested} onClick={() => setComp({component: 'contactInfo', value: true})}>
			            <ListItemText primary="Contact info" />
			            <NavigateNextIcon />
			          </ListItem>
			          <ListItem button className={classes.nested} onClick={() => setComp({component: 'resetPassword', value: true})}>
			            <ListItemText primary="Update password" />
			            <NavigateNextIcon />
			          </ListItem>
			        </List>
						</DropDownList>
						<DropDownList 
							listItem={
								<>
									<ListItemIcon> <NotificationsIcon /> </ListItemIcon>
								</>
							} >
							<List component="div" disablePadding>
			          <ListItem button className={classes.nested}
			          	onClick={() => handleSettings({notifications: !settings.notifications})} >
			            <ListItemText primary="Notification" />
			            <IconButton >
			            	{ settings.notifications ?
			            		<NotificationsActiveIcon /> :
			            		<NotificationsOffIcon style={{color: '#818181'}} />
			            	}
			            </IconButton>
			          </ListItem>
			          <ListItem button className={classes.nested} 
			          	onClick={() => handleSettings({sound: !settings.sound})}
			          >
			            <ListItemText primary="Sound" />
			            <IconButton >
			            	{ settings.sound ? 
			            		<VolumeUpIcon /> : 
			            		<VolumeOffIcon style={{color: '#818181'}} />
			            	}
			            </IconButton>
			          </ListItem>
			        </List>
						</DropDownList>
					</List>
				</div>
			</div>
		</section>
	)
}

export default Settings