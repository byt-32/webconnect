import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import Snackbar from '@material-ui/core/Snackbar'
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Switch from '@material-ui/core/Switch';
import Collapse from '@material-ui/core/Collapse';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import CheckIcon from '@material-ui/icons/Check'

import Divider from '@material-ui/core/Divider';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditAttributesIcon from '@material-ui/icons/EditAttributes';
import PublicIcon from '@material-ui/icons/Public';
import AddCircleIcon from '@material-ui/icons/AddCircle'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace'
import EditIcon from '@material-ui/icons/Edit'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import LockIcon from '@material-ui/icons/Lock'
import CallIcon from '@material-ui/icons/Call';
import DraftsIcon from '@material-ui/icons/Drafts';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import TwitterIcon from '@material-ui/icons/Twitter';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import DeleteIcon from '@material-ui/icons/Delete';

import {CSSTransition } from 'react-transition-group'
import { makeStyles } from '@material-ui/core/styles'

import { setComponents } from '../../../../Redux/features/componentSlice'
import { setNewSocial, handleDeleteSocial } from '../../../../Redux/features/accountSlice'

import Header from '../../Header'
import NetworkProgress from './NetworkProgress'
import { assert, handleFetch } from '../../../../lib/script'

const useStyles = makeStyles({
	contactInfo: {
		position: 'relative',
		height: '100%'
	},
	list: {
		'& .MuiListItem-root': {
			'& .MuiAvatar-root': {
				backgroundColor: '#9696b9'
			},
			'& .MuiListItemText-primary': {
				color: '#3c1908',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				whitSpace: 'nowrap',
				padding: '0 14px 0 0'
			},
			'& .MuiTypography-body2': {
				display: 'flex',
				alignItems: 'center',
				'& .MuiSvgIcon-root': {
					fontSize: '1.1rem',
					marginRight: 5,
					color: '#4c4c6c'
				}
			},
		}
	},
	speedDial: {
		alignItems: 'flex-end',
		position: 'absolute',
		bottom: '1rem',
		right: '1rem',
		'& .MuiFab-primary': {
			background: 'cornflowerblue',
			color: '#fff'
		}
	},
	collapseDiv: {
		display: 'flex',
		justifyContent: 'center'
	},
	addLinkInput: {
		width: '70%'
	},
	privacy: {
		textTransform: 'initial'
	},
	socialList: {
		'& .MuiListItemSecondaryAction-root': {
			right: 5,
			display: 'flex',
			'& .MuiIconButton-root': {
				'& svg': {
					fontSize: '1.2rem',
					color: '#e98181'
				}
			},
			'& .MuiIconButton-root:first-child': {
				'& svg': {
					color: '#5d7297'
				}
			},
			
		}
	},
	bottomSnackbar: {
		position: 'absolute',
		width: '100%',
		bottom: '5rem'
	}
})


const actions = [
	{icon: <TwitterIcon style={{color: '#1DA1F2'}} /> , name: 'twitter'},
	{icon: <FacebookIcon style={{color: '#4267B2'}} /> , name: 'facebook'},
	{icon: <InstagramIcon style={{color: '#C13584'}} /> , name: 'instagram'},
]

const ContactInfo = ({className}) => {
	const {id} = JSON.parse(localStorage.getItem('details'))
	const dispatch = useDispatch()
	const classes = useStyles()
	const [showDial, setDial] = React.useState(false)
	const {username, socials, online} = useSelector(state => state.account.account)
	const showLoader = useSelector(state => state.account.account.showLoader)
	const [showProgress, setProgress] = React.useState(false)
	const [open, setOpen] = React.useState(false);
	const [expand, setExpand] = React.useState(false)
	const [openAlert, setAlert] = React.useState({
		show: false, message: ''
	})

	const [error, setError] = React.useState({
		error: false, helperText: ''
	})
	const email = socials.find(i => i.name === 'email')

	const [newSocial, setInput] = React.useState({
		open: false,
		icon: '',
		social: {
			name: '',
			link: '',
			hidden: true
		}
	})
	const [isValidatingLink, setValidating] = React.useState(false)

	const validateInput = (text) => {
		if (!text.includes('https://')) {
			return {error: true, helperText: 'Link must contain https://'}
		} else if (text === 'https://') {
			return {error: true, helperText: 'Complete the link with your username'}
		}
		return {error: false, helperText: ''}
	}

	
	const setComp = (obj) => {
		dispatch(setComponents(obj))
	}

	const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const showCollapse = () => {
  	setExpand(!expand)
  }

  const addSocial = ({icon, name}) => {
  	setInput({open: true, icon: icon, social: {
  		name,
  		link: '',
  		hidden: true
  	}})
  }

	const handleInput = ({target}) => {
		setInput({
			...newSocial,
			social: {
				...newSocial.social,
				link: target.value.trim()
			}
		})
		if (error.error) setError({error: false, helperText: ''})
	}

  const updateSocial = () => {
  	const value = validateInput(newSocial.social.link)

  	setError({...value})

  	if (!value.error && online) {
  		handleFetch( `/user/updateSocials/${id}`, 'put', newSocial.social, () => {})

  		dispatch(setNewSocial(newSocial.social))
  	}
  }

  const changePrivacy = (social) => {
  	handleFetch(`/user/updateSocials/${id}`, 'put', social)
  	dispatch(setNewSocial(social))
  	setAlert({show: true, message: 'Privacy updated'})
  }

  const deleteSocial = (social) => {
  	handleFetch(`/user/deleteSocial/${id}`, 'delete', social, () => {})
  	dispatch(handleDeleteSocial(social))
  	setAlert({show: true, message: 'Contact deleted successfully'})
  }
  const closeAlert = () => {
  	setAlert({show: false, message: ''})
  }

	return (
			<section className={[classes.contactInfo, className].join(' ')} >
				
				<Header>
					<IconButton onClick={() => setComp({component: 'settings', value: true})}>
						<KeyboardBackspaceIcon />
					</IconButton>
					<Typography component='h6'> Contact info </Typography>
					{ showProgress &&
						<NetworkProgress />
					}
				</Header>

				{showLoader ? 
					<> </>
				:
				<div className={classes.contactBody}>
					<List className={classes.list} >
						<ListItem button>
							<ListItemAvatar>
				        <Avatar>
				          <DraftsIcon />
				        </Avatar>
				      </ListItemAvatar>
				      <ListItemText primary={email.link} secondary={
				      	<Button className={classes.privacy} onClick={() => {
		      				changePrivacy({...email, hidden: !email.hidden})
					      	}} >
					      		{email.hidden ? 
					      		<> <LockIcon />
					      			<Typography variant='subtitle2' component='span'> Only me </Typography>
					      		</>
					      		:
					      		<><PublicIcon />
					      			<Typography variant='subtitle2' component='span' > Public </Typography>
					      		</> }
					      		
					      	</Button>
				      } />
				     </ListItem>

				     {
				     	<List className={classes.socialList} subheader={
				        <ListSubheader component="div" id="nested-list-subheader">
				          Other social handles
				        </ListSubheader>
				      }>
				      	{
				      		socials.filter(i => i.name !== 'email').map((social, i) => {
										const {icon} = actions.find(i => i.name === social.name)
				      			return (
				      				<ListItem button key={i} > 
												<ListItemAvatar>
										      <IconButton>
										        {icon}
										      </IconButton>
										    </ListItemAvatar>
										    <ListItemText 
										    	primary={
										    		<a style={{textDecoration: 'underline'}} 
										    			target='_blank' rel='noreferrer' href={social.link}> {social.link.replace('https://', '')} </a>
										    	}
										    	secondary={
										      	<Button className={classes.privacy} onClick={() => {
										      		changePrivacy({...social, hidden: !social.hidden})
										      	}} >
										      		{social.hidden ? 
										      		<> <LockIcon />
										      			<Typography variant='subtitle2' component='span'> Only me </Typography>
										      		</> 
										      		:
										      		<><PublicIcon />
										      			<Typography variant='subtitle2' component='span' > Public </Typography>
										      		</>}
										      		
										      	</Button>
										    	} 

										    />
										    	<ListItemSecondaryAction>
										    	<IconButton onClick={() => addSocial({name: social.name, icon})}>
										    		<EditIcon />
										    	</IconButton>
										  		<IconButton onClick={() => deleteSocial(social)} >
										    		<DeleteIcon />
										    	</IconButton>
											  </ListItemSecondaryAction>
										  </ListItem>
			 							)
				      		})
				      	}
				     	</List>
				     }

				     {newSocial.open &&
				     	<Fade in={newSocial.open}>
					     	<ListItem>
						      <ListItemAvatar>
						        {newSocial.icon}
						      </ListItemAvatar>
						      <TextField
						      	className={classes.addLinkInput}
								  	placeholder={`Enter a link`}
								  	onChange={handleInput}
										error={error.error}
										helperText={error.helperText}
								  	value={newSocial.social.link}
								  />
								  <InputAdornment position="end" style={{height: '100%'}}>
										<IconButton onClick={updateSocial} >
						      		<CheckIcon style={{color: '#645faf'}} />
						      	</IconButton>
									</InputAdornment>
						    </ListItem>
						   </Fade>
				     }

					</List>

					<Snackbar 
						className={classes.bottomSnackbar}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'center',
						}}
						autoHideDuration={2000} 
						message={openAlert.message}
						open={openAlert.show}
						onClose={closeAlert}
					>
					<MuiAlert variant='filled' elevation={6} onClose={closeAlert} severity="success">
				    {openAlert.message}
				  </MuiAlert>
				</Snackbar>

					<SpeedDial
		        ariaLabel="SpeedDial openIcon"
		        className={classes.speedDial}
		        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
		        onClose={handleClose}
		        onOpen={handleOpen}
		        open={open}
		      >
		        {actions.map((action, i) => (
		          <SpeedDialAction
		          	key={i}
		          	style={{...action.style, color: '#000'}}
		            key={action.name}
		            icon={action.icon}
		            tooltipTitle={action.name}
		            onClick={() => {
		            	handleClose()
		            	addSocial(action)
		            }}
		          />
		        ))}
		      </SpeedDial>
				</div>}
			</section>
	)
}

export default ContactInfo