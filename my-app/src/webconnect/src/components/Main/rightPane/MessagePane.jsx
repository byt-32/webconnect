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
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button'

import SendIcon from '@material-ui/icons/Send';
import TagFacesIcon from '@material-ui/icons/TagFaces';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import AddIcCall from '@material-ui/icons/AddIcCall';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CloseIcon from '@material-ui/icons/Close';
import StarsIcon from '@material-ui/icons/Stars';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import common from '@material-ui/core/colors/common';

import { makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';

import { useDispatch,useSelector } from 'react-redux'
import {  storeSentChat, setReply, handleStarredChat, performChatDelete, handlePendingDelete } from '../../../Redux/features/chatSlice'
import { setTypingStatus } from '../../../Redux/features/otherSlice'
import {updateRecentChats} from '../../../Redux/features/recentChatsSlice'

import ChatMessages from './ChatMessages'
import UserAvatar from '../UserAvatar'
import { useWindowHeight, useAssert } from '../../../customHooks/hooks'

import { socket } from '../Main'

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
			padding: 8 ,
			overflowY: 'scroll',
			position: 'relative'
		},
		'& .MuiCardActions-root': {
			background: common.white,
			position: 'relative'
		},
		'& .MuiInputBase-root': {
			flex: 1,
		},
		'& .MuiInputBase-inputMultiline': {
			maxHeight: 70,
			overflowY: 'scroll !important'
		}
	},
	contents: {
		width: '80%',
		margin: '0 auto'
	},
	replyHandel: {
		display: 'flex',
		justifyContent: 'space-between',
		position: 'absolute',
		background: '#fdfdfd',
		width: '100%',
		top: '-61px',
		left: 0,
		borderRadius: '10px 0'
	},
	replyProps: {
		display: 'flex',
		flexDirection: 'column',
		padding: 10,
		borderLeft: '2px solid #d1803e',
		borderRadius: 'inherit',
		'& span:first-child': {
			marginBottom: 2
		}
	},
	starred: {
		position: 'sticky',
		width: '98%',
		top: 0,
		margin: '0 auto',
		zIndex: 25,
		transition: '.7s ease all',
		'& .MuiCardHeader-title': {
			color: '#edb664'
		}
	},
	bottomSnackbar: {
		width: '100%',
		position: 'absolute',
		'& .MuiSnackbarContent-message': {
			'& .MuiTypography-body1': {
				marginLeft: 10,
			},
			display: 'flex',
			alignItems: 'center',
		}
	}
})
function retrieveDate(date) {
	const index = (/[0-9](?=[0-9]{3})/).exec(date)['index']
	const year = date.split('').splice(index).join('')
	const day = date.split('').splice(0, index-1).join('')
	const fullDate = date

	return {year: year, day: day, fullDate: fullDate}
}
function ActionNotifier(props) {
	const classes = useStyles()
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress + 10));
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return(
  	<>
  		<CircularProgress variant="determinate" value={progress} />
  		<Typography component='span'> {props.action} </Typography>
  	</>
  )
}

const MessagesPane = ({friend}) => {
	const classes = useStyles()

	const dispatch = useDispatch()
	const {username} = JSON.parse(localStorage.getItem('details'))
	const online = useSelector(state => state.activeUsers.activeUsers.find(i => i.username === friend.username).online)

	const selectedUser = useSelector(state => state.other.currentSelectedUser)

	const accountIsOnline = useSelector(state => state.account.account.online)

	const friendInRecent = useSelector(state => state.recentChats.recentChats).find(i => i.username === friend.username)

	const inputRef = React.createRef(null)
	const [timerToDelete, setDeleteTimer] = React.useState(null)

	const {pendingDelete, starredChat, reply} = friend.actionValues

	React.useEffect(() => {
		if (useAssert(pendingDelete)) {
			clearTimeout(timerToDelete)

			let newTimerToDelete = setTimeout(() => {
				if (username === pendingDelete.sentBy) {
					socket.emit('deleteChat', {deletedBy: username, friendsName: friend.username, chat: pendingDelete})
				}
				dispatch(performChatDelete({friendsName: friend.username, chat: pendingDelete}))
				dispatch(handlePendingDelete({friendsName: friend.username, chat: {}}))
			}, 10000)
			setDeleteTimer(newTimerToDelete)
		}	
	}, [pendingDelete])

	React.useEffect(() => {
		const textarea = inputRef.current.querySelector('textarea')
		if (reply.open) {
			textarea.focus()
		}
	}, [reply])

	const undoDelete = () => {
		dispatch(handlePendingDelete({friendsName: friend.username, chat: {}}))
		clearTimeout(timerToDelete)
	}

	let friendIsTyping = false

	if (friendInRecent !== undefined) {
		friendIsTyping = friendInRecent.typing
	}
	
	const [anchorEl, setAnchorEl] = React.useState(null)
	// const [input, setInput] = React.useState('')
	const [showPicker, setPicker] = React.useState(false)
	const [networkError, setNetworkError] = React.useState(false)
	const [timer, setTimer] = React.useState(null)

	const starredChatRef = React.createRef(null)
	const cardContentRef = React.createRef(null)

	const [typing, setTyping] = React.useState(false)

	const toggleMenu = (event) => {
		setAnchorEl(event.target)
	}
	const handleClose =() => {
		setAnchorEl(null)
	}
	
	const handleTypingStatus = (bool) => {
		socket.emit('userIsTyping', {typing: bool, selectedUser: friend.username, user: username})
		setTyping(bool)
	}
	const handleUnstar = () => {
		socket.emit('unstarChat', {starredBy: username, friendsName: friend.username, starred: {}})
		dispatch(handleStarredChat({starredChat: {}, friendsName: friend.username}))
	}

	// const handleTextInput = (e) => {
	// 	// setInput(e.target.value)

	// 	clearTimeout(timer)

	// 	const newTimer = setTimeout( async () => {
	// 		// console.log(e.target.value)
	// 		await handleTypingStatus(false)
	// 	}, 2000)
	// 	if (!typing) {/// This is vital to prevent multiple dispatches
	// 		handleTypingStatus(true)
	// 	}
	// 	setTimer(newTimer)
	// }
	const hideNetworkError = () => {
		setNetworkError(false)
	}
	const closeReplyHandle = () => {
		dispatch(setReply({open: false, friendsName: friend.username}))
	}

	const sendMessage = async () => {
		const textarea = inputRef.current.querySelector('textarea')
		const input = textarea.value
		const dateNow = () => Date.now()
		const _date = new Date()
		const thisDate = dateNow()
			
		const date =
		{...retrieveDate(_date.toDateString()), 
			time: _date.toLocaleTimeString('en-US', {hour12: true, hour: '2-digit', minute: '2-digit'})
		}

		if (input !== '') {
			if (accountIsOnline) {
				setNetworkError(false)
				const chatObj = {
					sentTo: friend.username,
					sentBy: username,
					lastSent: thisDate,
					message: {
						message: input,
						chatId: thisDate, 
						sentBy: username,
						read: false,
						sentTo: friend.username,
						timestamp: date,
						reply: reply
					}
				}
				socket.emit('sentChat', chatObj)

				dispatch(updateRecentChats({
					username: selectedUser.username, 
					lastSent: chatObj.lastSent,
					messages: chatObj.message,
					online: selectedUser.online,
					unread: 0
				}))

				dispatch(storeSentChat(chatObj))
				textarea.value = ''
				// setInput('')
				useAssert(reply) && closeReplyHandle()
			} else {
				setNetworkError(true)
			}
		}

		handleTypingStatus(false)
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
        subheader={
        	friendIsTyping ? <span style={{color: '#6495ed'}} > {'typing...'} </span>
        	: online ? 'online' : 'offline'
        }
      />
      <CardContent 
      	ref={cardContentRef}
      	className={classes.contents} 
	      style={{
	      	height: `${useWindowHeight()  - 110}px`
	      }}
      >
	    	{	useAssert(starredChat) &&
	    		<Slide in={useAssert(starredChat)}>
	    			<Card className={classes.starred} ref={starredChatRef}>
	    				<CardHeader
	    					avatar={
	    						<StarsIcon style={{color: '#5f547a'}} />
	    					}
	    					action={
	    						<IconButton onClick={handleUnstar}>
	    							<HighlightOffIcon />
	    						</IconButton>
	    					}
	    					title={starredChat.sentBy === username ? 'You' : starredChat.sentBy}
	    					subheader={starredChat.message}
	    				/>

	    			</Card>
	    		</Slide>
	    	}

        <ChatMessages chats={friend.messages} pendingDelete />

        <Snackbar open={networkError}
        	className={classes.bottomSnackbar}
					autoHideDuration={6000} 
					onClose={hideNetworkError}
				>
				  <MuiAlert variant='filled' elevation={6} onClose={hideNetworkError} severity="error">
				    Your're currently offline
				  </MuiAlert>
				</Snackbar>

				<Snackbar 
					className={classes.bottomSnackbar}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					message={<ActionNotifier action={'Deleting...'} />}
					autoHideDuration={10000} 
					open={useAssert(pendingDelete)}
					action={
						<Button onClick={() => undoDelete()} style={{color: '#ffc4cf'}}> UNDO </Button>
				}
			/>


      </CardContent>
      
      <CardActions className={classes.contents} >

      	<Slide in={reply.open} direction='up' >
	      	<div className={classes.replyHandel}>
	      		<div className={classes.replyProps}>
	      			<span style={{color: '#ad39ad', fontWeight: 'bold'}}>
	      				{reply.sentBy === username ? 'You' : reply.sentBy} 
	      			</span>
	      			<span> {reply.message} </span>
	      		</div>
	      		<div >
	      			<CloseIcon onClick={closeReplyHandle} style={{fontSize: '1.2rem', color: '#c55044', margin: 3,}} />
	      		</div>
	      	</div>
	      </Slide>

      	<InputBase 
      		multiline
      		placeholder='Type your messages'
      		ref={inputRef}
      		// onChange={handleTextInput}
      		// value={input}
      	/>
      	<IconButton onClick={sendMessage} >
      		<SendIcon style={{color: blue[500]}} />
      	</IconButton>
    	</CardActions>

		</Card>
	)
}

export default MessagesPane