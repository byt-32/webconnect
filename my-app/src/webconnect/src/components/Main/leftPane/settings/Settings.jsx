import React from 'react'
import styles from '../../../../stylesheet/main.module.css'
import { useSelector, useDispatch } from 'react-redux'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import UserAvatar from '../../UserAvatar'
import InfoIcon from '@material-ui/icons/Info'
import SecurityIcon from '@material-ui/icons/Security'
import LockIcon from '@material-ui/icons/Lock'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import LocalPhoneIcon from '@material-ui/icons/LocalPhone'
import Switch from '@material-ui/core/Switch';
import PhotoIcon from '@material-ui/icons/Photo'
import CheckIcon from '@material-ui/icons/Check'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import { Preloader, Oval } from 'react-preloader-icon'
import { setComponents, setBio, changeSettings } from '../../../../Redux/globalPropsSlice'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
	app: {
		background: '#fff',
		boxShadow: 'none',
		borderBottom: '1px solid #d1d1d1',
		fontSize: '90%',
		padding: '11px 0'
	},
	toolbar:{
		justifyContent: 'space-between',
		minHeight: 'auto',
		paddingLeft: '15px',
		paddingRight: '0'
	},
	headerItem: {
		display: 'flex',
		alignItems: 'center',
		marginLeft: '5px'
	},
	h6: {
		fontSize: '17px',
		marginLeft: '10px',
		position: 'relative',
	},
	edit: {
		marginRigth: 'auto'
	}, 
	avatar: {
		padding: '20% !important',
		fontWeight: 'bold',
		fontSize: '220% !important'
	},
	input: {
		width: '100%',
		'& .MuiInput-root': {
			width: '90%'
		}
	},
	backBtn: {
		fontSize: '1.2rem !important'
	},
	bio: {
		'lineHeight': 'inherit',
		margin: '0 5px',
		fontSize: '15.4px',
		textAlign: 'center'
	},
	info: {
		padding: '0'
	},
	userInfo: {
		'& svg': {
			fill: '#545352'
		}
	},
	logout: {
		bottom: '5px',
		padding: '10px 0',
		margin: '0 10px',
		cursor: 'pointer',
		borderRadius: 0
	},
	appBody: {
		overflow: 'scroll'
	}
})
const Profile = () => {	
	const dispatch = useDispatch()

	const user = useSelector(state => state.globalProps.user.contacts)
	const color = useSelector(state => state.globalProps.user.color)
	const bio = useSelector(state => state.globalProps.user.bio)
	const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const [_open, _setOpen] = React.useState(false);
  const _handleClose = () => {
    _setOpen(false);
  };
  const _handleOpen = () => {
    _setOpen(true);
  };
  
  const [editBio, setBioEdit] = React.useState(false)

  const [bioValue, setBioValue] = React.useState(bio)
  const [loader, setLoader] = React.useState(false)

  const editBioInput = async ({target}) => {
  	setBioValue(target.value)
  }

  const setInputVisibility = (val) => {
  	val === 'bio' && setBioEdit(editName => !editName)

  	if (bioValue !== ''){
  		setLoader(true)
	  	fetch('/editBio', {
	  		method: 'post',
	  		headers: {
	  			'Content-Type': 'application/json'
	  		},
	  		body: JSON.stringify({id: user.id, bio: bioValue})
	  	})
	  	.then(res => res.json())
	  	.then(res => {
	  		dispatch(setBio(res.bio))
  			setLoader(false)
	  	})
	  	.catch(e => {
	  		console.error(e)
	  	})
	  }
  }

	const classes = useStyles()
	return (
		<div className={styles.userProfile}>
			<div className={styles.userProfileAvatar}> 
				<UserAvatar 
					color={color}
					className={classes.avatar} 
					name={user.username} 
					badge='false' 
				/>
			</div>
			<div className={styles.userProfileProps}>
				<div className={[styles.userProfilePropsChild, classes.userInfo].join(' ')}>
					<div>
						<Typography variant='subtitle1'> {user.username} </Typography>
					</div>
					
				</div>
				<div className={[styles.userProfilePropsChild, classes.userInfo].join(' ')}>
				{editBio ? 
					<>
						<TextField variant='standard' value={bioValue} onChange={editBioInput} onBlur={()=> setInputVisibility('bio')} placeholder='Bio' className={classes.input} />
						<IconButton onClick={()=> setInputVisibility('bio')} >
							<CheckIcon fontSize='medium' />
						</IconButton> 
					</> 
					: <>
						<div>
							{ bio === '' &&
								<Tooltip arrow open={_open} onClose={_handleClose} onOpen={_handleOpen} title="Describe yourself in less than 10 words">
					      <IconButton className={classes.info}>
					      	<InfoIcon style={{fontSize: '17'}} />
					      </IconButton>
					    </Tooltip>
					  }
							<Typography variant='subtitle1' className={classes.bio} > {bio} </Typography>
						</div>
						{loader ? <Preloader use={Oval} size={20} strokeWidth={7} strokeColor='#000' duration={800} />
						: <IconButton onClick={()=> setInputVisibility('bio')} > 
							<EditIcon fontSize='medium' />
						</IconButton>}
					</>
				}

				</div>
			</div>
			
		</div>
	)
}
const Account = () => {
	const dispatch = useDispatch()
	const user = useSelector(state => state.globalProps.user.contacts)
	const settings = useSelector(state => state.globalProps.user.settings)
	const classes = useStyles()
	const setComp = (obj) => {
		dispatch(setComponents(obj))
	}
	 
  const toggleChecked = (e) => {
    // setChecked({...checked, [e.target.name]: e.target.checked});
  	fetch('/savePreferences', {
  		method: 'post',
  		headers: {
  			'Content-Type': 'application/json'
  		},
  		body: JSON.stringify({id: user.id, obj: {notifications: !settings.notifications}})
  	})
  	.then(res => res.json())
  	.then(res => {
  		dispatch(changeSettings(res.data))
  	})
  };
	return (
		<div className={styles.mainSettings}>
		
			<div className={styles.subSettings} >
				{/*<Typography component='h6'> Account </Typography>*/}
				<div className={styles.settingsElements}>
					<div className={styles.subItem} onClick={() => setComp(
						{	component: 'contactInfo', value: true	}	
					)} >
						<span> <LocalPhoneIcon fontSize='inherit' /> Contact Info </span> 
						{/*<NavigateNextIcon fontSize='inherit'/> */}
					</div>

					<div className={styles.subItem} onClick={() => setComp(
						{	component: 'resetPassword', value: true	}
						)} > 
						<span> <LockIcon fontSize='inherit' /> Reset Password </span> 
						{/*<NavigateNextIcon fontSize='inherit'/>*/}
					</div>

					{/*<div className={styles.subItem} onClick={() => setComp(
						{	component: 'privacy', value: true	}	
					)} >
						<span> <SecurityIcon fontSize='inherit' /> Privacy and Security </span> <NavigateNextIcon fontSize='inherit'/> 
					</div>*/}
				</div>
			</div>
			<div className={styles.subSettings} >
				{/*<Typography component='h6'> Preferences </Typography>*/}
				<div className={styles.settingsElements}>
					<div className={styles.subItem}> <span> Notifications </span>
						<Switch name='notifications' size="small" checked={settings.notifications} onChange={toggleChecked} />
					</div>
					{/*<div className={styles.subItem}> <span> Show status </span><Switch name='status' size="small" checked={settings.status} onChange={toggleChecked} /></div>*/}
				</div>
			</div>
			
		</div>
	)
}


const Settings = () => {
	const dispatch = useDispatch()
	const setComp = (obj) => {
  	dispatch(setComponents(obj))
  }
	const user = useSelector(state => state.globalProps.user.contacts)

	const [feedback, assignFeedbackInput] = React.useState('')
	const setFeedback = (e) => {
		assignFeedbackInput(e.target.value)
	}

  const performLogout = () => {
  	fetch(`http://localhost:3000/feedback/${user.id}`, {
  		method: 'post',
  		headers: {
  			'Content-Type': 'application/json'
  		},
  		body: JSON.stringify({feedback: feedback}),
  		keepalive: true
  	})
  	localStorage.removeItem('details')
  	localStorage.removeItem('messages')
  	localStorage.removeItem('settings')
  	window.location.pathname = ''
  }
  const [height, setHeight] = React.useState(`${window.innerHeight - 50}px`)
  window.onresize = () => {
  	setHeight(`${window.innerHeight - 50}px`)
  }
  const [anchorEl, setAnchorEl] = React.useState({
  	dialog: null, menu: null
  })
	const open = {
		dialog: Boolean(anchorEl.dialog), 
		menu: Boolean(anchorEl.menu)
	}

	const toggleMenu = (ele, event) => {
		if (ele === 'menu')	setAnchorEl({...anchorEl, menu: event.target})
		if (ele === 'dialog') setAnchorEl({...anchorEl, dialog: event.target})
	}

	const handleClose =(ele) => {
		if (ele === 'menu') setAnchorEl({...anchorEl, menu: null})
		if (ele === 'dialog') setAnchorEl({...anchorEl, dialog: null})
	}
	
	const classes = useStyles()
	return (
		<section className={[styles.component, styles.settings, styles.animate__animated, styles.animate__fadeInLeft].join(' ')} >
			<AppBar position="static" className={classes.app} >
			  <Toolbar className={classes.toolbar} >
			  	<div className={classes.headerItem} >
				    <IconButton edge="start" color="inherit" aria-label="back" onClick={() => {
				    	setComp({component: 'recentChats', value: true})
				    }} >
				      <KeyboardBackspaceIcon className={classes.backBtn} />
				    </IconButton>
				    <Typography variant="h6" className={classes.h6} classes={{root: styles.appH6}}>
				      Settings
				    </Typography>
			    </div>
			    <div className={classes.headerItem}>
			    	<IconButton onClick={(e) => toggleMenu('menu', e)}> 
							<MoreVertIcon color='disabled' />
						</IconButton>
			    	<Menu open={false} variant='menu' anchorEl={anchorEl.menu}
			    	 onClose={() => handleClose('menu')} getContentAnchorEl={null} anchorOrigin={{
					      vertical: 'top',
					      horizontal: 'center',
					    }}
					    transformOrigin={{
				      vertical: 'top',
				      horizontal: 'right',
				    }}>
							<MenuItem onClick={(e) => handleClose('menu')}>
								<AddAPhotoIcon style={{fontSize: '21px'}} />
								<Typography component='span' style={{marginLeft: '5px', fontSize: '14.5px'}}> Upload a photo </Typography>
							</MenuItem>
						</Menu>
			    </div>
			  </Toolbar>
			</AppBar>
			<section className={[styles.settingsComp,classes.appBody].join(' ')} style={{
				height: height
			}}>
				{<Profile />}
				<Account />
				<IconButton onClick={(e) => toggleMenu('dialog', e)} className={[classes.logout, styles.logout].join(' ')}>
					<ExitToAppIcon style={{fontSize: '21px'}} />
					<Typography component='span' style={{marginLeft: '10px'}}> Log out </Typography>
				</IconButton>
				<Dialog open={open.dialog} onClose={() => handleClose('dialog')} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Log out</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Leave a feedback
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="feedback"
            label="Feedback"
            type="text"
            onChange={setFeedback}
            value={feedback}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose('dialog')} color="primary">
            Cancel
          </Button>
          <Button onClick={performLogout} color="primary">
            Log out
          </Button>
        </DialogActions>
      </Dialog>
			</section>
		</section>
	)
}

export default Settings