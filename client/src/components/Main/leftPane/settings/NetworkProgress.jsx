import React from 'react'

import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	progress: {
		position: 'absolute',
		bottom: 0,
		width: '98%',
		height: '3px'
	},
})

const NetworkProgress = () => {
	const classes = useStyles()
	return (
		<LinearProgress color="primary" className={classes.progress} />
	)
}

export default NetworkProgress