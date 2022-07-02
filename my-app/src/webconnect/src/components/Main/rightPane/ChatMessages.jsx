import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import DoneAllIcon from '@material-ui/icons/DoneAll'
import ReplyIcon from '@material-ui/icons/Reply'
import DoneIcon from '@material-ui/icons/Done';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

import { handleReply, setHighlightedId } from '../../../Redux/features/chatSlice'
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
		alignItems: 'flex-end'
	},
	fromAccount: {
		alignSelf: 'flex-end',
		marginLeft: '1rem',
		'& > div': {
			background: blue[400],
			color: common.white,
		}
	},
	fromFriend: {
		alignSelf: 'flex-start',
		marginRight: '1rem',
		'& > div': {
			background: common.white,
			color: common.black
		}
	},
	chatSingle: {
		width: 'auto',
		borderRadius: 5,
		marginTop: 8,
		padding: '4px 8px',
	},
	reply: {
		background: common.white,
		color: common.black,
		fontSize: '.85rem',
		padding: 5,
		borderRadius: '0 5px 0 0'
	},

	chatRead: {
		padding: '0 3px',
		'& svg': {
			fontSize: '.8rem'
		}
	}
})

const ChatSingle = ({chat}) => {
	const classes = useStyles()
	const username = useSelector(state => state.account.account.username)
	let me = (chat.me || chat.sentBy === username) ? true : (!chat.me || chat.sentBy !== username) ? 
	false : ''

	function replace(text) {
		return text.replaceAll('\n', '<br/>')
	}
	return (
		<div className={[classes.chatAndprop, me ? classes.fromAccount : classes.fromFriend].join(' ')} >
			<div className={classes.chatSingle} style={{
				padding: chat.reply.open && '0 0 0 2px'
			}}>
				{ chat.reply.open ?
					<> 
						<div className={classes.reply}>
							<div style={{
									color: deepOrange[500],
									padding: '0 9px 3px 0',
									fontSize: '.8rem', fontWeight: 'bold'}} >
								{
									chat.reply.person === username ? 'You' : chat.reply.person
								}
							</div>
							{chat.reply.to}
						</div>
						<div style={{
							padding: '4px 8px 4px 3px'
						}} > 
							{chat.message} 
						</div>

					</>
					
					: <> {chat.message} </>
				}
			</div>
			{ me &&
				<span className={classes.chatRead}>
					{chat.read ? <DoneAllIcon style={{color: '#00c759'}} /> : <DoneIcon />}
				</span>
			}
		</div>
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