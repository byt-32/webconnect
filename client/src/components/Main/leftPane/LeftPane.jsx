import React from 'react'
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
		className: 'animate__animated',
		classNames: {
			enter: 'animate__fadeInRight',
		}
	}
	return (
		<section className={classes.leftpane}  >
			{activeUsers && <ActiveUsers className={['animate__fadeInRight', 'animate__animated'].join(' ')}/>}
			{recentChats && <RecentChats className={['animate__fadeInRight', 'animate__animated'].join(' ')} />}
			{settings && <Settings className={['animate__fadeInRight', 'animate__animated'].join(' ')} />}
			{contactInfo && <ContactInfo className={['animate__fadeInRight', 'animate__animated'].join(' ')}/>}
			{resetPassword && <ResetPassword className={['animate__fadeInRight', 'animate__animated'].join(' ')}/>}
		</section>
			
	)
}

export default LeftPane