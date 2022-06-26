import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import DoneAllIcon from '@material-ui/icons/DoneAll'
import DoneIcon from '@material-ui/icons/Done'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import ReplyIcon from '@material-ui/icons/Reply'
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
	chatSingle: {
		width: 'max-content',
		color: common.white,
		borderRadius: 5,
		marginTop: 8,
		padding: '4px 8px',
		background: blue[400]
	},
	reply: {
		background: common.white,
		color: common.black,
		fontSize: '.85rem',
		padding: 5,
		borderRadius: '0 5px 0 0'
	}
})

const ChatSingle = ({chat}) => {
	const classes = useStyles()
	const username = useSelector(state => state.account.account.username)
	function replace(text) {
		return text.replaceAll('\n', '<br/>')
	}
	return (
		<div className={classes.chatSingle} style={{
			alignSelf: chat.me ? 'flex-end' : 'flex-start',
			padding: chat.reply.open && '0 0 0 2px'
		}} >
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