import React from 'react'

import { CSSTransition } from 'react-transition-group'
import { makeStyles } from '@material-ui/core/styles';
import common from '@material-ui/core/colors/common';
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert';

import ActiveUsers from './ActiveUsers'
import RecentChats from './RecentChats'
import NewGroup from './NewGroup'
import Settings from './settings/Settings'
import ResetPassword from './settings/ResetPassword'
import ContactInfo from './settings/ContactInfo'

import styles from '../../../stylesheet/transition.css'

import { useSelector } from 'react-redux'

const useStyles = makeStyles(() => ({
	leftpane: {
		background: common.white,
		// background: 'linear-gradient(39deg, #ffffff, #e5af1800)',
		zIndex: 25,
		minWidth: 250,
		maxWidth: 400,
		width: 330,
		overflowY: 'scroll',
		'& > section': {
			width: '100%',
		},
		['@media (max-width: 660px)']: {
			width: '100%',
			maxWidth: '100%'
		},
	}
}))

const LeftPane = () => {
	const classes = useStyles()
	const {
		activeUsers,
		recentChats,
		contactInfo,
		settings,
		resetPassword,
		newGroup
	} = useSelector(state => state.components.stack)

	const networkError = useSelector(state => state.chat.networkError)

	const trasitionProps = {
		timeout: 500,
		unmountOnExit: true,
		className: 'animate__animated',
		classNames: {
			enter: 'animate__fadeInRight',
		}
	}
	return (
		<section className={classes.leftpane} >
			<Snackbar open={networkError}
      	className={[classes.bottomSnackbar, classes.snackbar].join(' ')}
				autoHideDuration={6000} 
			>
			  <MuiAlert variant='filled' elevation={6} severity="error">
			    Network error. Check your connection.
			  </MuiAlert>
			</Snackbar>

			{activeUsers && <ActiveUsers className={[styles.animate__fadeInRight, styles.animate__animated].join(' ')}/>}
			{recentChats && <RecentChats className={[styles.animate__fadeInRight, styles.animate__animated].join(' ')} />}
			{newGroup && <NewGroup className={[styles.animate__fadeInRight, styles.animate__animated].join(' ')} />}
			{settings && <Settings className={[styles.animate__fadeInRight, styles.animate__animated].join(' ')} />}
			{contactInfo && <ContactInfo className={[styles.animate__fadeInRight, styles.animate__animated].join(' ')}/>}
			{resetPassword && <ResetPassword className={[styles.animate__fadeInRight, styles.animate__animated].join(' ')}/>}
		</section>
			
	)
}

export default LeftPane