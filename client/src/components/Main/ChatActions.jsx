import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';

const useStyles = makeStyles({
	chatActions: {
		borderRadius: '5px',
		zIndex: 250000,
		display: 'flex',
		flexDirection: 'column',
		background: '#fff !important',
		'& > div': {display: 'flex'},
		'& div:first-child': {

		},
		'& > div:last-of-type': {
			flexDirection: 'column',
			'& > button': {
				padding: '12px 0 12px 15px',
				borderRadius: 0,
				'& .MuiIconButton-label': {
					justifyContent: 'flex-start'
				},
				'& > span > span.MuiTypography-root': {
					padding: '0 25px 0 15px',
					color: '#000'
				}
			}
		}
	},
})

const ChatActions = ({children, open, anchorEl, onClose, anchorOrigin}) => {
	const classes = useStyles()
	return (
		<Popover 
   		open={open}
   		anchorEl={anchorEl} 
			onClose={onClose}
			anchorOrigin={ anchorOrigin }
   	>
			<div className={classes.chatActions}>
				{children}
			</div>
		</Popover>
	)
}

ChatActions.propTypes = {

}

export default ChatActions