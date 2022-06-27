import React from 'react'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { Alert } from '@material-ui/lab';

import { Visibility, VisibilityOff } from '@material-ui/icons'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import LockSharpIcon  from '@material-ui/icons/LockSharp'
import SecurityIcon  from '@material-ui/icons/Security'
import Snackbar from '@material-ui/core/Snackbar'
import RepeatIcon from '@material-ui/icons/Repeat';

import { Preloader, ThreeDots } from 'react-preloader-icon'

import { setComponents } from '../../../../Redux/features/componentSlice'
import { useDispatch, useSelector } from 'react-redux'

import Header from '../Header'
import NetworkProgress from './NetworkProgress'

const useStyles = makeStyles({
	body: {
		margin: '20px 0'
	},
	form: {
		width: '90%',
		margin: '0 auto',
		display: 'flex',
		flexDirection: 'column',
		'& button, span, input': {
			fontFamily: 'helvetica !important',
			fontSize: '.9rem'
		},
		'& .MuiFormControl-root': {
			paddingBottom: 10
		},
		'& .MuiButtonGroup-root': {
			marginTop: 10,
			flexDirection: 'column',
			'& button': {
				marginBottom: 10,
				color: '#fff',
			}
		}
	},
	input: {
		'& .MuiOutlinedInput-root': {
			'& input': {
				padding: '10px',
				fontSize: '.95rem',
			},
			'& .MuiSvgIcon-root': {
				fontSize: '1.2rem'
			}
		}
	},
	
})

const ResetPassword = () => {
	const {id} = JSON.parse(localStorage.getItem('details'))
	const dispatch = useDispatch()
	const classes = useStyles()
	const [showProgress, setProgress] = React.useState(false)
	const [open, setOpen] = React.useState(false)
	const [passwordUpdate, setUpdate] = React.useState(false)

	const [showPassword, handlePV] = React.useState({
		former: false, _new: false, confirm: false
	})

	const [values, setInputs] = React.useState({
		former: '', _new: '', confirm: ''
	})
	const [error, setError] = React.useState({
		former: false, _new: false, confirm: false
	})
	const [help, setHelp] = React.useState({
		former: '', _new: '', confirm: ''
	})
	const handleClose = () => {
		setOpen(false)
	}
	const updatePassword  = async (val) => {
		setUpdate(true)
		fetch(`/user/updatePassword/${id}`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(val)
		}).then(res => res.json())
		.then(res => {
			if (res.type === 'success') {
				setUpdate(false)
				setOpen(true)
				setInputs({...values, former: '', _new: '', confirm: ''})
				dispatch(setComponents({component: 'settings', value: true}))

			}
			// console.log(res)
		})
	}
	const matchPassword = async (val) => {
		setUpdate(true)
		return await fetch(`/user/matchPassword/${id}`, {
			method: 'put',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(val)
		})
		.then(res => res.json())
		.then(res => {
			setUpdate(false)
			if (res.type === 'error') {
				setError({...error, former: true})
				setHelp({...help, former: 'Enter a valid password'})
			} 
			if (res.type === 'success') {
				const {_new, confirm} = values
				if (_new === confirm) {
					if (_new.length <= 4) {
						setError({...error, confirm: true, _new: true})
						setHelp({...help, confirm: 'Password is too short'})
					} else {
						//update 
						updatePassword({value: confirm})
					}
				} else {
					setError({...error, confirm: true, _new: true})
					setHelp({...help, confirm: 'Passwords do not match'})
				}
			}

		})
	}
	const performReset = (e) => {
		e.preventDefault()
		const { former } = values
		if (former !== '') matchPassword({value: former})
	}	
	const setComp = (obj) => {
		dispatch(setComponents(obj))
	}

	const setValue = (input, ele) => {
		setError({...error, former: false, _new: false, confirm: false})
		setHelp({...help, former: '', _new: '', confirm: ''})

		if (ele === 'former') setInputs({...values, former: input})
		if (ele === '_new') setInputs({...values, _new: input})
		if (ele === 'confirm') setInputs({...values, confirm: input})
	}

	const setPasswordVisibility = which => {
		handlePV( {...showPassword, [`${which}`]: !showPassword[`${which}`] } )
	}
 
	return (
		<div className={classes.resetPassword} >
	  	<Header>
				<IconButton onClick={() => setComp({component: 'settings', value: true})}>
					<KeyboardBackspaceIcon />
				</IconButton>
				<Typography > Reset Password </Typography>
				{ passwordUpdate &&
					<NetworkProgress />
				}
			</Header>
			<div className={classes.body}>
				<form onSubmit={performReset} className={classes.form} >
					<TextField 
						variant='outlined'
						onChange={e => setValue(e.target.value, 'former')} 
						className={classes.input}
						value={values.former} 
						placeholder='Former password' type='password'
						required
						error={error.former}
					  type={showPassword.former ? 'text' : 'password'}
						helperText={help.former}
						InputProps={{
							startAdornment: <InputAdornment position='start'>
				    		<SecurityIcon color='secondary' />
				    	</InputAdornment>,
				    	endAdornment: <InputAdornment position='end' >
				    		<IconButton color='secondary' aria-label='Toggle password visibility' 
				    			onClick={() => setPasswordVisibility('former')}>
				    			{showPassword.former ? <Visibility /> : <VisibilityOff />}
				    		</IconButton>
				    	</InputAdornment>
				    }}
					/>
					<TextField variant='outlined' 
						className={classes.input}
						onChange={e => setValue(e.target.value, '_new')} 
						value={values._new} 
						placeholder='New password' type='password'
						required
						error={error._new}
					  type={showPassword._new ? 'text' : 'password'}
						InputProps={{
							startAdornment: <InputAdornment position='start'>
				    		<LockSharpIcon color='secondary' />
				    	</InputAdornment>,
				    	endAdornment: <InputAdornment position='end' >
				    		<IconButton color='secondary' aria-label='Toggle password visibility' 
				    			onClick={() => setPasswordVisibility('_new')}>
				    			{showPassword._new ? <Visibility /> : <VisibilityOff />}
				    		</IconButton>
				    	</InputAdornment>
				    }}
					/>
					<TextField variant='outlined' 
						className={classes.input} 
						onChange={e => setValue(e.target.value, 'confirm')} value={values.confirm} 
						placeholder='Confirm password' type='password'
						required
						error={error.confirm}
						helperText={help.confirm}
					  type={showPassword.confirm ? 'text' : 'password'}
						InputProps={{
							startAdornment: <InputAdornment position='start'>
				    		<RepeatIcon color='secondary' />
				    	</InputAdornment>,
				    	endAdornment: <InputAdornment position='end' >
				    		<IconButton color='secondary' aria-label='Toggle password visibility' 
				    			onClick={() => setPasswordVisibility('confirm')}>
				    			{showPassword.confirm ? <Visibility /> : <VisibilityOff />}
				    		</IconButton>
				    	</InputAdornment>
				    }}
					/>
					<ButtonGroup>
						<Button 
							variant='contained' 
							disabled={passwordUpdate}
							type='submit'
							color='primary'
						> 
							Update password
						</Button>
						<Button 
							onClick={() => {
								setComp({component: 'settings', value: true})
							}}
							color='primary'
							variant='contained' 
							type='button'
							> 
								Cancel
						</Button>
					</ButtonGroup>
				</form>
			</div>
			<Snackbar open={open} className={classes.alert} autoHideDuration={6000} onClose={handleClose}>
			  <Alert onClose={handleClose} severity="success">
			    Password changed successfully
			  </Alert>
			</Snackbar>
		</div>
	)
}

export default ResetPassword