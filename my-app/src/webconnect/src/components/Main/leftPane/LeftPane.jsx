import React from 'react'
import styles from '../../../stylesheet/main.module.css'
import ActiveUsers from './ActiveUsers'
import RecentChats from './RecentChats'
import Settings from './settings/Settings'
import ResetPassword from './settings/ResetPassword'
import ContactInfo from './settings/ContactInfo'
import { CSSTransition } from 'react-transition-group'
import { makeStyles } from '@material-ui/core/styles';
import common from '@material-ui/core/colors/common';

import { useSelector } from 'react-redux'

const useStyles = makeStyles(() => ({
	leftpane: {
		background: common.white,
		zIndex: 25,
		minWidth: 250,
		maxWidth: 400,
		width: 330,
		overflowY: 'scroll',
		'& > section': {
			width: '100%'
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
		resetPassword
	} = useSelector(state => state.components.stack)

	const trasitionProps = {
		timeout: 500,
		unmountOnExit: true,
		className: styles.animate__animated,
		classNames: {
			enter: styles.animate__fadeInRight,
		}
	}
	return (
		<section className={classes.leftpane}  >
			{activeUsers && <ActiveUsers className={[styles.animate__fadeInRight, styles.animate__animated].join(' ')}/>}
			{recentChats && <RecentChats className={[styles.animate__fadeInRight, styles.animate__animated].join(' ')} />}
			{settings && <Settings className={[styles.animate__fadeInRight, styles.animate__animated].join(' ')} />}
			{contactInfo && <ContactInfo className={[styles.animate__fadeInRight, styles.animate__animated].join(' ')}/>}
			{resetPassword && <ResetPassword className={[styles.animate__fadeInRight, styles.animate__animated].join(' ')}/>}
		</section>
			
	)
}

export default LeftPane