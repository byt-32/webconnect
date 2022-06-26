import React from 'react'
import styles from '../../../../stylesheet/main.module.css'
import { useSelector, useDispatch } from 'react-redux'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Input from '@material-ui/core/Input';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import UserAvatar from '../../UserAvatar'
import InfoIcon from '@material-ui/icons/Info'
import SecurityIcon from '@material-ui/icons/Security'
import LockIcon from '@material-ui/icons/Lock'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import LocalPhoneIcon from '@material-ui/icons/LocalPhone'
import Switch from '@material-ui/core/Switch';
import PhotoIcon from '@material-ui/icons/Photo'
import CheckIcon from '@material-ui/icons/Check'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import { Preloader, Oval } from 'react-preloader-icon'
// import { setComponents } from '../../../Redux/features/componentSlice'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'

const Settings = () => {
	return (
		<>Hiiai</>
	)
}

export default Settings