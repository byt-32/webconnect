import React from 'react'
import styles from '../../stylesheet/main.module.css'
import { FcGoogle } from 'react-icons/fc'

const AltGoogle = () => {
	return  (
		<div className={[styles.fcgoogle, styles.altSignup].join(' ')}>
			<FcGoogle />
			<span className={styles.altSignupText}> Sign up with Google</span>
		</div>
	)
}

export default AltGoogle