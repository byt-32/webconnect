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
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Switch from '@material-ui/core/Switch';
import Collapse from '@material-ui/core/Collapse';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Divider from '@material-ui/core/Divider';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import CheckIcon from '@material-ui/icons/Check'
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

import { makeStyles } from '@material-ui/core/styles'

import { setComponents } from '../../../../Redux/features/componentSlice'
import { updateSocial } from '../../../../Redux/features/accountSlice'

import Header from '../Header'
import NetworkProgress from './NetworkProgress'

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
				wordBreak: 'break-all'
			},
			'& .MuiTypography-body2': {
				display: 'flex',
				alignItems: 'center',
				'& .MuiSvgIcon-root': {
					fontSize: '1.1rem',
					marginRight: 5,
					color: '#858587'
				}
			},
		}
	},
	speedDial: {
		alignItems: 'flex-end',
		position: 'absolute',
		bottom: '8rem',
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
	socialList: {
		'& .MuiButton-text': {
			textTransform: 'initial'
		},
		'& .MuiListItemSecondaryAction-root': {
			right: 5,
			'& .MuiIconButton-root': {
				'& svg': {
					fontSize: '1.3rem',
					color: '#e98181'
				}
			},
			'& .MuiIconButton-root:first-child': {
				'& svg': {
					color: '#5d7297'
				}
			},
			
		}
	}
})

const actions = [
	{icon: <TwitterIcon style={{color: '#1DA1F2'}} /> , name: 'Twitter'},
	{icon: <FacebookIcon style={{color: '#4267B2'}} /> , name: 'Facebook'},
	{icon: <InstagramIcon style={{color: '#C13584'}} /> , name: 'Instagram'},
]

const ContactInfo = () => {
	const {id} = JSON.parse(localStorage.getItem('details'))
	const dispatch = useDispatch()
	const classes = useStyles()
	const [showDial, setDial] = React.useState(false)
	let {username, gmail, privacy, socials} = useSelector(state => state.account.account)
	const [showProgress, setProgress] = React.useState(false)
	const [open, setOpen] = React.useState(false);
	const [expand, setExpand] = React.useState(false)
	const [value, setValue] = React.useState('');

	const [error, setError] = React.useState(false)
	const [help, setHelp] = React.useState('')

	const [openNewInput, setNewInput] = React.useState({
		open: false,
	})
	const [isValidatingLink, setValidating] = React.useState(false)
	const [input, setInput] = React.useState('')

	const handleInput = ({target}) => setInput(target.value.trim())
	const listenForEnter = (e) => {
		setError(false)
		setHelp('')
		if (e.key === "Escape") {
			setNewInput({open: false})
		}
		if (e.key === 'Enter') {
			if (input !== '') {
				if (!input.includes('https://')) {
					setError(true)
					setHelp('Link must contain https://')
				} else if (input === 'https://') {
					setError(true)
					setHelp('Complete the link with your username')
				} else {
					setProgress(true)
					fetch(`/user/updateSocials/${id}`, {
						method: 'put',
			  		headers: {
			  			'Content-Type': 'application/json'
			  		},
			  		body: JSON.stringify({
			  			name: openNewInput.name, 
			  			link: input.replace('https://', '')
			  		})
			  	})
			  	.then(res => res.json())
			  	.then(res => {
			  		setProgress(false)
			  		dispatch(updateSocial(res))
			  	})
				}
			} else {
				setNewInput({open: false})
			}
		}
	}
	// React.useEffect(() => {

	// }, [])

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

 	const addNewInfo = (which) => {
 		setNewInput({open: true, ...which})
 	}

 	const handleDelete = (which) => {
 		setProgress(true)
 		fetch(`/user/deleteSocial/${id}`, {
 			method: 'delete',
 			headers: {
  			'Content-Type': 'application/json'
  		},
  		body: JSON.stringify(which)
 		}).then(res => res.json())
 		.then(res => {
 			dispatch(updateSocial(res))
 			setProgress(false)
 		})
 	}

  const handlePrivacySettings = (which) => {
  	console.log(which)
  	fetch('/user/updatePrivacy', {
  		method: 'post',
  		headers: {
  			'Content-Type': 'application/json'
  		},
  		body: JSON.stringify({})
  	})
  	.then(res => res.json())
  	.then(res => {
  		dispatch(changeSettings(res.data))
  	})
  }
	return (
		<section className={classes.contactInfo} >
			
			<Header>
				<IconButton onClick={() => setComp({component: 'settings', value: true})}>
					<KeyboardBackspaceIcon />
				</IconButton>
				<Typography > Contact info </Typography>
				{ showProgress &&
					<NetworkProgress />
				}
			</Header>

			<div className={classes.contactBody}>
				<List className={classes.list} >
					<ListItem button>
						<ListItemAvatar>
			        <Avatar>
			          <DraftsIcon />
			        </Avatar>
			      </ListItemAvatar>
			      <ListItemText primary={gmail} secondary={
			      	privacy.gmail ? 
			      		<><LockIcon />
			      			<Typography variant='subtitle2' component='span' > Only me </Typography>
			      		</> : 
			      		<> <PublicIcon />
			      			<Typography variant='subtitle2' component='span'> Public </Typography>
			      		</>
			      } />
			     </ListItem>

			     {
			     	<List className={classes.socialList} subheader={
			        <ListSubheader component="div" id="nested-list-subheader">
			          Other social handles
			        </ListSubheader>
			      }>
			      	{socials.map(social => {
			      		const find = actions.find(i => i.name === social.name)
			      		if (find !== undefined) {
			      			return (
			      				<ListItem button key={social.name} > 
											<ListItemAvatar>
								        <IconButton>
								          {find.icon}
								        </IconButton>
								      </ListItemAvatar>
								      <ListItemText primary={<a style={{textDecoration: 'underline'}} target='_blank' href={`https://${social.link}`}> {social.link} </a>}
								      	secondary={
								      	<Button onClick={() => {
								      		handlePrivacySettings(social)
								      	}} >
								      		{privacy[`${find.name}`] ? 
								      		<><LockIcon />
								      			<Typography variant='subtitle2' component='span' > Only me </Typography>
								      		</> : 
								      		<> <PublicIcon />
								      			<Typography variant='subtitle2' component='span'> Public </Typography>
								      		</>}
								      	</Button>
								      	
								      } />
								      <ListItemSecondaryAction>
								      	<IconButton onClick={() => {
	            						addNewInfo(find)
								      	}}>
								      		<EditIcon />
								      	</IconButton>
							      		<IconButton onClick={() => {
							      			handleDelete(social)
							      		}} >
								      		<DeleteIcon />
								      	</IconButton>
								      </ListItemSecondaryAction>
								    </ListItem>
			      			)
			      		}
			      	})}
			     	</List>
			     }

			     {
			     	openNewInput.open &&
			     	<Fade in={openNewInput.open}>
				     	<ListItem>
					      <ListItemAvatar>
					        {openNewInput.icon}
					      </ListItemAvatar>
					      <TextField
					      	className={classes.addLinkInput}
							  	placeholder={`Enter a link`}
							  	onKeyUp={listenForEnter}
							  	onChange={handleInput}
									error={error}
									helperText={help}
							  	value={input}
							  />
					    </ListItem>
					   </Fade>
			     }

				</List>

				<SpeedDial
	        ariaLabel="SpeedDial openIcon"
	        className={classes.speedDial}
	        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
	        onClose={handleClose}
	        onOpen={handleOpen}
	        open={open}
	      >
	        {actions.map((action) => (
	          <SpeedDialAction
	          	style={{...action.style, color: '#000'}}
	            key={action.name}
	            icon={action.icon}
	            tooltipTitle={action.name}
	            onClick={() => {
	            	handleClose()
	            	addNewInfo(action)
	            }}
	          />
	        ))}
	      </SpeedDial>
			</div>
		</section>
	)
}

export default ContactInfo