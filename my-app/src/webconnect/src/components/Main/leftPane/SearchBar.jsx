import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
	handleSearch,
} from '../../../Redux/globalPropsSlice'

import { TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	searchbar: {
		width: '100%',
		marginLeft: 20,
		alignSelf: 'stretch',
		'& .MuiInputBase-root': {height: '100%'}

	},
})


const SearchBar = () => {
	const classes = useStyles()
	const dispatch = useDispatch()
	return ( 
		<TextField
			className={classes.searchbar}
      placeholder='Search here'
      type="text"
    />
	)
}

export default SearchBar