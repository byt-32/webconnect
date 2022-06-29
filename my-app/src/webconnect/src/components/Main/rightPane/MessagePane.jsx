import React from 'react'

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton'
import InputBase from "@material-ui/core/InputBase";
import Menu from '@material-ui/core/Menu'
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem'
import Fade from '@material-ui/core/Fade';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar'

import SendIcon from '@material-ui/icons/Send';
import TagFacesIcon from '@material-ui/icons/TagFaces';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import AddIcCall from '@material-ui/icons/AddIcCall';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CloseIcon from '@material-ui/icons/Close';

import common from '@material-ui/core/colors/common';

import { makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';

import { useDispatch,useSelector } from 'react-redux'
import { retrieveOTM, storePrivateChats, handleReply } from '../../../Redux/features/chatSlice'

import ChatMessages from './ChatMessages'
import UserAvatar from '../UserAvatar'
import { useWindowHeight } from '../../../customHooks/hooks'

const useStyles = makeStyles({
	emoji: {
		fill: '#363636',
		cursor: 'pointer'
	},
	error: {
		position: 'fixed',
		zIndex: '999',
		right: '10px',
		bottom: '50px'
	},
	messagesChats: {

	},
	card: {
		boxShadow: 'none',
		height: '100%',
		background: 'transparent',
		flexDirection: 'column',
		'& .MuiCardHeader-root': {
			background: common.white,
    	boxShadow: '-3px 1px 1px 0px #cbcbcb',
			height: '3.7rem',
			padding: '0 16px',
			'& .MuiCardHeader-title': {
				fontWeight: 'bold'
			}
		},
		'& .MuiCardHeader-action': {
			alignSelf: 'center'
		},
		'& .MuiCardContent-root': {
			background: grey[200],
			padding: '8px 16px',
			overflowY: 'scroll'
		},
		'& .MuiCardActions-root': {
			background: common.white,
		},
		'& .MuiInputBase-root': {
			flex: 1,
		},
		'& .MuiInputBase-inputMultiline': {
			maxHeight: 70,
			overflowY: 'scroll !important'
		}
	}
})
const MessagesPane = ({friend}) => {
	const classes = useStyles()

	const dispatch = useDispatch()
	// const user = useSelector(state => state.activeUsers.activeUsers.find(i => i.username === friend.username))
	const selectedUser = useSelector(state => state.other.currentSelectedUser)
	const accountIsOnline = useSelector(state => state.account.account.online)
	
	const [anchorEl, setAnchorEl] = React.useState(null)
	const [isTyping, typing] = React.useState(false)
	const [input, setInput] = React.useState('')
	const [showPicker, setPicker] = React.useState(false)
	const [networkError, setNetworkError] = React.useState(false)
	const [online, setOnline] = React.useState('')

	// console.log(user)
	const toggleMenu = (event) => {
		setAnchorEl(event.target)
	}
	const handleClose =() => {
		setAnchorEl(null)
	}
	
	const handleTextInput = (e) => {
		setInput(e.target.value)
	}
	const hideNetworkError = () => {
		setNetworkError(false)
	}

	const sendMessage = async () => {
		const dateNow = () => Date.now()

		let chatId = dateNow()

		if (input !== '') {
			if (accountIsOnline) {
				setNetworkError(false)
			} else {
				setNetworkError(true)
				// setFetchErr(false)
				dispatch(storePrivateChats({
					username: friend.username, 
					message: input, 
					me: true, 
					chatId: chatId,
					reply: {
						open: false,
						person: '',
						to: '',
					}
				}))
				setInput('')
				// dispatch(retrieveOTM({input: input, chatId: chatId}))
			}
		}
	}
	
	return (
		<Card className={classes.card} style={{
			display: selectedUser.username === friend.username ? 'flex' : 'none'
		}} >
			<CardHeader
        avatar={
          <UserAvatar 
			      username={friend.username} 
			      badge={false}
			      style={{fontSize: '1.1rem'}}
			    />
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={friend.username}
        subheader={online ? 'online' : 'offline'}
      />
      <CardContent style={{
      	height: `${useWindowHeight()  - 110}px`
      }}>
        <ChatMessages chats={friend.messages} />
        <Snackbar open={networkError} 
				autoHideDuration={6000} onClose={hideNetworkError}>
			  <MuiAlert variant='filled' elevation={6} onClose={hideNetworkError} severity="error">
			    Your're currently offline
			  </MuiAlert>
			</Snackbar>
      </CardContent>
      
      <CardActions >
      	<InputBase 
      		multiline
      		placeholder='Type your messages'
      		onChange={handleTextInput}
      		value={input}
      	/>
      	<IconButton onClick={sendMessage} >
      		<SendIcon style={{color: blue[500]}} />
      	</IconButton>
    	</CardActions>

		</Card>
	)
}

export default MessagesPane