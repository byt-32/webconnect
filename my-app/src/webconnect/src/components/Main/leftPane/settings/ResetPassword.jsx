import styles from '../../../../stylesheet/main.module.css'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles } from '@material-ui/core/styles';
import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useDispatch, useSelector } from 'react-redux'
import { setComponents } from '../../../../Redux/globalPropsSlice'
import { Preloader, ThreeDots } from 'react-preloader-icon'
import LockSharpIcon  from '@material-ui/icons/LockSharp'
import SecurityIcon  from '@material-ui/icons/Security'
import Snackbar from '@material-ui/core/Snackbar'
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles({
	input: {
		'& .MuiOutlinedInput-root input': {
			padding: '10px',
			fontSize: '17px'
		}
	},
	app: {
		background: '#fff',
		boxShadow: 'none',
		borderBottom: '1px solid #d1d1d1',
		fontSize: '90%',
		padding: '13px 0'
	},
	toolbar:{
		justifyContent: 'space-between',
		minHeight: 'auto',
		paddingLeft: '15px'
	},
	headerItem: {
		display: 'flex',
		alignItems: 'center',
		marginLeft: '5px'
	},
	h6: {
		fontSize: '17px',
		marginLeft: '10px',
		position: 'relative',
	},
	backBtn: {
		fontSize: '1.2rem !important'
	},
	input: {
		width: '100%',
		'& .MuiInputBase-input': {
			padding: '10px',
			fontSize: '13.5px'
		}
	},
	alert: {
		width: '100%'
	},
	appBody: {
		overflow: 'scroll'
	}
})

const ResetPassword = () => {
	const userId = useSelector(state => state.globalProps.user.contacts.id)
	const dispatch = useDispatch()
	const classes = useStyles()
	const [open, setOpen] = React.useState(false)
	const [passwordUpdate, setUpdate] = React.useState(false)
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
		fetch(`/api/form/updatePassword/${userId}`, {
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
		return await fetch(`/api/form/matchPassword/${userId}`, {
			method: 'post',
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
 const [height, setHeight] = React.useState(`${window.innerHeight - 30}px`)
  window.onresize = () => {
  	setHeight(`${window.innerHeight - 30}px`)
  }
	return (
		<div className={[styles.component, styles.reset, styles.animate__animated, styles.animate__fadeInLeft].join(' ')}>
			<AppBar position="static" className={classes.app} >
			  <Toolbar className={classes.toolbar} >
			  	<div className={classes.headerItem} >
				    <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => {
				    	setComp({component: 'settings', value: true})
				    }} >
				      <KeyboardBackspaceIcon className={classes.backBtn} />
				    </IconButton>
				    <Typography variant="h6" className={classes.h6} classes={{root: styles.appH6}} >
				      Reset Password
				    </Typography>
			    </div>
			  </Toolbar>
			</AppBar>
			<div className={[styles.resetBody, styles.settingsComp, styles.appBody].join(' ')} style={{
				height: height
			}} >
				<form onSubmit={performReset}>
					<div className={styles.inputGroup}>
						<div className={styles.inputField}>
							<TextField variant='outlined' className={classes.input} classes={{root: styles.inputReset}}
							onChange={e => setValue(e.target.value, 'former')} value={values.former} 
							placeholder='Former password' type='password'
							required
							error={error.former}
							helperText={help.former}
							InputProps={{
					    	startAdornment: <InputAdornment classes={{root: styles.passwordIcon}} position='start'>
					    		<SecurityIcon fontSize='small' color='secondary' />
					    	</InputAdornment>
					    }}
							/>
						</div>
						<div className={styles.inputField}>
							<TextField variant='outlined' className={classes.input} classes={{root: styles.inputReset}}
							onChange={e => setValue(e.target.value, '_new')} value={values._new} 
							placeholder='New password' type='password'
							required
							error={error._new}
							InputProps={{
					    	startAdornment: <InputAdornment classes={{root: styles.passwordIcon}} position='start'>
					    		<LockSharpIcon fontSize='small' color='secondary' />
					    	</InputAdornment>
					    }}
							/>
						</div>
						<div className={styles.inputField}>
							<TextField variant='outlined' className={classes.input} classes={{root: styles.inputReset}}
							onChange={e => setValue(e.target.value, 'confirm')} value={values.confirm} 
							placeholder='Confirm password' type='password'
							required
							error={error.confirm}
							helperText={help.confirm}
							InputProps={{
					    	startAdornment: <InputAdornment classes={{root: styles.passwordIcon}} position='start'>
					    		<LockSharpIcon fontSize='small' color='secondary' />
					    	</InputAdornment>
					    }}
							/>
						</div>
					</div>
					<div className={[styles.inputGroup, styles.inputGroupButton].join(' ')}>
						<Button 
						variant='contained' 
						disabled={passwordUpdate}
						classes={{root: [styles.buttonUpdate, styles.resetButton].join(' ')}} 
						type='submit'> 
							{passwordUpdate && <Preloader
							 use={ThreeDots}
							 strokeWidth={10}
							 size={25}
							 strokeColor='#fff'
							 duration={1000}
							  />} 
							 &nbsp; {!passwordUpdate && 'Update Password' }
						</Button>
						<Button 
						onClick={() => {
							setComp({component: 'settings', value: true})
						}}
						variant='contained' 
						classes={{root: [styles.buttonCancel, styles.resetButton].join(' ')}}
						type='button'> 
							 &nbsp;Cancel
						</Button>
					</div>
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