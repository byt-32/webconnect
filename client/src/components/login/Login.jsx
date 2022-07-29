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
		padding: '2.5rem',
		overflowY: 'scroll',
		display: 'flex',
		justifyContent: 'space-around',
		fontFamily: 'helvetica !important',
		['@media (max-width: 924px)']: {
			justifyContent: 'center'
		},
		['@media (max-width: 445px)']: {
			padding: 0
		},

	},
	formPage: {
		paddingTop: '1rem',
		boxShadow: '0px 0px 5px 3px #00000021',
		width: '417px',
		padding: '1rem 2rem',
		['@media (max-width: 445px)']: {
			width: '95%',
			padding: '1rem',
			marginTop: '1rem'
		},

		'& > header': {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'flex-end',


			['@media (max-width: 445px)']: {
				alignItems: 'flex-end',
				flexDirection: 'column'
			},

			'& > p': {
				marginRight: '1rem'
			},
			'& .MuiButton-root': {
				border: '2px solid #c7a893'
			}
		}
	},
	pageBody: {
		'& > header': {
			margin: '2rem 0',

			'& > h1': {
				fontSize: '1.3rem',
				color: '#bf6423'
			}
		}
	}
})

const Login = () => {
	const classes = useStyles()
	return (
		<div className={[classes.signin].join(' ')} >
			<ImageBanner />

			<div className={classes.formPage}>
				<header>
					<Typography variant='body1'> Don't have an account ? </Typography>
					<Link to='/signup'> <Button> REGISTER </Button> </Link>
				</header>

				<div className={classes.pageBody}>
					<header> 
						<Typography component='h1'> Hello  ! Welcome back. </Typography>
						<Typography variant='body1'> Log in with the data you entered during your registration. </Typography>
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