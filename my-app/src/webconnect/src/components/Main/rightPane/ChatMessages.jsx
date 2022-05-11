import React from 'react'
import styles from '../../../stylesheet/main.module.css'
import { useSelector, useDispatch } from 'react-redux'
import retrieveDate from '../../../retrieveDate'
import Loader from './Loader'
import DoneAllIcon from '@material-ui/icons/DoneAll'
import DoneIcon from '@material-ui/icons/Done'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import ReplyIcon from '@material-ui/icons/Reply'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import IconButton from '@material-ui/core/IconButton';
import { handleReply, setHighlightedId } from '../../../Redux/globalPropsSlice'

const day = retrieveDate(new Date().toDateString()).day

const ChatSingle = ({chatAndAttr}) => {
	function replace(text) {
		return text.replaceAll('\n', '<br/>')
	}
	const currentSelectedUser = useSelector(state => state.globalProps.currentSelectedUser)
	const accountOwner = useSelector(state => state.globalProps.user.contacts.username)
	const highlightedReply = useSelector(state => state.globalProps.highlightedId)
	const [highlight, setHighlight] = React.useState(false)
	const dispatch = useDispatch()
	const [open, setOpen] = React.useState(false);
	const selectedChat = React.useRef(null)

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const person = () => {
  	if (chatAndAttr.reply.person === accountOwner) {
  		return 'You'
  	} else {
  		return chatAndAttr.reply.person
  	}
  }
  const handleClickAway = () => {
    setOpen(false);
  };
  const setReply = (e) => {
  	dispatch(handleReply({
  		open: true,
  		person: chatAndAttr.me ? accountOwner : currentSelectedUser.username,
  		to: chatAndAttr.message,
  		chatId: chatAndAttr.chatId
  	}))
  }
  const handleCopy = () => {
  	
  }
  const highlightReply = () => {
  	if (chatAndAttr.chatId !== undefined) {
  		if (chatAndAttr.reply.chatId !== undefined && chatAndAttr.reply.chatId !== '') {
  			dispatch(setHighlightedId(chatAndAttr.reply.chatId))
  		}
  	}
  }
  React.useEffect(() => {
  	if (highlightedReply !== '') {
  		if (highlightedReply === chatAndAttr.chatId) {
  			selectedChat.current.scrollIntoView()
  			setTimeout(() => setHighlight(true), 1000)
  			
  			// document.querySelectorAll('.Wzm2GKa4C2sh_8jVswOw')[0].scrollTop = selectedChat.current.getBoundingClientRect().top -100
  			setTimeout(() => setHighlight(false), 3000)
  		}
  	}
  }, [highlightedReply])
	return (
		<ClickAwayListener onClickAway={handleClickAway}>
			
		  <div className={[
		  	styles.chatSingle, styles.animate__animated,
		  	chatAndAttr.me ? styles.rightChat : styles.leftChat, highlight && styles.animate__headShake
		  ].join(' ')} ref={selectedChat}>
		  	{open ? (
					<Fade in={open}>
						<div className={styles.chatAction}>
							<IconButton onClick={() => setReply()}> <ReplyIcon /> </IconButton>
							<IconButton onClick={handleCopy}> <FileCopyOutlinedIcon /> </IconButton>
						</div>
					</Fade>
				) : null}

				 {
					chatAndAttr.reply.open ? (
						<div className={styles.chatReply}>
							<div className={styles.replySingle} onClick={highlightReply} >
								<div className={styles.person}> {person()} 
								</div>
								<div className={styles.to}> {chatAndAttr.reply.to} </div>
							</div>
							<div className={styles.message} onClick={handleClick}
					 			dangerouslySetInnerHTML={{__html: replace(chatAndAttr.message)}} />
						</div>
					) : (
						<div className={styles.message} onClick={handleClick}
					 		dangerouslySetInnerHTML={{__html: replace(chatAndAttr.message)}} />
					 	)
				 }
		    {open ? (
		    	<Fade in={open}>
			      <span className={[styles.messageTime, styles.dropdown].join(' ')}>
							{chatAndAttr.timestamp.time}
						</span>
					</Fade>
		    ) : null}
		  </div>
		</ClickAwayListener>
	)
}

const ChatsByDate = ({chat}) => {
	const [dateNotice, setDateNotice] = React.useState(false)
	document.querySelectorAll('.Wzm2GKa4C2sh_8jVswOw')[0].addEventListener('scroll', () => {
		setDateNotice(true)
	})
	return (
		<div className={[styles.chatCollection].join(' ')}>
			{
				dateNotice ? (
					<Fade in={dateNotice}>
						<header className={styles.dateNotice} >
							<div>{chat.day === day ? 'Today' : chat.day}</div>
						</header>
					</Fade>
				) : null
			}
				
			<div className={styles.indexedChats}>
				{
					chat.chats.length > 0 &&
						chat.chats.map((message, i) => <ChatSingle key={i} chatAndAttr={message} /> )
				}
			</div>
		</div>
	)
}

const ChatMessages = () => {
	const [chats, setChats] = React.useState([])
	const [indexedChats, setIndexChats] = React.useState([])
	const currentSelectedUser = useSelector(state => state.globalProps.currentSelectedUser)
	const privateChats = useSelector(state => state.globalProps.privateChats.find(chat => chat.username === currentSelectedUser.username))
	const showLoader = useSelector(state => state.globalProps.loader)

	React.useEffect(() => {
		if (privateChats !== undefined) {
			if (privateChats.messages.length > 0) {
				setChats(privateChats.messages)
			} else {
				setChats([])
			}
		} else {
			setChats([])
		}

	}, [privateChats, currentSelectedUser])

	React.useEffect(() => {
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
		setIndexChats([..._chats])
	}, [chats])

	React.useEffect(() => {
		// console.log(indexedChats)
	}, [indexedChats])

	return (
		<> {
			showLoader ? <Loader /> :
			<div className={styles.chats}>
				{
					indexedChats.length > 0 &&
						indexedChats.map((chatCollection, i) => <ChatsByDate key={i} chat={chatCollection} />)
				}
			</div>
		} </>
	)
}

export default ChatMessages