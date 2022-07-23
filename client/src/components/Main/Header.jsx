import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import common from '@material-ui/core/colors/common';

const useStyles = makeStyles((theme) => ({
	root: {
    flexGrow: 1,
    height: '3.7rem',
    background: common.white,
    top: 0,
    opacity: .95,
    backdropFilter: 'blur(5px)',
    boxShadow: '-3px 1px 3px 0px #e5e5e5',
    '& .MuiToolbar-root': {
      padding: 0,
      height: '100%'
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },

}))

const Header = ({children}) => {
	const classes = useStyles()
	return (
		 <AppBar position="sticky" className={classes.root} >
      <Toolbar variant="dense">
        {children}
      </Toolbar>
    </AppBar>
	)
}

export default Header