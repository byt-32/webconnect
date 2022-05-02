import React from 'react'
import styles from '../../stylesheet/main.module.css'
import Form from './Form'
import ImageBanner from '../ImageBanner'
import { Link } from 'react-router-dom'

const imgUrls = [
	{
		url: 'undraw_personal_information_re_vw8a.svg',
		text: ''
	}
]

const Login = () => {
	
	return (
		<div className={[styles.signupMain, styles.animate__animated, styles.animate__fadeIn].join(' ')}  >
			<div className={styles.spx1}>
				{/*<ImageBanner imgUrls={imgUrls} />*/}
				
				<section className={[styles.signupMainRight, styles.signupMainFc].join(' ')}>
					<div className={styles.SMRContainer} >

						<header>
							<h1> Welcome back </h1>
							<button type='button' className={styles.headerBtn}>
								<Link to='/signup'>Create Account </Link>
							</button>
						</header>
						
						<div className={styles.Form}>
							<Form />
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}

export default Login