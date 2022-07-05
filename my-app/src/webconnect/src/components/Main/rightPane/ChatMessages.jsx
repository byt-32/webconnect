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

import { handleReply, setHighlighted, setReply } from '../../../Redux/features/chatSlice'
import common from '@material-ui/core/colors/common';
import blue from '@material-ui/core/colors/blue';
import deepOrange from '@material-ui/core/colors/deepOrange';

const useStyles = makeStyles({
	indexedChats: {
		display: 'flex',
		flexDirection: 'column'
	},
	dateNotice: {
		textAlign: 'center',
		position: 'sticky',
		top: 0,
		'& span:first-child': {
			fontSize: '.83rem',
			padding: '3px 7px',
			background: common.white,
			boxShadow: '0 0 2px 1px #d3d3d3'
		}
	},
	chatAndprop:{
		display: 'flex',
		position: 'relative',
		alignItems: 'flex-end',
		width: '100%',
		transition: '.7s ease background'
	},
	fromAccount: {
		alignSelf: 'flex-end',
		justifyContent: 'flex-end',
		marginLeft: '1rem',
		'& > div': {
			background: blue[400],
			color: common.white,
		},
		'& div:last-of-type': {
			right: 0
		}
	},
	fromFriend: {
		justifyContent: 'flex-start',
		alignSelf: 'flex-start',
		marginRight: '1rem',
		'& > div': {
			background: common.white,
			color: common.black
		},
		'& div:last-of-type': {
			left: 0
		}
	},
	chatSingle: {
		width: 'auto',
		font: 'message-box',
		borderRadius: '5px 0' ,
		marginTop: 8,
		padding: '4px 8px',
	},
	reply: {
		background: common.white,
		color: common.black,
		fontSize: '.85rem',
		padding: 5,
		borderBottom: '1px solid #efefef',
		borderRadius: '5px 0'
	},
	chatProps: {
		position: 'absolute',
		top: '-42px',
		borderRadius: '5px',
		zIndex: 20,
		display: 'flex',
		background: '#fff !important'
	},

	chatRead: {
		padding: '0 3px',
		'& svg': {
			fontSize: '.8rem'
		}
	}
})
///rgb(0 137 255 / 6%)
const ChatSingle = ({chat}) => {
	const classes = useStyles()
	const dispatch = useDispatch()
	const username = useSelector(state => state.account.account.username)
	let me = (chat.me || chat.sentBy === username) ? true : (!chat.me || chat.sentBy !== username) ? 
	false : ''
	const [open, setOpen] = React.useState(false)
	const [timer, setTimer] = React.useState(null)

	const getFriendName = () => {
	/** This basically gets the freinds username,
	 alternative to this would be to pass the username down to this component, 
	 leading to props drilling.

	 if checks if sentBy or sentTo is not equals the account username, and returns it
		
	**/
		if (chat.sentBy !== username) return chat.sentBy
		if (chat.sentTo !== username) return chat.sentTo
	}

	function replace(text) {
		return text.replaceAll('\n', '<br/>')
	}
	const handleChatProps = () => {
		setOpen(!open)
	}
	const handleClickAway = () => {
		setOpen(false)
	}

	const handleReply = () => {
		dispatch(setReply({
			username,
			open: true,
			chatId: chat.chatId,
			sentBy: chat.sentBy,
			friendsName: getFriendName()
		}))
	}

	const handleCopy = () => {

	}
	const handleChatHighlight = () => {
		dispatch(setHighlighted({chatId: chat.reply.chatId, friendsName: getFriendName(), show: true}))
		clearTimeout(timer)

		const newTimer = setTimeout(() => {
			dispatch(setHighlighted({chatId: chat.reply.chatId, friendsName: getFriendName(), show: false}))
		}, 1000)

		setTimer(newTimer)
	}
	return (
		<ClickAwayListener onClickAway={handleClickAway}>
		<div className={[classes.chatAndprop, me ? classes.fromAccount : classes.fromFriend].join(' ')} 
			style={{background: chat.highlightChat ? 'rgb(0 137 255 / 8%)' : 'inherit'}}
		>
			<div className={classes.chatSingle} style={{
				padding: chat.reply && '0 0 0 2px'
			}}>
				{ chat.reply ?
					<> 
						<div className={classes.reply} onClick={handleChatHighlight}>
							<div style={{
									color: deepOrange[500],
									padding: '0 9px 3px 0',
									fontSize: '.8rem', fontWeight: 'bold'}} >
								{
									chat.reply.sentBy === username ? 'You' : chat.reply.sentBy
								}
							</div>
							{chat.reply.message}
						</div>

						<div style={{
							padding: '4px 8px 4px 3px'
						}} onClick={handleChatProps} > 
							{chat.message} 
						</div>
					</>
					: <span onClick={handleChatProps}> {chat.message} </span>
				}
			</div>
			{ me &&
				<span className={classes.chatRead}>
					{chat.read ? <DoneAllIcon style={{color: '#00c759'}} /> : <DoneIcon />}
				</span>
			}
			<Fade in={open}>
				<div className={classes.chatProps}>
					<IconButton onClick={handleReply} > <ReplyIcon /> </IconButton>
					<IconButton onClick={handleCopy} > <FileCopyOutlinedIcon /> </IconButton>
				</div>
			</Fade>
		</div>
		
		</ClickAwayListener>
	)
}

const ChatsByDate = ({chat}) => {
	const classes = useStyles()
	const day = new Date().toDateString().slice(0, -4);
	return (
		<div >
			<header className={classes.dateNotice} >
				<span> {chat.day === day ? 'Today' : chat.day} </span>
			</header>
				
			<div className={classes.indexedChats}>
				{
					chat.chats.length > 0 &&
						chat.chats.map((message, i) => <ChatSingle key={i} chat={message} /> )
				}
			</div>
		</div>
	)
}

const ChatMessages = ({chats}) => {
	const classes = useStyles()

	let dates = [], _chats = []

	chats.forEach(i => {
		const dateInDates = dates.findIndex(d => d === i.timestamp.day)
		if (dateInDates === -1) {
			dates.push(i.timestamp.day)
		}
	})

	dates.forEach(day => {
		const chatByDate = chats.filter(chat => chat.timestamp.day === day)
		_chats.push({day: day, chats: [...chatByDate]})
	})

	return (
		<> 
				<div className={classes.chats}>
					{ _chats.length > 0 &&
							_chats.map((chatCollection, i) => <ChatsByDate key={i} chat={chatCollection} />)
					}
				</div>
		</>
	)
}

export default ChatMessages