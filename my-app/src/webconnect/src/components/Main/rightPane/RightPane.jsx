import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from '../../../stylesheet/main.module.css'
import { setComponents } from '../../../Redux/features/componentSlice'
import TextField from '@material-ui/core/TextField'
import Menu from '@material-ui/core/Menu'
import MessagePane from './MessagePane'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search'
import UserAvatar from '../UserAvatar'
import { Link } from 'react-router-dom'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	rightPane: {
		flex: 9,
		display: 'flex',
		paddingLeft: 5
	},
	messagesPane: {
		flex: 1
	}
})


const RightPane = ({user}) => {
	const dispatch = useDispatch()
	const classes = useStyles()
	const privateChats = useSelector(state => state.chat.privateChats)
	const selectedUser = useSelector(state => state.other.currentSelectedUser)

	const profile = useSelector(state => state.components.profile)

	const [anchorEl, setAnchorEl] = React.useState(null)
	const open = Boolean(anchorEl)
	const toggleMenu = (event) => {
		setAnchorEl(event.target)
	}
	const handleClose =() => {
		setAnchorEl(null)
	}
	const setComponent = (obj) => {
		dispatch(setComponents(obj))
	}
	
	return (
		<section className={classes.rightPane} >
			<div className={classes.messagesPane}>
				{
					privateChats.map( friend => {
						return (
							<MessagePane friend={friend} key={friend.username} />
						)
					})
				}
			</div>
			<div className={classes.friendProfile}>

			</div>
		</section>
	)
}

export default RightPane