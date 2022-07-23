import React from 'react'
// import '../../'eet'/main.css'
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
		<div className={['signupMain', 'animate__animated', 'animate__fadeIn'].join(' ')}  >
			<div className={'spx1'}>
				{/*<ImageBanner imgUrls={imgUrls} />*/}
				
				<section className={['signupMainRight', 'signupMainFc'].join(' ')}>
					<div className={'SMRContainer'} >

						<header>
							<h1> Welcome back </h1>
							<button type='button' className={'headerBtn'}>
								<Link to='/signup'>Create Account </Link>
							</button>
						</header>
						
						<div className={'Form'}>
							<Form />
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}

export default Login