import React from 'react'
import styles from '../../../stylesheet/main.module.css'
import { useSelector } from 'react-redux'
import retrieveDate from '../../../retrieveDate'
import Loader from './Loader'

const ChatMessages = () => {
	const [chats, setChats] = React.useState([])
	const currentSelectedUser = useSelector(state => state.globalProps.currentSelectedUser)
	const privateChats = useSelector(state => state.globalProps.privateChats)
	const showLoader = useSelector(state => state.globalProps.loader)

	let _dates = [], showDateNotice = false
	const day = retrieveDate(new Date().toDateString()).day

	const setBool = (val) => {
		showDateNotice = val
	}
	function replace(text) {
		return {__html: text.replace('\n', '<br/>')}
	}
	React.useEffect(() => {
		if (privateChats.length >= 1) {
			const chatByUsername = privateChats.find( chat => chat.username === currentSelectedUser.username)
			if (chatByUsername !== undefined) {
				setChats(chatByUsername.messages)
			} else {
				setChats([])
			}
		}

	}, [privateChats, currentSelectedUser])
	const setEle = (e) => {
		const target = e.target
		const className = target.className
		target.nextElementSibling.style.display = 'block'

		const chats = document.querySelectorAll(`.${className}`)
		for (let i of chats) {
			if (i !== target) {
				i.nextElementSibling.style.display = 'none'
			}
		}

	}
	return (
		<> {showLoader ? <Loader /> :
		<div className={styles.chats}>

			{chats !== null && chats.map((message, i) => {

				const find = _dates.find(date => date === message.timestamp.day)

				if (find === undefined) {
					_dates.push(message.timestamp.day)
					setBool(true)
				} else {
					setBool(false)
				}

				const dayInChat = _dates.find(date => date === message.timestamp.day)
				//TODO:--> ALSO GET THE YEAR AND PERFORM LOGIC AS WELL
				return (
					<div key={i} className={styles.chat} >
						{showDateNotice ? <span className={styles.dateNotice} > 
							{dayInChat === day 
								? 'Today' : dayInChat
							} 
							</span> : <></>
						}
						<div className={[styles.message,  message.me ? styles.chatsRight : styles.chatsLeft].join(' ')} >
							<span onClick={e => {
								setEle(e)
							}}

								 className={styles.chat_} dangerouslySetInnerHTML={replace(message.message)} > 
							</span>
							<span className={styles.datetime} style={{display: 'none'}} > {message.timestamp.time} </span>
						</div>
					</div>
				)
			})}
			
		</div>}</>
	)
}

export default ChatMessages