import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Badge from '@material-ui/core/Badge'
import styles from '../../stylesheet/main.module.css'
import { makeStyles } from '@material-ui/core/styles';

const colors = [
'#64ed94',
 '#6495ed', 
 '#cb64ed',
  '#7364ed',
  '#64a1ed',
  '#64c7ed',
  '#edb664',
  '#eda364',
  '#ed7d64',
  '#ed6471'
]

const useStyles = makeStyles({
	avatar: {
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

const AvatarWithBadge = ({props, style, firstAndLastName}) => {
	const classes = useStyles()
	return (
		<Badge 
			variant='dot'
			className={ classes.online}
			overlap='circular'
			anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
		>
			<Avatar className={[classes.avatar, props.className].join(' ')}
				style={style}
			 > 
			 	{firstAndLastName}
			</Avatar>
		</Badge>
	)
}

const UserAvatar = (props) => {
	const classes = useStyles()
	const background = colors[props.username.split(' ').join('').length -1] || '#ed6471'
	const style = {
		background: background,
		...props.style
	}

	let firstAndLastName = '', 
			namesToArray = props.username.split(' ')

	if (namesToArray.length <= 2) {
		namesToArray.forEach(i => firstAndLastName += i[0]) 
	} else {
		firstAndLastName = 
			namesToArray[0][0] + namesToArray[namesToArray.length - 1][0]
	}
	
	return (
		props.badge ?
			<AvatarWithBadge props={props} style={style} firstAndLastName={firstAndLastName} />
		: <Avatar 
				className={[props.className, classes.avatar].join(' ')} 
				style={style}
				> 
					{firstAndLastName} 
			</Avatar>
	)
}

export default UserAvatar