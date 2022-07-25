import React from 'react'
import { useDispatch } from 'react-redux'

import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography  } from '@material-ui/core'

import AltFacebook from './AltFacebook'
import AltGoogle from './AltGoogle'
import Form from './Form'
import ImageBanner from '../ImageBanner'

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
const useStyles = makeStyles({
	signup: {
		padding: '0 3rem',
		// height: '100%',
		overflowY: 'scroll',
		display: 'flex',
		alignItems: 'center',
		fontFamily: 'helvetica !important'
	},
	banner: {
		flex: 1,
		alignItems: 'flex-end'
	},
	formPage: {
		paddingTop: '1rem',
		width: '400px',

		'& > header': {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'flex-end',

			'& > p': {
				marginRight: '1rem'
			}
		}
	},
	pageBody: {
		'& > header': {
			margin: '2rem 0',

			'& > h1': {
				fontSize: '1.3rem'
			}
		}
	}
})
const SignUp = () => {
	const classes = useStyles()
	return (
		<div className={[classes.signup].join(' ')} >
			<div className={classes.banner}>

			</div>

			<div className={classes.formPage}>
				<header>
					<Typography variant='body1'> Already have an account ? </Typography>
					<Link to='/login'> <Button> SIGN IN </Button> </Link>
				</header>

				<div className={classes.pageBody}>
					<header> 
						<Typography component='h1'> Welcome to webconnect </Typography>
						<Typography variant='body1'> Register your account </Typography>
					</header>
					<div className={classes.form}>
						<Form />
					</div>
					{/*<div className={classes.footer}>
						<Typography variant='body1'> Create account with </Typography>
						<AltFacebook />
						<AltGoogle />
					</div>*/}
				</div>
			</div>
		</div>
	)
}

export default SignUp