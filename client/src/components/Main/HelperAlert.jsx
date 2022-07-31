import React from 'react'
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar'

function HelperAlert ({
	open = false, 
	message = '',
	autoHideDuration = null,
	onClose = () => {},
	direction = 'up', 
	classNames = [], 
	severity = 'info', 
}) {

	return (
	 <Snackbar 
	 		open={open}
	 		anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
    	className={classNames.join(' ')}
			onClose={onClose}
			autoHideDuration={autoHideDuration}
		>
		  <MuiAlert variant='filled' elevation={6} onClose={onClose} severity={severity}>
		    {message}
		  </MuiAlert>
		</Snackbar>
	)
}

export default HelperAlert
// HelperAlert.prop