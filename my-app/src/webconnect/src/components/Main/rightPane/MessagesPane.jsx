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
import InputBase from "@material-ui/core/InputBase";
import { useDispatch,useSelector } from 'react-redux'
import { retrieveOTM, storePrivateChats } from '../../../Redux/globalPropsSlice'
import ChatMessages from './ChatMessages'
import { makeStyles } from '@material-ui/core/styles';

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
	const recepient  = useSelector(state => state.globalProps.currentSelectedUser)
	const user = useSelector(state => state.globalProps.user)
	const status = useSelector(state => state.globalProps.user.status)
	const loader = useSelector(state => state.globalProps.loader)
	
	const [anchorEl, setAnchorEl] = React.useState(null)
	const [isTyping, typing] = React.useState(false)
	const [input, setInput] = React.useState('')
	const [showPicker, setPicker] = React.useState(false)
	const [fetchErr, setFetchErr] = React.useState(false)
	const open = Boolean(anchorEl)
	const openFilePicker = async () => {
		const pickerOpts = {
			types: [
				{
					description: 'Images',
					accept: {
						'image/*': ['.png', '.gif', '.jpeg', '.jpg']
					}
				}
			]
		}
		try {
			const fileHandle = await window.showOpenFilePicker(pickerOpts);
			const fileData = await fileHandle.getFile();
		console.log(fileData)

		} catch(e) {
			console.log('ERRR', e)
		}

	}
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
		if (input !== '') {
			if (status === 'offline') {
				setFetchErr(true)
			} else if (status === 'online') {
				setFetchErr(false)
				dispatch(storePrivateChats({username: recepient.username, message: input, me: true}))
				setInput('')
				dispatch(retrieveOTM(input))
			}
		}
	}
	const [height, setHeight] = React.useState(`${window.innerHeight - 30}px`)
  window.onresize = () => {
  	setHeight(`${window.innerHeight - 30}px`)
  }
	
	return (
		<section className={styles.messagesMain} style={{
			height: height
		}} >
			<div className={[styles.messageChats, classes.messagesChats].join(' ')}>
				<span className={styles.dateFixed}> Today </span>
				{fetchErr && <Alert className={classes.error} severity="warning"> You are currently offline </Alert>}
				<ChatMessages />
			</div>
			<div className={styles.messageInput} >
				<div style={{width: '10%'}}>
					<IconButton onClick={openFilePicker} >
						<AttachFileIcon size='medium' color='disabled'  />
					</IconButton>
				</div>
				<div className={styles.messageField}>
					<InputBase variant='outlined' multiline minRows={1}       
						maxRows={4}
						onChange={handleTextInput}
						value={input}
					color='primary' placeholder='Type your messages' 
					classes={{root: styles.input}} />
				</div>
				<div className={styles.sendMessage}>
					{/*<TagFacesIcon className={emojiClass.emoji} onClick={() => setPicker(val => !val)} />*/}
					<IconButton onClick={sendMessage} > <SendIcon color='primary' /></IconButton>
				</div>
				<div className={styles.chatOtions}>
					<IconButton onClick={toggleMenu}> 
							<MoreVertIcon color='disabled' />
						</IconButton>

						<Menu open={false} variant='menu' anchorEl={anchorEl} onClose={handleClose} getContentAnchorEl={null} anchorOrigin={{
					      vertical: 'top',
					      horizontal: 'left',
					    }}
					    transformOrigin={{
				      vertical: 'bottom',
				      horizontal: 'right',
				    }}>
							<MenuItem onClick={handleClose}>
								<AddIcCall fontSize='medium' />
								<Typography classes={{root: styles.menuText}} > Voice call </Typography>
							</MenuItem>
							<MenuItem onClick={handleClose}>
								<VideoCallIcon fontSize='medium' />
								<Typography classes={{root: styles.menuText}} > Video call </Typography>
							</MenuItem>
						</Menu>
				</div>
			</div>
		</section>
	)
}

export default MessagesPane