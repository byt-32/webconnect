import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from '../../../stylesheet/main.module.css'
import { setComponents } from '../../../Redux/globalPropsSlice'
import TextField from '@material-ui/core/TextField'
import Menu from '@material-ui/core/Menu'
import MessagesPane from './MessagesPane'
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
	backBtn: {
		fontSize: '1.2rem !important'
	}
})

const RightPane = () => {
	const dispatch = useDispatch()
	const classes = useStyles()
	const selectedUser = useSelector(state => state.globalProps.currentSelectedUser)
	const profile = useSelector(state => state.globalProps.components.profile)
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
		<section className={[styles.rightPane, styles.panes].join(' ')} >
			<header className={[styles.paneHeader, styles.rightPaneHeader].join(' ')}>
				<Link to='/'>
			    <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setComponent({component: 'rightPane', value: false})} >
			      <ArrowBackIosIcon className={classes.backBtn} />
			    </IconButton>
		   	</Link>
				<div className={styles.paneHeaderItems}>
					<div className={styles.userInfo} >
						<UserAvatar 
							color={selectedUser.color}
							name={selectedUser.username}  
							badge='false' 
							status={selectedUser.status} 
						/>
						<div className={styles.info} >
							<h1> {selectedUser.username} </h1>
							<span className={styles.status} > {selectedUser.typing ? 'typing..' : selectedUser.status} </span>
						</div>
					</div>

					<div className={styles.rightPaneHeaderMisc} >
						<IconButton onClick={toggleMenu} disabled={profile ? true : false} > 
							<MoreVertIcon />
						</IconButton>

						<Menu open={profile ? false : open} variant='menu' anchorEl={anchorEl} onClose={handleClose} getContentAnchorEl={null} anchorOrigin={{
					      vertical: 'center',
					      horizontal: 'left',
					    }}
					    transformOrigin={{
				      vertical: 'center',
				      horizontal: 'right',
				    }}>
							<MenuItem onClick={() => {
								handleClose()
								setComponent({component: 'profile', value: true})
							}}>
								<Typography> Profile </Typography>
							</MenuItem>
						</Menu>

					</div>
				</div>
			</header>
			
			<MessagesPane />
		</section>
	)
}

export default RightPane