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
import InputAdornment from '@material-ui/core/InputAdornment';

import SendIcon from '@material-ui/icons/Send';
import TagFacesIcon from '@material-ui/icons/TagFaces';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import PhoneIcon from '@material-ui/icons/Phone';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CloseIcon from '@material-ui/icons/Close';
import StarsIcon from '@material-ui/icons/Stars';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import common from '@material-ui/core/colors/common';

import { makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import { Link } from 'react-router-dom'

import { useDispatch,useSelector } from 'react-redux'
import {  storeSentChat, 
	setReply,
	handleStarredChat, 
	performChatDelete, 
	setPendingDelete,
	undoPendingDelete,
	setHighlighted,
	fetchUserProfile,
	setProfile
} from '../../../Redux/features/chatSlice'

import { setTypingStatus, setSelectedUser } from '../../../Redux/features/otherSlice'
import {updateRecentChats, syncRecentsWithDeleted} from '../../../Redux/features/recentChatsSlice'

import { setComponents} from '../../../Redux/features/componentSlice'

import ChatMessages from './ChatMessages'
import UserAvatar from '../UserAvatar'
import { getWindowHeight, assert, getLastSeen, handleFetch } from '../../../lib/script'

import Profile from './Profile'
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
	messagesPane: {
		width: '100%',
		position: 'relative'
	},
	card: {
		boxShadow: 'none',
		height: '100%',
		width: '100%',
		background: 'transparent',
		flexDirection: 'column',
		'& .MuiCardHeader-root': {
			background: common.white,
    	boxShadow: '-1px 1px 1px 0px #cbcbcb',
			marginLeft: 5,
			height: '3.7rem',
			padding: '0 16px',
			position: 'relative',
			'& .MuiCardHeader-title': {
				fontWeight: 'bold'
			},
			['@media (max-width: 660px)']: {
				// width: '100%'
				padding: '0 16px 0 39px'
			},
		},
		'& .MuiCardHeader-action': {
			alignSelf: 'center',
			marginTop: 0,
			['@media (max-width: 687px)']: {
				marginLeft: 0,
				display: 'none'
			},
		},
		'& .MuiCardContent-root': {
			background: grey[200],
			padding: 0,
			overflowY: 'scroll',
			position: 'relative'
		},
		'& .MuiCardActions-root': {
			background: common.white,
			position: 'relative'
		},
		'& .MuiInputBase-root': {
			flex: 1,
			background: common.white,
			padding: '11px 10px'
		},
		'& .MuiInputBase-inputMultiline': {
			maxHeight: 70,
			overflowY: 'scroll !important'
		},

	},
	backBtn: {
		position: 'absolute',
		top: '0.25rem',
		left: '-.5rem',
		display: 'none',
		['@media (max-width: 660px)']: {
			display: 'block'
		},
	},
	contents: {
		width: '80%',
		margin: '0 auto',
		['@media (max-width: 900px)']: {
			width: '97%'
		},
	},
	replyHandel: {
		display: 'flex',
		justifyContent: 'space-between',
		position: 'sticky',
		bottom: 0,
		boxShadow: '0px 3px 6px 0px #00000012',
		background: '#fdfdfd',
		width: '100%',
		zIndex: 40,
		left: 0,
		borderRadius: '10px 10px 0 0'
	},
	replyProps: {
		display: 'flex',
		flexDirection: 'column',
		padding: 10,
		width: 'inherit',
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
	},
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
    }, 200);
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
	const {username, id} = JSON.parse(localStorage.getItem('details'))
	const friendInUsers = useSelector(state => state.activeUsers.activeUsers.find(i => i.username === friend.username))

	const online = friendInUsers !== undefined ? friendInUsers.online : false
	const profile = useSelector(state => state.components.profile)
	// console.log(online)

	const selectedUser = useSelector(state => state.other.currentSelectedUser)

	const accountIsOnline = useSelector(state => state.account.account.online)

	const friendInRecent = useSelector(state => state.recentChats.recentChats).find(i => i.username === friend.username)

	const inputRef = React.createRef(null)
	const [timerToDelete, setDeleteTimer] = React.useState(null)

	const {pendingDelete, starredChat, reply, showProfile} = friend.actionValues
	const [anchorEl, setAnchorEl] = React.useState(null)
	// const [input, setInput] = React.useState('')
	const [showPicker, setPicker] = React.useState(false)
	const [networkError, setNetworkError] = React.useState(false)
	const [timer, setTimer] = React.useState(null)
	const [hightlightTimer, setHighlightTimer] = React.useState(null)

	const starredChatRef = React.createRef(null)
	const cardContentRef = React.createRef(null)

	const [typing, setTyping] = React.useState(false)

	const [secondaryText, setText] = React.useState('')

	React.useEffect(() => {
		if (friendInUsers.online) {
			setText('online')
		} else {
			if (typeof friendInUsers.lastSeen === 'number') {
				setText('last seen ' + getLastSeen(friendInUsers.lastSeen))
			} else {
				setText('offline')
			}
		}
	}, [friendInUsers.online])

	React.useEffect(() => {
		/*** READ THIS 
			YOU CANT DELETE A FRIENDS CHAT FROM THEIR DATABASE, 
			TEST CASE 1: DELETING A FREINDS RECEIVED CHAT MODIFIES 
			YOUR DATABASE NOT THE SENDER'S, 

			TEST CASE 2: DELETING A SENT CHAT(YOUR CHAT) MODIFES BOTH THE USER'S DATABASE
			ASS WELL AS THE SENDERS'
		*/
		if (!accountIsOnline) {
			setNetworkError(true)
		}
		if (assert(pendingDelete) && accountIsOnline) {
			clearTimeout(timerToDelete)

			let newTimerToDelete = setTimeout(() => {
				socket.emit('deleteChat', {deletedBy: username, friendsName: friend.username, chat: pendingDelete})
				
				dispatch(performChatDelete({friendsName: friend.username, chat: pendingDelete}))
				dispatch(undoPendingDelete({friendsName: friend.username}))
				dispatch(setReply({open: false, friendsName: friend.username}))
				dispatch(syncRecentsWithDeleted({friendsName: friend.username, chat: pendingDelete}))
			}, 2000)
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
		dispatch(undoPendingDelete({friendsName: friend.username}))
		clearTimeout(timerToDelete)
	}

	let friendIsTyping = false

	if (friendInRecent !== undefined) {
		friendIsTyping = friendInRecent.typing
	}
	
	
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

	const handleTextInput = (e) => {
		// setInput(e.target.value)

		clearTimeout(timer)

		const newTimer = setTimeout( async () => {
			handleTypingStatus(false)
		}, 2000)
		if (!typing) {// This is vital to prevent multiple dispatches
			handleTypingStatus(true)
		}
		setTimer(newTimer)
	}
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
				assert(reply) && closeReplyHandle()
			} else {
				setNetworkError(true)
			}
		}

		handleTypingStatus(false)
	}

	const handleChatHighlight = () => {
		dispatch(setHighlighted({chatId: reply.chatId, friendsName: friend.username, show: true}))
		clearTimeout(hightlightTimer)

		let newTimer = setTimeout(() => {
			dispatch(setHighlighted({chatId: reply.chatId, friendsName: friend.username, show: false}))
		}, 1500)

		setHighlightTimer(newTimer)
	}

	const handleComponent = (componentObj) => {
		dispatch(setSelectedUser({}))
		if (window.innerWidth < 660) {
			dispatch(setComponents({component: 'leftPane', value: true}))
		}
	}
	const showMoreOptions = () => {

	}
	const showProfilePage = () => {
		if (!assert(friend.profile)) {
			dispatch(fetchUserProfile({id, username: friend.username})).then(() => {
				dispatch(setProfile({friendsName: friend.username, open: true}))
			})
		} else if (!showProfile) {
			dispatch(setProfile({friendsName: friend.username, open: true}))
		}
	}

	return (
		<div className={classes.messagesPane} style={{
			display: selectedUser.username === friend.username ? 'flex' : 'none'
		}} >
		<Card className={classes.card} >
			
			<CardHeader
        avatar={
          <div onClick={showProfilePage}>
          	<Link to='/'>
					    <IconButton className={classes.backBtn} onClick={() => handleComponent()} >
								<ArrowBackIcon style={{color: '#959494'}} />
							</IconButton>
						</Link>
	          <UserAvatar 
				      username={friend.username} 
				      badge={false}
				      style={{fontSize: '1.1rem'}}
				    />
				   </div>
        }
        title={<span onClick={showProfilePage}> {friend.username} </span>}
        action={
        	<>

	          <IconButton aria-label="settings" onClick={showMoreOptions}>
	            <PhoneIcon style={{color: '#676d78'}} />
	          </IconButton>
	          <IconButton aria-label="settings" onClick={showMoreOptions}>
	            <VideoCallIcon style={{color: '#676d78'}} />
	          </IconButton>
	        </>
        }
        subheader={
        	friendIsTyping ? <span style={{color: '#6495ed'}} > {'typing...'} </span>
        	: secondaryText
        }
      />
      <CardContent 
      	ref={cardContentRef}
      	className={classes.contents} 
	      style={{
	      	height: `${getWindowHeight()  - 135}px`
	      }}
      >
	    	{	assert(starredChat) &&
	    		<Slide in={assert(starredChat)}>
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
					open={assert(pendingDelete)}
					action={
						<Button onClick={() => undoDelete()} style={{color: '#ffc4cf'}}> UNDO </Button>
				}
			/>


      </CardContent>
      
      <CardActions className={classes.contents} >

      	{reply.open &&
	      	<div className={classes.replyHandel}
	      	 >
	      		<div className={classes.replyProps}
	      			onClick={handleChatHighlight}
	      		>
	      			<span style={{color: '#ad39ad', fontWeight: 'bold'}}>
	      				{reply.sentBy === username ? 'You' : reply.sentBy} 
	      			</span>
	      			<span> {reply.message} </span>
	      		</div>
	      		<div >
	      			<CloseIcon onClick={closeReplyHandle} style={{fontSize: '1.2rem', color: '#c55044', margin: 7,}} />
	      		</div>
	      	</div>
	      }
      	<InputBase 
      		multiline
      		placeholder='Type your messages'
      		ref={inputRef}
      		className={classes.inputBase}
      		onChange={() => online && handleTextInput()}
      		endAdornment={
						<InputAdornment position="end" style={{height: '100%'}}>
							<IconButton onClick={sendMessage} >
			      		<SendIcon style={{color: blue[500]}} />
			      	</IconButton>
						</InputAdornment>
					}
      		// value={input}
      	/>
	      	
    	</CardActions>

		</Card>
			{showProfile && <Profile profile={friend.profile} open={showProfile} />}
		</div>
	)
}

export default MessagesPane