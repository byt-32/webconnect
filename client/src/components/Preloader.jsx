import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'

const useStyles = makeStyles({
	preloader: {
		display: 'flex'
	},
	avatar: {
		// borderRadius: 100
	}

})
const Preloader = () => {
	const classes = useStyles()
	return (
		<div className={classes.loaderUser} >
			{[1,1].map( (i, idx) => {
				return (
					<List key={idx}>
						<ListItem>
							<ListItemIcon>
								<Skeleton className={classes.avatar} variant='circle' width={50} height={50} />
							</ListItemIcon>
							<ListItemText>
								<Skeleton variant='text' />
							</ListItemText>
						</ListItem>
					</List>
				)
			})}

		</div>
	)
}

export default Preloader