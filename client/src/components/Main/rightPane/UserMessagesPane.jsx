import React from 'react'

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
import { getWindowHeight, assert, getLastSeen } from '../../../lib/script'

import Profile from './Profile'
import { socket } from '../Main'
import HelperAlert from '../HelperAlert'

import ReplyHandle from './ReplyHandle'
import BaseCard from './BaseCard'

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
	UserMessagesPane: {
		width: '100%',
		position: 'relative'
	},
	
	backBtn: {
		position: 'absolute',
		top: '11px',
		padding: 5,
		display: 'none',
		zIndex: 100,
		['@media (max-width: 660px)']: {
			display: 'block'
		},
	},
	contents: {
		padding: '0 10%',
		['@media (max-width: 900px)']: {
			padding: '0 0 0 2%',
		},
		
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
	snackbar: {
		transform: 'none'
	},
	noChats: {
		position: 'absolute',
		bottom: '1rem',
		left: '10%',
		textAlign: 'center',
		width: '80%',
		textShadow: '1px 1px 1px #eee',
		color: '#68431d'
	},
	bottomSnackbar: {
		bottom: '15%',
		'& .MuiSnackbarContent-message': {
			'& .MuiTypography-body1': {
				marginLeft: 10,
			},
			display: 'flex',
			alignItems: 'center',
		}
	},
	codeEle: {
		borderRadius: '4px',
		display: 'inline-flex',
		background: '#ffffff47',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '0 6px'
	}
})
function retrieveDate(_date) {
	let date = _date.toDateString()
	const index = (/[0-9](?=[0-9]{3})/).exec(date)['index']
	const year = date.split('').splice(index).join('')
	const day = date.split('').splice(0, index-1).join('')
	const fullDate = _date.toString()

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

const LS = (str) => {
	return JSON.parse(localStorage.getItem(str))
}

const UserMessagesPane = ({friend}) => {
	const classes = useStyles()

	const dispatch = useDispatch()
	const {username, id} = LS('details')

	const profile = useSelector(state => state.components.profile)
	// console.log(online)

	const selectedUser = useSelector(state => state.other.currentSelectedUser)

	const accountIsOnline = useSelector(state => state.account.account.online)

	const userOnline = useSelector(state => state.other.onlineUsers.find(i => i.username === friend.username))

	const inputRef = React.createRef(null)
	const [timerToDelete, setDeleteTimer] = React.useState(null)

	const {pendingDelete, starredChat, reply, showProfile} = friend.actionValues
	const [showHelper, setHelperAlert] = React.useState(false)
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
		if (assert(userOnline)) {
			if (userOnline.online) {
				setText('online') 
			} else {
				setText('last seen ' + getLastSeen(userOnline.lastSeen))
			}
		} 
	}, [userOnline])

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
		}, 1500)
		if (!typing) {// This is vital to prevent multiple dispatches
			handleTypingStatus(true)
		}
		setTimer(newTimer)
	}

	const listenForEnter = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			sendMessage()
		}
	}
	const hideNetworkError = () => {
		setNetworkError(false)
	}
	const closeReplyHandle = () => {
		dispatch(setReply({open: false, friendsName: friend.username}))
	}
	const closeHelper = () => setHelperAlert(false)

	const sendMessage = async () => {
		handleTypingStatus(false)
		const textarea = inputRef.current.querySelector('textarea')
		const input = textarea.value
		const _date = new Date()
		const dateNow = () => _date.getTime()
		const thisDate = dateNow()
			
		const date =
		{...retrieveDate(_date), 
			time: _date.toLocaleTimeString('en-US', {hour12: true, hour: '2-digit', minute: '2-digit'})
		}
		//input.match(/[a-z0-9!@#$%^&*)(:;'",<>./?}{][+=-\_]/) !== null
		if (input !== '' && input[1] !== ' ') {
			if (accountIsOnline) {
				textarea.value = ''
				setNetworkError(false)
				const chatObj = {
					receiver: friend.username,
					sender: username,
					lastSent: thisDate ,
					message: {
						message: input,
						chatId: thisDate,
						sender: username,
						read: false,
						receiver: friend.username,
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
					isStarred: {value: false},
					unread: []
				}))

				dispatch(storeSentChat(chatObj))
				// setInput('')
				reply.open && closeReplyHandle()
			} else {
				setNetworkError(true)
			}
		}

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
	const handleInputClick = () => {
		if (navigator.appVersion.indexOf('Win') !== -1 && LS('noOfDisplay') <= 1) {
			if (friend.messages.length === 1) {
				setHelperAlert(true)
				localStorage.setItem('noOfDisplay', LS('noOfDisplay') + 1)
			}
		}
		
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
		<div className={classes.UserMessagesPane} style={{
			display: selectedUser.username === friend.username ? 'flex' : 'none'
		}} >
		
		<BaseCard>
			<IconButton className={classes.backBtn} onClick={() => handleComponent()} >
				<ArrowBackIcon style={{color: '#959494'}} />
			</IconButton>
			<CardHeader
        avatar={
          <div onClick={showProfilePage}>
				    
	          <UserAvatar 
				      username={friend.username} 
				      badge={false}
				      style={{fontSize: '1.1rem'}}
				    />
				   </div>
        }
        title={<span onClick={showProfilePage}> {friend.username} </span>}
        subheader={
        	assert(userOnline) && userOnline.typing === true ? <span style={{color: '#6495ed'}} > {'typing...'} </span>
        	: secondaryText
        }
      />
      <CardContent 
      	ref={cardContentRef}
      	className={classes.contents} 
      >

        { friend.messages.length > 0 ?
        	<ChatMessages chats={friend.messages} />
        	: <div className={classes.noChats}> {'Start the conversation by saying Hi'} </div>
        }

				<HelperAlert
					open={networkError}
        	classNames={[classes.bottomSnackbar, classes.snackbar]}
					autoHideDuration={6000} 
					onClose={hideNetworkError}
					message={'Your\'re currently offline'}
					severity="error"
				/>

				<Snackbar 
					className={[classes.bottomSnackbar, classes.snackbar].join(' ')}
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

    		<HelperAlert 
    			open={showHelper}
    			onClose={closeHelper}
    			message={
    				<span> 
    					Press <code className={classes.codeEle} > win + Period (<strong> . </strong>) </code> to use emoji
    				</span>
    			}
    			severity='info'
    			direction='up'
    			classNames={[classes.bottomSnackbar, classes.snackbar]}
    		/>
      		
      </CardContent>
      
      <CardActions className={classes.contents} >
      	<ReplyHandle {...reply} 
      		closeReplyHandle={closeReplyHandle} 
      		handleChatHighlight={handleChatHighlight}
      	/>
      	<InputBase
      		multiline
      		placeholder='Type your messages'
      		ref={inputRef}
      		className={classes.inputBase}
      		onChange={() => secondaryText === 'online' && handleTextInput()}
      		onKeyDown={listenForEnter}
      		maxRows={4}
      		minRows={1}
      		onClick={() => {
      			friend.messages.length <= 1 && handleInputClick()
      		}}
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

		</BaseCard>
			{/*{showProfile && <Profile profile={friend.profile} />}*/}
		</div>
	)
}

export default UserMessagesPane