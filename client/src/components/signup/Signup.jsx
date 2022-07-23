import React from 'react'
import { Card, CardContent, CardActions, Typography } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import AltFacebook from './AltFacebook'
import AltGoogle from './AltGoogle'
import Form from './Form'
import ImageBanner from '../ImageBanner'
import { Link } from 'react-router-dom'

// Making use of 3 APIs in the project
//1. Contact picker api
//2. Twillo api for sending text messages
//3. Also an api for sending emails
//Basically the project is an app for 
//sending text messages and emails, it will also make phone calls
//Also, users connected end to end on the web app will chat in real-time

const imgUrls = [
	{
		url: 'undraw_online_re_x00h.svg',
		text: ''
	}
]

const SignUp = () => {
	return (
		<div className={['signupMain', 'animate__animated', 'animate__fadeIn'].join(' ')} >
			<div className={'spx1'}>

				{/*<ImageBanner imgUrls={imgUrls} />*/}

				<section className={['signupMainRight', 'signupMainFc'].join(' ')}>
					<div className={'SMRContainer'} >

						<header>
							<h1> Get started </h1>
							<p> Already have an account? <button className={'headerBtn'} type='button' >
							 <Link to='/login'> Log in </Link>
							 </button> </p>
						</header>
						<div className={'altSignups'} >
							{/*<AltGoogle />
							<AltFacebook />*/}
						</div>
						<div className={'signupForm'}>
							{/*<div className={'borderDivider'}>
								<span> Or </span>
							</div>*/}
							<Form />
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}

export default SignUp