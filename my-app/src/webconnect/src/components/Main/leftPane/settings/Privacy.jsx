import React from 'react'
import styles from '../../../../stylesheet/main.module.css'
import { useDispatch, useSelector } from 'react-redux'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import IconButton from '@material-ui/core/IconButton';
import { setComponents } from '../../../../Redux/globalPropsSlice'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
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
})

const Privacy = () => {
	const classes = useStyles()
	const userId = useSelector(state => state.globalProps.user.contacts.id)
	const dispatch = useDispatch()
	const setComp = (obj) => {
		dispatch(setComponents(obj))
	}
	return (
		<section className={[styles.privacy, styles.animate__animated, styles.animate__fadeInRight].join(' ')}>
			<AppBar position="static" className={classes.app} >
			  <Toolbar className={classes.toolbar} >
			  	<div className={classes.headerItem} >
				    <IconButton edge="start" color="inherit" aria-label="back" onClick={() => {
				    	setComp({component: 'settings', value: true})
				    }} >
				      <KeyboardBackspaceIcon className={classes.backBtn} />
				    </IconButton>
				    <Typography variant="h6" className={classes.h6} classes={{root: styles.appH6}}>
				      Privacy Settings
				    </Typography>
			    </div>
			  </Toolbar>
			</AppBar>
		</section>
	)
}

export default Privacy