import React from 'react'
import styles from '../../../stylesheet/main.module.css'
import ActiveUsers from './ActiveUsers'
import RecentChats from './RecentChats'
import Settings from './settings/Settings'
import ResetPassword from './settings/ResetPassword'
import ContactInfo from './settings/ContactInfo'
import Privacy from './settings/Privacy'
import { CSSTransition } from 'react-transition-group'
import { makeStyles } from '@material-ui/core/styles';
import common from '@material-ui/core/colors/common';

import { useSelector } from 'react-redux'

const useStyles = makeStyles(() => ({
	leftpane: {
		background: common.white,
		minWidth: 250,
		maxWidth: 400,
		width: 300,
		overflowY: 'scroll'
	}
}))

const LeftPane = () => {
	const classes = useStyles()
	const {
		activeUsers,
		recentChats,
		contactInfo,
		privacy,
		settings,
		resetPassword
	} = useSelector(state => state.components.component.stack)
	return (
		<section className={classes.leftpane} >
			{activeUsers && <ActiveUsers />}
			{recentChats && <RecentChats />}
			{settings && <Settings />}
			{contactInfo && <ContactInfo />}
			{resetPassword && <ResetPassword />}
			{privacy && <Privacy />}
		</section>
			
	)
}

export default LeftPane