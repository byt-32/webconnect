import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase'

const useStyles = makeStyles({
	searchbar: {
		width: '100%',
		marginLeft: 20,
		alignSelf: 'stretch',
		'& .MuiInputBase-input': {
			color: '#0d2c66'
		},
		'& .MuiInputAdornment-positionStart': {
			'& p': {
				color: '#63718d'
			}
		}	

	},

})


const SearchBar = ({input, onChange}) => {
	const classes = useStyles()
	return (
		<InputBase
			className={classes.searchbar}
      placeholder='user'
      type="text"
      value={input}
      onChange={({target}) => {
      	onChange(target.value)
      }}
      startAdornment={
				<InputAdornment position="start" style={{height: '100%'}}>
					@
				</InputAdornment>
			}
    />
	)
}

export default SearchBar