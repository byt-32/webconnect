import React from 'react'
// import '../../'eet'/main.css'
import Form from './Form'
import ImageBanner from '../ImageBanner'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography  } from '@material-ui/core'

const imgUrls = [
	{
		url: 'undraw_personal_information_re_vw8a.svg',
		text: ''
	}
]

const useStyles = makeStyles({
	signin: {
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

const Login = () => {
	const classes = useStyles()
	return (
		<div className={[classes.signin].join(' ')} >
			<div className={classes.banner}>

			</div>

			<div className={classes.formPage}>
				<header>
					<Typography variant='body1'> Don't have an account ? </Typography>
					<Link to='/signup'> <Button> REGISTER </Button> </Link>
				</header>

				<div className={classes.pageBody}>
					<header> 
						<Typography component='h1'> Hello  ! Welcome back. </Typography>
						<Typography variant='body1'> Log in with the data you entered <br /> during your registration. </Typography>
					</header>
					<div className={classes.form}>
						<Form />
					</div>
				</div>
			</div>
		</div>
	)
}

export default Login