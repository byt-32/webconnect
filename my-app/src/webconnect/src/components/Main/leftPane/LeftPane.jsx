import React from 'react'
import styles from '../../../stylesheet/main.module.css'
import '../../../stylesheet/styles.css'
import ActiveUsers from './ActiveUsers'
import RecentChats from './RecentChats'
import Settings from './settings/Settings'
import ResetPassword from './settings/ResetPassword'
import ContactInfo from './settings/ContactInfo'
import Privacy from './settings/Privacy'
import { CSSTransition } from 'react-transition-group'

import { useSelector } from 'react-redux'

const LeftPane = () => {
	const components = useSelector(state => state.globalProps.components.stack)

	return (
		<section className={[styles.leftPane, styles.panes].join(' ')}>
			{components[0].activeUsers &&
			 <ActiveUsers />
			}
			{components[1].recentChats &&
					<RecentChats />
			}
			{components[2].settings && <Settings />}
			{components[3].resetPassword && <ResetPassword />}
			{components[4].contactInfo && <ContactInfo />}
			{components[5].privacy && <Privacy />}
		</section>
			
	)
}

export default LeftPane