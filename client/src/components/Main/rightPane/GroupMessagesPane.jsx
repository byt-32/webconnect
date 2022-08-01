import React from 'react'

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton'
import InputBase from "@material-ui/core/InputBase";
import Menu from '@material-ui/core/Menu'
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem'
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';

import { getWindowHeight, assert, getLastSeen } from '../../../lib/script'
import { setComponents} from '../../../Redux/features/componentSlice'

import { getWindowHeight } from '../../../lib/script'

import { socket } from '../Main'
import HelperAlert from '../HelperAlert'

const useStyles = makeStyles({


})

const GroupMessagesPane = () => {
	return (
		<Card className={classes.card} 

		>

		</Card>

	)
}

export default GroupMessagesPane