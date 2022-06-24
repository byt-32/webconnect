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

import { useSelector } from 'react-redux'

const useStyles = makeStyles(() => ({
	leftpane: {
		flex: 4,
	}
}))

const LeftPane = () => {
	const classes = useStyles()
	const {
		activeUsers,
		recentChats,
		contactInfo,
		privacy,
		resetPassword
	} = useSelector(state => state.globalProps.components.stack)
	return (
		<section className={classes.leftpane} >
			{activeUsers && <ActiveUsers />}
			{recentChats && <RecentChats />}
			{contactInfo && <ContactInfo />}
			{resetPassword && <ResetPassword />}
			{privacy && <Privacy />}
		</section>
			
	)
}

export default LeftPane