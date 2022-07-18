import React from 'react'
import styles from '../stylesheet/main.module.css'
const AfterReset = () => {
	return (
		<section className={styles.afterReset}>
			<div className={styles.afterResetBody}>
				<h1> webconnect </h1>
				<div className={styles.afterResetInfo}>
					<h2> Successful password reset! </h2>
					<p> You can now use your new password to log in to your account </p>
				</div>
			</div>
		</section>
	)
}
export default AfterReset