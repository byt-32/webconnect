import React from 'react'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import { Visibility, VisibilityOff, LockSharp, AccountCircle } from '@material-ui/icons'
import styles from '../../stylesheet/main.module.css'
import { Preloader, ThreeDots } from 'react-preloader-icon'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert';

const Form = ({login}) => {
	// sessionStorage.setItem('refresh', 'false')
	let navigate = useNavigate()
	const dispatch = useDispatch()
	const [showPassword, changePasswordVisibility] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [input, setInputValues] = React.useState({
  	username: '', password: ''
  })
  const [helperText, setHelperText] = React.useState({
  	username: '', password: ''
  })
  const [error, setErrorState] = React.useState({
  	username: false, password: false
  })
  const [alert, setAlert] = React.useState({
  	open: false, type: '', text: ''
  })
  const [showLoginAlert, setLoginAlert] = React.useState(false)
	const handlePasswordValue = e => {
		setInputValues({...input, password: e.target.value})
		setLoginAlert(false)
	}
	const handlePV = () => {
		changePasswordVisibility(!showPassword)
	}
	const handleUsernameValue = e => {
		setLoginAlert(false)
		const val = e.target.value
		if (/[^a-z0-9_ ]/ig.test(val)) {
			setHelperText({...helperText, username: `Invalid name`})
			setErrorState({...error, username: true})
		} else {
			setInputValues({...input, username: val.trimLeft()})
			setHelperText({...helperText, username: ''})
			setErrorState({...error, username: false})
		}

	}
	const handleClose = () => {
		setLoginAlert(false)
	}
	const submitForm = (e) => {
		e.preventDefault()
		setIsSubmitting(true)
		
		fetch('/user/login', {
			method: 'POST', 
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({username: input.username, password: input.password})
		})
		.then(res => res.json())
		.then(response => {
			if (response.type === 'error') {
				setLoginAlert(true)
				setAlert({...alert, open: true, type: 'error', text: 'Invalid credentials'})

			} else {
				localStorage.setItem('details', JSON.stringify(response))
				document.location.pathname = ''
				setLoginAlert(true)
				setAlert({...alert, open: true, type: 'success', text: 'Log in successful'})
			}
			setIsSubmitting(false)
		})
		.catch(err => {
			console.log('error:' + err)
			setLoginAlert(true)
			setAlert({...alert, open: true, type: 'error', text: 'Connection timeout'})
			setIsSubmitting(false)
		})
		 
	}
	return (
		<form className={styles.Form} onSubmit={submitForm} >
			<fieldset>
				<div className={styles.formField}>
					<label htmlFor='username' className={styles.fieldset_1_label}> Username </label>
					<TextField
						required
						classes={{root: styles.formInput}} 
						type='text' 
						autoComplete='username'
						id='username' 
						variant='outlined' 
						color='primary' 
						error={error.username} 
						helperText={helperText.username}
						value={input.username}
						onChange={handleUsernameValue} 
						InputProps={{
							startAdornment: <InputAdornment position='start'>
								<AccountCircle fontSize='small' color='secondary' />
							</InputAdornment>
					}} />
				</div>
				<div className={styles.formField}>
					<label htmlFor='current-password' className={styles.fieldset_1_label}> Password </label>
					  <TextField classes={{root: styles.formInput}}
							required
							autoComplete='current-password'
					    id="current-password"
					    variant="outlined"
					    onChange={handlePasswordValue}
					    color="primary"
					    type={showPassword ? 'text' : 'password'}
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
			{/*<fieldset>
				<div className={[styles.formField, styles.formMisc].join(' ')}>
					<div>
						<button className={styles.forgot} type='button'> Forgot Password? </button>
					</div>
				</div>
			</fieldset>*/}
			<fieldset>
				<div className={styles.formField}>
					<Button 
					variant='contained' 
					disabled={isSubmitting}
					classes={{root: styles.button}} 
					type='submit'> 
						{isSubmitting && 
							<Preloader use={ThreeDots} size={25} strokeColor='#fff' duration={1000} /> 
						}
						{!isSubmitting && 'Login'}
					</Button>
				</div>
			</fieldset>
			{showLoginAlert && 
				<Snackbar
		    anchorOrigin={{vertical: 'bottom', horizontal: 'center' }}
		    open={alert.open}
		    onClose={handleClose}
		    color='primary'
		    key={'bottom' + 'right'}>  
		  	<Alert severity={alert.type} color={alert.type} variant='filled'>
		  		{ alert.text }
		  	</Alert>
		  </Snackbar>
			}
		</form>
	)
}

export default Form