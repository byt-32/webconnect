import React from 'react'
import styles from '../../../stylesheet/main.module.css'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SendIcon from '@material-ui/icons/Send';
import TagFacesIcon from '@material-ui/icons/TagFaces';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu'
import Alert from '@material-ui/lab/Alert'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import AddIcCall from '@material-ui/icons/AddIcCall';
import CloseIcon from '@material-ui/icons/Close';
import InputBase from "@material-ui/core/InputBase";
import { useDispatch,useSelector } from 'react-redux'
import { retrieveOTM, storePrivateChats, handleReply } from '../../../Redux/globalPropsSlice'
import ChatMessages from './ChatMessages'
import { makeStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';

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

	}
})
const MessagesPane = () => {
	const classes = useStyles()
	const emojiClass = useStyles()

	const dispatch = useDispatch()
	const selectedUser  = useSelector(state => state.globalProps.currentSelectedUser)
	const reply  = useSelector(state => state.globalProps.reply)
	const user = useSelector(state => state.globalProps.user)
	const status = useSelector(state => state.globalProps.user.status)
	const loader = useSelector(state => state.globalProps.loader)
	
	const [anchorEl, setAnchorEl] = React.useState(null)
	const [isTyping, typing] = React.useState(false)
	const [input, setInput] = React.useState('')
	const [showPicker, setPicker] = React.useState(false)
	const [fetchErr, setFetchErr] = React.useState(false)
	
	const toggleMenu = (event) => {
		setAnchorEl(event.target)
	}
	const handleClose =() => {
		setAnchorEl(null)
	}
	
	const handleTextInput = (e) => {
		setInput(e.target.value)
	}

	const sendMessage = async () => {
		const dateNow = () => Date.now()
		let chatId = dateNow()
		if (input !== '') {
			if (status === 'offline') {
				setFetchErr(true)
			} else if (status === 'online') {
				setFetchErr(false)
				dispatch(storePrivateChats({
					username: selectedUser.username, 
					message: input, 
					me: true, 
					chatId: chatId,
					reply: reply,
				}))
				setInput('')
				dispatch(retrieveOTM({input: input, chatId: chatId}))
			}
		}
	}
	
	return (
		<section className={classes.messagePane}>
			
		</section>
	)
}

export default MessagesPane