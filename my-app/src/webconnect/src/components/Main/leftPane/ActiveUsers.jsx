import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { setComponents} from '../../../Redux/features/componentSlice'
import Preloader from '../../Preloader'

import UserList from './UserList'
import Header from './Header'

const useStyles = makeStyles({
	backBtn: {
		fontSize: '1.2rem !important',
	},	
	searchbar: {
		width: '100%',
		marginLeft: 20,
		alignSelf: 'stretch',
		'& .MuiInputBase-root': {height: '100%'}

	},
	arrow: {
		textAlign: 'right',
		cursor: 'pointer'
	},
	userslist: {

	}
})

const ActiveUsers = () => {
	const { useEffect } = React
	const classes = useStyles()
	const dispatch = useDispatch()
	const activeUsers = useSelector(state => state.activeUsers.activeUsers)
	const showLoader = useSelector(state => state.activeUsers.showActiveUsersLoader)

	const setComponent = () => {
		dispatch(setComponents({component: 'recentChats', value: true}))
	}
	return (
		<>
			<Header>
				<IconButton onClick={setComponent} >
					<KeyboardBackspaceIcon />
				</IconButton>

				<InputBase
					className={classes.searchbar}
		      placeholder='@user'
		      type="text"
		    />

			</Header>
			<div className={classes.userslist}>
				{
					showLoader ? <Preloader /> : 
					activeUsers.map(user => {
						return (
							<UserList user={user} key={user.username} />
						)
					})
				}
			</div>
		</>
	)
}
export default ActiveUsers