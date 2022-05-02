import React from 'react'
import styles from '../../../stylesheet/main.module.css'
import { useDispatch,useSelector } from 'react-redux'
import UserAvatar from '../UserAvatar'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import CallIcon from '@material-ui/icons/Call'
import VideocamIcon from '@material-ui/icons/Videocam'
import InfoIcon from '@material-ui/icons/Info'
import EmailIcon from '@material-ui/icons/Email'
import LocalPhoneIcon from '@material-ui/icons/LocalPhone'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import IconButton from '@material-ui/core/IconButton';
import { setComponents, storeProfileInfos } from '../../../Redux/globalPropsSlice'
import Loader from './Loader'

const useStyles = makeStyles({
	app: {
		background: '#fff',
		boxShadow: 'none',
		borderBottom: '1px solid #d1d1d1',
		fontSize: '90%',
		padding: '11px 0'
	},
	toolbar:{
		justifyContent: 'space-between',
		minHeight: 'auto',
		paddingLeft: '0',
		paddingRight: '10px'
	},
	headerItem: {
		display: 'flex',
		alignItems: 'center',
		'& button': {
			marginLeft: '10px',
			'& svg': {
				color: '#000'
			}
		}
	},
	avatar: {
		fontSize: '205% !important',
		padding: '20% !important',
		margin: '0 auto'
	},
	profileInfo: {
		marginTop: '6%',
		width: '100%',
		padding: '0 10px'
	},
	info: {
		fontSize: '17.9px',
    // borderBottom: '1px solid #eee',
		marginBottom: '15px'
	},
	infoHeader: {
		fontSize: '13px',
		fontWeight: 'normal',
		paddingBottom: '3px',
		marginBottom: '5px',
		paddingRight: '20px',
		width: 'max-content'
	},
	infoItems: {
		fontSize: '17px',
    marginBottom: '15px',
    width: 'fit-content',
    paddingBottom: '8px',
    marginLeft: '8px'
		// fontWeight: 'bold'
	},
	profileBanner: {
		width: '100%'
	},
	contacts: {
		display: 'flex',
		alignItems: 'center',
		'& svg': {
			marginRight: '10px',
			fontSize: '20px'
		}
	},
	appBody: {
		overflow: 'scroll'
	}
})

const Profile = () => {
	const dispatch = useDispatch()
	const id = useSelector(state => state.globalProps.user.contacts.id)
	const selectedUser = useSelector(state => state.globalProps.currentSelectedUser)
	const profileInfos = useSelector(state => state.globalProps.profileInfos)
	const [info, setInfo] = React.useState({
		bio: '', gmail: '', username:''
	})
	const [display, setDisplay] = React.useState(false)
	const classes = useStyles()
	const fetchProfileInfo = () => {
		fetch(`/getUserSettings/${selectedUser.username}/${id}`)
		.then(res => res.json())
		.then(res => {
			dispatch(storeProfileInfos([res]))
			setInfo({...info, ...res})
			setDisplay(true)
		})
	}
	React.useEffect(() => {
		if (profileInfos.length === 0) {
			fetchProfileInfo()
		} else {
			const find = profileInfos.find(user => user.username === selectedUser.username)
			if (find !== undefined) {
				setInfo({...info, ...find})
				setDisplay(true)
			} else {
				fetchProfileInfo()
			}
		}
		
	}, [])
	const setComp = (obj) => {
		dispatch(setComponents(obj))
	}
	const [height, setHeight] = React.useState(`${window.innerHeight - 30}px`)
  window.onresize = () => {
  	setHeight(`${window.innerHeight - 30}px`)
  }
	return (
		<section className={[styles.component, styles.profilePage, styles.animate__animated, styles.animate__fadeInRight].join(' ')}>
			<AppBar position='static' className={classes.app} >
				<Toolbar className={classes.toolbar} >
					<div className={classes.headerItem}>
						<IconButton onClick={() => setComp({component: 'profile', value: false})} >
							<KeyboardArrowLeftIcon />
						</IconButton>
					</div>
					<div className={classes.headerItem}>
						{/*<IconButton>
							<CallIcon />
						</IconButton>
						<IconButton>
							<VideocamIcon />
						</IconButton>*/}
					</div>
				</Toolbar>
			</AppBar>
			{!display ? <Loader customStyle={[classes.loader, styles.loader].join(' ')} /> :
				<div className={[styles.profile, styles.appBody].join(' ')} style={{
					height: height
				}} >
					<div className={classes.profileBanner}>
						<UserAvatar 
							color={selectedUser.color}
							name={selectedUser.username} 
							className={classes.avatar} 
						/>
					</div>
					<div className={[classes.profileInfo, styles.profileInfo].join(' ')}>
						<div className={classes.info}>
							<div className={classes.infoHeader}> Name </div>
						 	<div className={classes.infoItems}> {selectedUser.username}  </div>
						</div>

						{info.bio !== '' && <div className={classes.info}>
							<div className={classes.infoHeader}> Bio </div>
							<div className={classes.infoItems}>
								{info.bio} 
							</div>
						</div>}
						{info.gmail !== '' && <div className={classes.info}>
							<div className={classes.infoHeader}> Contact </div>
							<div className={classes.infoItems}>
								<div className={classes.contacts}>
									<EmailIcon className={classes.contactIcon} />
									{info.gmail} 
								</div>
							</div>
						</div>}
					</div>
				</div>
			}
		</section>
	)
}

export default Profile