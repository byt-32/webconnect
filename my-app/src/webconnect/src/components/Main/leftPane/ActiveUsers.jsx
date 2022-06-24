import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { makeStyles } from '@material-ui/core/styles';

import UserList from './UserList'
import Header from './Header'
import SearchBar from './SearchBar'

const useStyles = makeStyles({
	backBtn: {
		fontSize: '1.2rem !important',
	},	
	arrow: {
		textAlign: 'right',
		cursor: 'pointer'
	},
	userslist: {

	}
})



const ActiveUsers = () => {
	const classes = useStyles()
	const dispatch = useDispatch()
	const activeUsers = useSelector(state => state.globalProps.activeUsers)

	const thisUser = useSelector(state => state.globalProps.user)
	const registeredUsers = useSelector(state => state.globalProps.registeredUsers)
	const searchTerm = useSelector(state => state.globalProps.searchTerm.activeUsers)

	const colors = useSelector(state => state.globalProps.colors)
	const noMatch = useSelector(state => state.globalProps.noMatch.activeUsers)
	
	return (
		<>
			<Header>
				<IconButton>
					<KeyboardBackspaceIcon />
				</IconButton>

				<SearchBar />
				
			</Header>
			<div className={classes.userslist}>
				{
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