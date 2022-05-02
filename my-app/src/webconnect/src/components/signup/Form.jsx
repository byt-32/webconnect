import React from 'react'
import { TextField, InputAdornment, IconButton, Checkbox, Button } from '@material-ui/core'
import { Visibility, VisibilityOff, LockSharp, AccountCircle, AlternateEmail } from '@material-ui/icons'
import styles from '../../stylesheet/main.module.css'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { Preloader, ThreeDots } from 'react-preloader-icon'
import { afterRegistration } from '../../Redux/globalPropsSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const theme = createTheme({
	palette: {
		primary: {
			main: '#6495ed'
		}, 
		secondary: {
			main: '#344f7e'
		}
	}
})

const Form = () => {
	sessionStorage.setItem('refresh', 'false')
	const dispatch = useDispatch()
	const navigate = useNavigate()
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

  const [formSubmit, setFormsubmit] = React.useState(false)

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
		setFormsubmit(true)
		fetch('/api/form/register', {
			method: 'POST', 
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({username: input.name, email: input.email, password: input.password})
		})
		.then(res => res.json())
		.then(response => {
			console.log(response)
			if (response.nameError) {
				setErrorState({...error, username: true})
				setHelperText({...helperText, username: response.nameError})
				setFormsubmit(false)
			}
			if (response.emailError) {
				setErrorState({...error, email: true})
				setHelperText({...helperText, email: response.emailError})
				setFormsubmit(false)
			}
			if (response.sent) {
				dispatch(afterRegistration(response))
				setFormsubmit(false)
				if (sessionStorage.getItem('refresh') == 'false') {
					document.location.pathname = ''
				}
			}
		})
		.catch(err => {
			console.log('error:' + err)
			setFormsubmit(false)
		})
		 
	}
	return (
		<form className={styles.Form} onSubmit={submitForm} >
			<ThemeProvider theme={theme}>
			<fieldset>
			<div className={styles.formField}>
					<label htmlFor='username' className={styles.fieldset_1_label}> Name </label>
					<TextField
						required
						classes={{root: styles.formInput}} 
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
				<div className={styles.formField}>
					<label htmlFor='email' className={styles.fieldset_1_label}> Email Address </label>
					<TextField
						required
						classes={{root: styles.formInput}} 
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
				<div className={styles.formField}>
					<label htmlFor='new-password' className={styles.fieldset_1_label}> Password </label>
					  <TextField classes={{root: styles.formInput}}
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
				<div className={styles.formField}>
					<Checkbox value='agree' checked={checked} onChange={handleCheckbox} required id='agree' color='primary' classes={{root: styles.checkbox}} />
					<label htmlFor='agree'> I agree to the Terms of Service and Privacy Policy </label>
				</div>
			</fieldset>
			<fieldset>
				<div className={styles.formField}>
					<Button 
					variant='contained' 
					disabled={formSubmit}
					classes={{root: styles.button}} 
					type='submit'> 
						{formSubmit && <Preloader
						 use={ThreeDots}
						 size={25}
						 strokeColor='#fff'
						 duration={1000}
						  />} 
						 {!formSubmit && 'Register' }
					</Button>
				</div>
			</fieldset>
			</ThemeProvider>	
		</form>
	)
}

export default Form