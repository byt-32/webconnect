import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setComponents } from '../../../Redux/features/componentSlice'
import TextField from '@material-ui/core/TextField'
import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search'
import { Link } from 'react-router-dom'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { makeStyles } from '@material-ui/core/styles';

import { assert } from '../../../lib/script'
import UserAvatar from '../UserAvatar'

import UserMessagesPane from './UserMessagesPane'
import GroupMessagesPane from './GroupMessagesPane'


const useStyles = makeStyles({
	rightPane: {
		flex: 9,
		display: 'flex',
		overflow: 'hidden',
		'& > div': {
			width: '100%',
			position: 'relative'
		},
		['@media (max-width: 625px)']: {
			width: '100%',
			zIndex: 30,
			flex: 1
			// display: 'none'
		},
	},
})


const RightPane = ({user}) => {
	const dispatch = useDispatch()
	const classes = useStyles()
	const privateChats = useSelector(state => state.chat.privateChats)
	const groupChats = useSelector(state => state.groups.groupChats)
	const selectedUser = useSelector(state => state.other.currentSelectedUser)
	const selectedGroup = useSelector(state => state.groups.selectedGroup)

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
			{
				assert(groupChats) &&
				groupChats.map((groupInfo, i) => {
					const isCurrentSelected = () => {
						if (selectedGroup.groupId === groupInfo.group.groupId) return true
						else return false
					}
				
					return <GroupMessagesPane {...groupInfo} isCurrentSelected={isCurrentSelected()} key={i} />
				})
			}
			{
				assert(privateChats) &&
					privateChats.map( (friend, i) => {
						return (
							<UserMessagesPane friend={friend} key={i} />
						)
					})
			}
		</section>
	)
}

export default RightPane