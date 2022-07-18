import React from 'react'
import styles from '../../stylesheet/main.module.css'
import { FaFacebook } from 'react-icons/fa'

const AltFacebook = () => {
	return (
		<div className={[styles.facebook, styles.altSignup].join(' ')}>
			<FaFacebook />
			<span className={styles.altSignupText}>Sign up with Facebook</span>
		</div>
	)
}

export default AltFacebook