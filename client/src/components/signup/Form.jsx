import React from 'react'
import { TextField, InputAdornment, IconButton, Checkbox, Button } from '@material-ui/core'
import { Visibility, VisibilityOff, LockSharp, AccountCircle, AlternateEmail } from '@material-ui/icons'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { Preloader, ThreeDots } from 'react-preloader-icon'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	formField: {
		// display: 'flex',
		// flexDirection: 'column',
		marginBottom: '.8rem',

		'& > label': {
			display: 'block',
			marginBottom: '.4rem'
		},
		'& > button': {
			color: '#fff',
			margin: '1rem 0 1.5rem 0'
		},

		'& .MuiFormControl-root': {

			width: '100%',

			'& .MuiOutlinedInput-input': {
				padding: '13px 10px'
			}
		}
			
	}

})


const Form = () => {
	const classes = useStyles()
	// sessionStorage.setItem('refresh', 'false')
  const [input, setInputValues] = React.useState({
  	email: '', password: '', name: ''
  })
  const [checked, setCheckedState] = React.useState(false)

  const [helperText, setHelperText] =React.useState({
  	username: '', password: '', email: ''
  })

  const [error, setErrorState] = React.useState({
  	username: false, password: false, email: false
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)

	const [showPassword, changePasswordVisibility] = React.useState(false)

	const handlePV = () => {
		changePasswordVisibility(!showPassword)
	}
	const handleEmailValue = e => {
		setInputValues({...input, email: e.target.value})
		setHelperText({...helperText, email: ''})
		setErrorState({...error, email: false})
	}
	const handlePasswordValue = e => {
		setInputValues({...input, password: e.target.value})
	}
	const handleNameValue = e => {
		const val = e.target.value

		if (/[^a-z0-9_ ]/ig.test(val)) {
			setHelperText({...helperText, username: `username cannot contain ${val[val.length-1]} `})
			setErrorState({...error, username: true})
		} else {
			setInputValues({...input, name: val.trimLeft()})
			setHelperText({...helperText, username: ''})
			setErrorState({...error, username: false})
		}

	}
	
	const handleCheckbox = () => {
		setCheckedState(!checked)
	}
	const submitForm = (e) => {
		e.preventDefault()
		setIsSubmitting(true)
		fetch('/user/register', {
			method: 'POST', 
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({username: input.name, email: input.email, password: input.password})
		})
		.then(res => res.json())
		.then(response => {
			if (response.nameError) {
				setErrorState({...error, username: true})
				setHelperText({...helperText, username: response.nameError})
				setIsSubmitting(false)
			} else if (response.emailError) {
				setErrorState({...error, email: true})
				setHelperText({...helperText, email: response.emailError})
				setIsSubmitting(false)
			} else {
				localStorage.setItem('details', JSON.stringify(response))
				setIsSubmitting(false)
				document.location.pathname = ''
			}
			
		})
		.catch(err => {
			console.log('error:' + err)
			setIsSubmitting(false)
		})
		 
	}
	return (
		<form className={classes.form} onSubmit={submitForm} >
			<fieldset>
			<div className={classes.formField}>
					<label htmlFor='username' > Name </label>
					<TextField
						required
						classes={{root: 'formInput'}} 
						type='text' 
						id='username' 
						autoComplete='username'
						variant='outlined' 
						color='primary' 
						value={input.name}
						error={error.username} 
						helperText={helperText.username}
						onChange={handleNameValue} 
						InputProps={{
							startAdornment: <InputAdornment position='start'>
								<AccountCircle fontSize='small' color='secondary' />
							</InputAdornment>
					}} />
				</div>
				<div className={classes.formField}>
					<label htmlFor='email'> Email Address </label>
					<TextField
						required
						type='email' 
						id='email' 
						error={error.email} 
						helperText={helperText.email}
						autoComplete='email'
						variant='outlined' 
						color='primary' 
						value={input.email}
						onChange={handleEmailValue} 
						InputProps={{
							startAdornment: <InputAdornment position='start'>
								<AlternateEmail fontSize='small' color='secondary' />
							</InputAdornment>
					}} />
				</div>
				<div className={classes.formField}>
					<label htmlFor='new-password'> Password </label>
					  <TextField
							required
					    id="new-password"
					    variant="outlined"
					    onChange={handlePasswordValue}
					    color="primary"
					    type={showPassword ? 'text' : 'password'}
					    autoComplete='new-password'
					    id='new-password'
					    error={error.password}
					    helperText={helperText.password}
					    value={input.password}
					    InputProps={{
					    	startAdornment: <InputAdornment position='start'>
					    		<LockSharp fontSize='small' color='secondary' />
					    	</InputAdornment>,
					    	endAdornment: <InputAdornment position='end' >
					    		<IconButton color='secondary' aria-label='Toggle password visibility' onClick={() => handlePV()}>
					    			{showPassword ? <Visibility /> : <VisibilityOff />}
					    		</IconButton>
					    	</InputAdornment>
					    }}
					  />
				</div>
			</fieldset>
			<fieldset>
				<div className={classes.formField}>
					<Button 
					variant='contained' 
					disabled={isSubmitting}
					color='primary'
					type='submit'> 
						{isSubmitting && <Preloader
						 use={ThreeDots}
						 size={25}
						 strokeColor='#fff'
						 duration={1000}
						  />} 
						 {!isSubmitting && 'Register' }
					</Button>
				</div>
			</fieldset>
		</form>
	)
}

export default Form