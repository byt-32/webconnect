import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Input from '@material-ui/core/Input';

import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import { Preloader, Oval } from 'react-preloader-icon'

import InfoIcon from '@material-ui/icons/Info'
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

import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';

import { Link } from 'react-router-dom'

import { setComponents} from '../../../../Redux/features/componentSlice'
import { updateSettings} from '../../../../Redux/features/accountSlice'

import UserAvatar from '../../UserAvatar'
import Header from '../Header'

const useStyles = makeStyles((theme) => ({
	banner: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		paddingTop: '1rem'
	},
	profileInfo: {
		padding: '1rem 0',
		width: '100%'
	},
	info: {
		width: '90%',
		margin: '0 auto',
		justifyContent: 'center',
		alignItems: 'center',
		display: 'flex',
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
    		color: '#7a5d4f'
    	}
    },
    '& > .MuiListItem-root': {
    	'& .MuiTypography-body1': {
    		color: '#6a3f3c'
    	}
    },
    '& .MuiCollapse-root': {
    	'& .MuiTypography-body1, .MuiSvgIcon-root': {
    		color: '#856260'
    	}, 
    }
	},
	nested: {
		paddingLeft: theme.spacing(4),
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

const Settings = () => {
	const {id} = JSON.parse(localStorage.getItem('details'))
	const classes = useStyles()
	const dispatch = useDispatch()
	const { username, bio, status, email, settings} = useSelector(state => state.account.account)
	
	const setComp = (obj) => {
		dispatch(setComponents(obj))
	}
	const handleSettings = (obj) => {
		fetch('/user/updateSettings', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({id: id, obj: obj})
		})
		.then(res => res.json())
		.then(settings => {
			// console.log(settings)
			dispatch(updateSettings(settings))
		})
	}
	return (
		<>
			<Header>
				<IconButton onClick={() => setComp({component: 'recentChats', value: true})}>
					<KeyboardBackspaceIcon />
				</IconButton>
				<Typography > Profile </Typography>
			</Header>
			<div className={classes.profileBody}>
				<div className={classes.banner}>
					<div className={classes.profileImage}>
		        <UserAvatar username={username} style={{
		        	width: 200, height: 200, fontSize: '4rem'
		        }} badge={false} />
					</div>
					<div className={classes.profileInfo}>
						<div className={classes.info}>
							<Typography variant='h2' > {username} </Typography>
							
						</div>
						{bio !== '' &&
						 <div className={classes.info}>
							<Typography > {bio} </Typography>
						</div> }
					</div>
				</div>
				<Divider />
				<div className={classes.settings}>
					<List
			      component="nav"
			      aria-labelledby="nested-list-subheader"
			      subheader={
			        <ListSubheader component="div" id="nested-list-subheader">
			          settings
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
			          <ListItem button className={classes.nested}>
			            <ListItemText primary="Contact info" />
			            <NavigateNextIcon />
			          </ListItem>
			          <ListItem button className={classes.nested}>
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
		</>
	)
}

export default Settings