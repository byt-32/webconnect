import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Badge from '@material-ui/core/Badge'
import styles from '../../stylesheet/main.module.css'
import { makeStyles } from '@material-ui/core/styles';

const UserAvatar = (props) => {
	const {name} = props
	let val = '', split = name.split(' ')
	split.length <= 2 
	? split.forEach(i => val += i[0]) 
	: val = split[0].charAt(0) + split[split.length - 1].charAt(0)
	
	const useStyles = makeStyles({
		avatar: {
			fontSize: '1rem',
			fontWeight: 'bold',
			textTransform: 'uppercase'
		},
		offline: {
			'& .MuiBadge-dot': {
				boxShadow: '0px 0px 0px 2px #fff'
			}
		},
		online: {
			'& .MuiBadge-dot': {
				background: '#8ae76b',
				boxShadow: '0px 0px 0px 2px #fff'
			}
		}
	})
	const classes = useStyles()
	return (
		props.badge === 'true' ?
			<Badge 
				variant='dot'
				className={props.status == 'online' ? classes.online : classes.offline}
				overlap='circular'
				anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
			>
				<Avatar className={[classes.avatar, props.className].join(' ')}
					style={{background: props.color}}
				 > 
				 	{val} 
				</Avatar>
			</Badge>

		: <	Avatar 
				className={[props.className, classes.avatar].join(' ')} 
				style={{background: props.color}}
				> 
					{val} 
			</Avatar>
	)
}

export default UserAvatar