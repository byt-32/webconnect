import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import DoneAllIcon from '@material-ui/icons/DoneAll'
import ReplyIcon from '@material-ui/icons/Reply'
import DoneIcon from '@material-ui/icons/Done';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar'
import Backdrop from '@material-ui/core/Backdrop';
import Typography from '@material-ui/core/Typography';

import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import StarsIcon from '@material-ui/icons/Stars';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';

import { handleReply, setHighlighted, setReply,
 setReaction, 
 handleStarredChat,
 setPendingDelete
} from '../../../Redux/features/chatSlice'
import common from '@material-ui/core/colors/common';
import blue from '@material-ui/core/colors/blue';
import deepOrange from '@material-ui/core/colors/deepOrange';
import { assert } from '../../../lib/script'
import { socket } from '../Main'

import ChatActions from '../ChatActions'

const useStyles = makeStyles({
	indexedChats: {
		display: 'flex',
		flexDirection: 'column'
	},
	dateNotice: {
		textAlign: 'center',
		margin: '10px 0',
		position: 'sticky',
		zIndex: 20,
		top: '10px',
		'& span:first-child': {
			fontSize: '.83rem',
			padding: '3px 7px',
			background: common.white,
			boxShadow: '0 0 2px 0px #00000021',
			borderRadius: '5px',
		}
	},
	chatWrapper: {
		display: 'flex',
		position: 'relative',
		alignItems: 'flex-end',
		width: '100%',
		padding: '2px 0',
		transition: '.6s ease all'
	},
	flexStart: {
		justifyContent: 'flex-start',
		alignSelf: 'flex-start',
		paddingLeft: '.5rem',

	},
	flexEnd: {
		alignSelf: 'flex-end',
		justifyContent: 'flex-end',
	},
	fromAccount: {
		marginLeft: '1rem',
		background: '#727f93',
		'& > span:last-of-type': {
			color: common.white
		}
	},
	fromFriend: {
		marginRight: '1rem',
		background: common.white
	},
	chatSingle: {
		width: 'auto',
		font: 'message-box',
		borderRadius: '5px' ,
		boxShadow: '1px 1px 1px 0px #00000012',
		position: 'relative',
		'& > span': {
			padding: '4px 8px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between'
		}
	},
	
	
	isLast: {
		marginBottom: 12
	},
	reply: {
		background: common.white,
		fontSize: '.85rem',
		padding: '5px 0' ,
		borderBottom: '1px solid #efefef',
		borderLeft: '2px solid #ffb55c',
		borderRadius: 'inherit',
		borderBottomLeftRadius: '0',
		borderBottomRightRadius: '0',
		'& > span': {
			padding: '0 10px',
			display: 'block',
		},
		'& > span:first-child': {
			color: deepOrange[500],
			paddingBottom: 3,
			fontSize: '.8rem', 
			fontWeight: 'bold'
		}
	},
	chatTime: {
		fontSize: '.65rem',
		marginLeft: 9,
		opacity: .9,
		alignSelf: 'flex-end'
	},
	deleted: {
		fontStyle: 'italic',
		padding: '3px 7px',
		background: '#fffadd',
		borderRadius: '5px',
		'& > span': {
			color: '#d96c6c !important',
		}
	},

	chatRead: {
		padding: '0 3px',
		'& svg': {
			fontSize: '.8rem'
		}
	},
	
})

const chatBubbleStyles = (me) => {

}

const reactions = [
	{name: 'smile', icon: <SentimentVerySatisfiedIcon />},
	{name: 'like', icon: <ThumbUpIcon />},
	{name: 'dislike', icon: <ThumbDownIcon />}
]

const Reaction = ({name}) => {/* ignore this for now **/
	if (name === 'smile') return <SentimentVerySatisfiedIcon className={classes.reaction} />
	if (name === 'like') return <ThumbUpIcon className={classes.reaction} />
	return <ThumbDownIcon className={classes.reaction} />
}
// ///rgb(0 137 255 / 6%)


const ChatSingle = ({chat, isFirst, isLast}) => {
	// console.log(props)
	const classes = useStyles()
	const dispatch = useDispatch()
	const username = useSelector(state => state.account.account.username)
	let me = (chat.me || chat.sender === username) ? true : (!chat.me || chat.sender !== username) ? 
	false : ''
	let className = me ? classes.fromAccount : classes.fromFriend
	let wrapperClass = me ? classes.flexEnd : classes.flexStart
	let wrapperStyle = {background: chat.highlightChat ? 'rgb(0 137 255 / 14%)' : 'inherit'}

	let bubbleClass = () => {
		if (me) {
			return 'rightBubble'
		} else {
			return 'leftBubble'
		}
	}

	const [open, setOpen] = React.useState(false)
	const [timer, setTimer] = React.useState(null)
	const chatRef = React.createRef(null)
	const [anchorEl, setAnchorEl] = React.useState(null)

	const deleted = chat.message === '' ? true : false

	const getFriendName = () => {
		
	/** This basically gets the freinds username,
	 alternative to this would be to pass the username down to this component, 
	 leading to props drilling.

	 it checks if sender or receiver is not equals the account username, and returns it
	 as the friends name. 
		
	**/
		if (chat.sender !== username) return chat.sender
		if (chat.receiver !== username) return chat.receiver
	}
	
	
	function replace(text) {
		return text.replaceAll('\n', '<br/>')
	}
	const handleChatActions = (e) => {
		setOpen(!open)
		setAnchorEl(e.target)
	}
	const handleClickAway = (e) => {
		setOpen(false)
		setAnchorEl(null)
	}
	const handleReply = () => {
		dispatch(setReply({
			username,
			open: true,
			chatId: chat.chatId,
			sender: chat.sender,
			friendsName: getFriendName()
		}))
	}
	const closeActions = () => setOpen(false)
	// const handleReactions = (name) => {
	// 	if (chat.reaction && name === chat.reaction.name) {
	// 		dispatch(setReaction({
	// 			reaction: false,
	// 			chatId: chat.chatId,
	// 			friendsName: getFriendName()
	// 		}))
	// 		return
	// 	}
	// 	dispatch(setReaction({
	// 		reaction: {name},
	// 		chatId: chat.chatId,
	// 		friendsName: getFriendName()
	// 	}))
	// }

	const handleCopy = () => {

		navigator.clipboard.writeText(chat.message)
		setOpen(false)
		setOpen(true)
	}
	const starMessage = () => {
		socket.emit('starredChat', {starredBy: username, friendsName: getFriendName(), starredChat: chat})
		dispatch(handleStarredChat({starredChat: chat, friendsName: getFriendName()}))
	}

	const beginDelete = () => {
		/*** READ THIS 
			YOU CANT DELETE A FRIENDS CHAT FROM THEIR DATABASE, 
			TEST CASE 1: DELETING A CHAT FROM A FRIEND MODIFIES 
			YOUR DATABASE NOT THE SENDER'S, 

			TEST CASE 2: DELETING A CHAT SENT BY YOU MODIFES BOTH THE RECEIVER'S DATABASE
			ASS WELL AS THE SENDERS'
		*/
		dispatch(setPendingDelete({friendsName: getFriendName(), chat: chat}))
	}

	const handleChatHighlight = () => {
		dispatch(setHighlighted({chatId: chat.reply.chatId, friendsName: getFriendName(), show: true}))
		clearTimeout(timer)

		let newTimer = setTimeout(() => {
			dispatch(setHighlighted({chatId: chat.reply.chatId, friendsName: getFriendName(), show: false}))
		}, 1500)

		setTimer(newTimer)
	}

	React.useEffect(() => {
		chatRef.current.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
	}, [chat.highlightChat])

	React.useEffect(() => {

	}, [])

	return (
		<ClickAwayListener onClickAway={handleClickAway}>
			<div 
				className={
					[classes.chatWrapper, wrapperClass, isFirst && classes.isFirst, isLast && classes.isLast].join(' ')} 
					style={wrapperStyle} 
					ref={chatRef} 
			>
				{
					deleted ? 
					<div className={[className, classes.deleted].join(' ')}>
						<span className={classes.deleted}> Deleted </span> 
					</div> 
					:
					chat.reply.open ? 
					<>
						<div className={[className, classes.chatSingle, isFirst && bubbleClass(), 'reply'].join(' ')} >
							<div 
								className={classes.reply} 
								onClick={() => { chat.reply.message !== '' && handleChatHighlight()}}
							>
								<span> {chat.reply.sender === username ? 'You' : chat.reply.sender} </span>
								{ chat.reply.message !== '' ?
										<span> {chat.reply.message} </span>
									: 
										<div className={[className, classes.deleted].join(' ')}>
											<span className={classes.deleted}> Deleted </span> 
										</div> 
								}
							</div>
							<span className={classes.chat} onClick={handleChatActions} > 
								{chat.message}
								<span className={classes.chatTime}> {chat.timestamp.time} </span>
							</span>
						</div>
						{ me &&
							<span className={classes.chatRead}>
								{chat.read ? <DoneAllIcon style={{color: '#00c759'}} /> : <DoneIcon />}
							</span>
						}
					</>
					:
					<>
						<div className={[className, classes.chatSingle, isFirst && bubbleClass()].join(' ')} >
							<span className={classes.chat} onClick={handleChatActions} >
								{chat.message}
								<span className={classes.chatTime}> {chat.timestamp.time} </span>
							</span>
						</div>
						{ me &&
							<span className={classes.chatRead}>
								{chat.read ? <DoneAllIcon style={{color: '#00c759'}} /> : <DoneIcon />}
							</span>
						}
					</>
					
				}
				{/** Don't show chat actions for a deleted chat **/
					!deleted &&
						<ChatActions 
							open={open} 
							anchorEl={anchorEl} 
							onClose={handleClickAway} 
							anchorOrigin={{
						    vertical: 'bottom',
						    horizontal: me ? 'left' : 'right',
						  }}
						  transformOrigin={{
						    vertical: 'top',
						    horizontal: me ? 'right' : 'left',
						  }}
						>
							<div>
								{/*{
									reactions.map((reaction, i) => {
										return (
											<IconButton key={reaction.name}> {reaction.icon} </IconButton>
										)
									})
								}*/}
							</div>
							<div>
								<IconButton onClick={() => {
									handleReply()
									closeActions()
								}} >
									<ReplyIcon /> 
									<Typography component='span'> Reply </Typography>
								</IconButton>

								<IconButton onClick={() => {
									handleCopy()
								}} >
									<FileCopyOutlinedIcon style={{color:'#958783'}} /> 
									<Typography component='span'> Copy </Typography>
								</IconButton>
								{/*<IconButton onClick={starMessage} > <StarsIcon style={{color: '#5f547a'}} /> </IconButton>*/}
								<IconButton onClick={() => {
									beginDelete()
									closeActions()
								}} >
									<DeleteSweepIcon style={{color: '#ed143d'}} /> 
									<Typography component='span'> Delete </Typography>
								</IconButton>
							</div>
						</ChatActions>
					}

				
			</div>

		</ClickAwayListener>
	)
}

const ChatsByDate = ({chat}) => {
	const classes = useStyles()
	const day = new Date().toDateString().slice(0, -5)
	
	return (
		<div >
			<header className={classes.dateNotice} >
				<span> {chat.day === day ? 'Today' : chat.day} </span>
			</header>


			<div className={classes.indexedChats}>
				{
					chat.chats.length > 0 &&
						chat.chats.map((message, i) => {

							let indicators = {isFirst: false, isLast: false}
							
							{/*if (i > 1) {
								determineIndicator(message)
							} else if (chat.chats.length > 1) {
								determineIndicator()*/}

							if (i === 0) indicators.isFirst = true
							else if (i > 0) {
								if (message.sender !== chat.chats[i-1].sender) {
									indicators.isFirst = true
								} 
								if (i === chat.chats.length-1) indicators.isLast = true
								if (i < chat.chats.length-1) {

									if (message.sender !== chat.chats[i+1].sender) {
										indicators.isLast = true
									}

									if (message.sender !== chat.chats[i-1].sender && 
										message.sender === chat.chats[i+1].sender) {
										indicators.isFirst = true
									}

									if (message.sender !== chat.chats[i-1].sender && 
										message.sender !== chat.chats[i+1].sender) {
										indicators = {isFirst: true, isLast: true}
									}
								}
									
							}
							
							return (
								<ChatSingle key={message.chatId} chat={message} {...indicators} /> 
							)
						})
				}
			</div>
		</div>
	)
}

const determineIndicator = (curr, prev, next) => {

}

const ChatMessages = ({chats}) => {
	/** Index chats by date **/
	const classes = useStyles()

	let dates = [], chatsIndexedByDate = []

	/** Index chats according to their dates */
	chats.forEach(i => {
		const dateInDates = dates.findIndex(d => d === i.timestamp.day)
		if (dateInDates === -1) {
			dates.push(i.timestamp.day)
		}
	})

	dates.forEach(day => {
		const chatsWithSameDate = chats.filter(chat => chat.timestamp.day === day)
		chatsIndexedByDate.push({day: day, chats: [...chatsWithSameDate]})
	})

	return (
		<> 
				<div className={classes.chats}>
					{ chatsIndexedByDate.length > 0 &&
							chatsIndexedByDate.map((chatCollection, i) => <ChatsByDate key={i} chat={chatCollection} />)
					}
				</div>
		</>
	)
}

export default ChatMessages