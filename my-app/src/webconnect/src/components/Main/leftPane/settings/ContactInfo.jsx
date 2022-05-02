import React from 'react'
import styles from '../../../../stylesheet/main.module.css'
import { useDispatch, useSelector } from 'react-redux'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace'
import EditIcon from '@material-ui/icons/Edit'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import IconButton from '@material-ui/core/IconButton'
import { setComponents, changeSettings } from '../../../../Redux/globalPropsSlice'
import { makeStyles } from '@material-ui/core/styles'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import LockIcon from '@material-ui/icons/Lock'
// import Menu from '@material-ui/core/Menu'
// import MenuItem from '@material-ui/core/MenuItem'
// import MoreVertIcon from '@material-ui/icons/MoreVert'
// import FacebookIcon from '@material-ui/icons/Facebook'
// import TwitterIcon from '@material-ui/icons/Twitter'
// import TextField from '@material-ui/core/TextField';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
import Switch from '@material-ui/core/Switch';
import PublicIcon from '@material-ui/icons/Public';

const useStyles = makeStyles({
	app: {
		background: '#fff',
		boxShadow: 'none',
		borderBottom: '1px solid #d1d1d1',
		fontSize: '90%',
		padding: '13px 0'
	},
	toolbar:{
		justifyContent: 'space-between',
		minHeight: 'auto',
		paddingRight: '10px',
		paddingLeft: '15px'
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
	backBtn: {
		fontSize: '1.2rem !important'
	},
	contactBody: {
		padding: '20px 20px 20px 0',
		position: 'relative'
	},
	contactsGroup: {

	},
	contactsItem: {
		marginBottom: '20px',
		position: 'relative',
		overflow: 'hidden',
		paddingLeft: '15px',
		borderLeft: '1px solid #cdcdcd',
		'& ::after': {
			content: '',
			position: 'absolute',
			height: '10px',
			width: '100%',
			background: '#000'
		}
	},
	itemHeader: {
		'& h6': {
			letterSpacing: '.5px',
			fontSize: '101.5%'
		},
		'& h6:first-child': {
			color: '#000'
		},
		'& h6:last-of-type': {
			color: '#6495ed',
			marginLeft: '5px',
			'& span': {
				fontSize: '90%',
				color: '#9f9f9f',
				fontStyle: 'italic'
			}
		}
	},
	addContact: {
		position: 'absolute',
		bottom: '30%',
		right: '29px'
	},
	menu: {
		'& div': {
			boxShadow: 'none',
			background: 'transparent'
		},
		'& button': {
			display: 'block'
		}
	},
	itemBody: {
		paddingLeft: '5px',
	},
	priv: {
		'& span': {
			fontSize: '14px',
		},
		display: 'flex', 
		float: 'right'
	},
	privacyState: {
		display: 'flex',
		alignItems: 'center',
		marginLeft: '10px'
	},
	appBody: {
		overflow: 'scroll'
	}

})

const ContactInfo = () => {
	const classes = useStyles()
	const user = useSelector(state => state.globalProps.user.contacts)
	const gmailPrivacy = useSelector(state => state.globalProps.user.settings.privacy.gmail)
	const dispatch = useDispatch()
	const setComp = (obj) => {
		dispatch(setComponents(obj))
	}
	const [value, setValue] = React.useState('');
  const [privacy, setPrivacy] = React.useState(false)
  const toggleChecked = () => {
  	fetch('/savePreferences', {
  		method: 'post',
  		headers: {
  			'Content-Type': 'application/json'
  		},
  		body: JSON.stringify({id: user.id, obj: {privacy: {gmail: !gmailPrivacy}}})
  	})
  	.then(res => res.json())
  	.then(res => {
  		dispatch(changeSettings(res.data))
  	})
  }
	// const [anchorEl, setAnchorEl] = React.useState({
 //  	addButton: null, dialog: null
 //  })
 //  const [clickedSocial, setClickedSocial] = React.useState('')
	// const open = {
	// 	addButton: Boolean(anchorEl.addButton),
	// 	dialog: Boolean(anchorEl.dialog)
	// }
	// const handleClickSocials = (type) => {
	// 	setClickedSocial(type)
	// }
	// const toggleMenu = (ele, event) => {
	// 	if (ele === 'addButton') setAnchorEl({...anchorEl, addButton: event.target})
	// 	if (ele === 'dialog') setAnchorEl({...anchorEl, dialog: event.target})
	// }
	
	// const handleClose =(ele) => {
	// 	if (ele === 'addButton') setAnchorEl({...anchorEl, addButton: null})
	// 	if (ele === 'dialog') setAnchorEl({...anchorEl, dialog: null})
	// }
	 const [height, setHeight] = React.useState(`${window.innerHeight - 30}px`)
  window.onresize = () => {
  	setHeight(`${window.innerHeight - 30}px`)
  }
	return (
		<section className={[styles.component, styles.contactInfo, styles.animate__animated, styles.animate__fadeInRight].join(' ')}>
			<AppBar position="static" className={classes.app} >
			  <Toolbar className={classes.toolbar} >
			  	<div className={classes.headerItem} >
				    <IconButton edge="start" color="inherit" aria-label="back" onClick={() => {
				    	setComp({component: 'settings', value: true})
				    }} >
				      <KeyboardBackspaceIcon className={classes.backBtn} />
				    </IconButton>
				    <Typography variant="h6" className={classes.h6} classes={{root: styles.appH6}}>
				      Contact Info
				    </Typography>
			    </div>
			    
			  </Toolbar>
			</AppBar>
			<div className={[classes.contactBody, styles.appBody, styles.settingsComp].join(' ')} style={{
				height: height
			}} >
				<div className={classes.contactsGroup}>

					<div className={classes.contactsItem}>
						<div className={classes.itemHeader}>
							<Typography component='h6'> Name </Typography>
							<Typography component='h6'> {user.username} </Typography>
						</div>
					</div>

					<div className={classes.contactsItem}>
						<div className={classes.itemHeader}>
							<Typography component='h6'> Email Address </Typography>
							<Typography component='h6'> {user.email} <span> (primary) </span>  </Typography>
						</div>
						<div className={classes.itemBody}>
							<div className={classes.priv} >
								<Typography component='span'> Privacy: </Typography>
								<Switch name='privacy' size="small" checked={gmailPrivacy} onChange={toggleChecked} />
								{gmailPrivacy ? 
									<div className={classes.privacyState} >
										<LockIcon style={{fontSize: '1rem', margin: '0px 2px 0px 5px'}} />
										<Typography component='span'> Only me </Typography>
									</div>
								: <div className={classes.privacyState} >
										<PublicIcon style={{fontSize: '1rem', margin: '0px 2px 0px 5px'}} />
										<Typography component='span'> Public </Typography>
									</div>
								}
							</div>
							
						</div>
					</div>

					{/*<div className={classes.contactsItem}>
						<div className={classes.itemHeader}>
							<Typography component='h6'> Phone Number </Typography>
							<Typography component='h6'> null </Typography>
						</div>
						<div className={classes.itemBody}>
							
						</div>
					</div>*/}
				</div>

				{/*<div className={[classes.addContact, styles.animate__animated, styles.animate__fadeIn].join(' ')}>
		    	<Menu open={open.addButton} variant='menu' anchorEl={anchorEl.addButton}
		    	 onClose={() => handleClose('addButton')} getContentAnchorEl={null} anchorOrigin={{
				      vertical: 'top',
				      horizontal: 'center',
				    }}
				    transformOrigin={{
			      vertical: 'bottom',
			      horizontal: 'center',}}
			      className={classes.menu}
			      >
						<IconButton onClick={(e) => {
							handleClose('addButton')
							toggleMenu('dialog', e)
							handleClickSocials('facebook')
							}
						}>
							<FacebookIcon style={{color: '#507bc7', fontSize: '3rem'}} />
						</IconButton>
						<IconButton onClick={(e) => {
							handleClose('addButton')
							toggleMenu('dialog', e)
							handleClickSocials('twitter')
							}
						}>
							<TwitterIcon style={{color: '#1DA1F2', fontSize: '3rem'}} />
						</IconButton>
					</Menu>
					<IconButton onClick={ (e) => toggleMenu('addButton',e)}>
						<AddCircleIcon color='primary' style={{fontSize: '2.8rem'}} />
					</IconButton>
				</div>*/}
			</div>
			{/*<Dialog open={open.dialog} onClose={(e) => handleClose('dialog')} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title"> Add contact information </DialogTitle>
        <DialogContent>
          <DialogContentText>
           {`Enter your ${clickedSocial} handle`}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => handleClose('dialog')} color="primary">
            Cancel
          </Button>
          <Button onClick={(e) => handleClose('dialog')} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>*/}
		</section>
	)
}

export default ContactInfo