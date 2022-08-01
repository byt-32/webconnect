import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import CloseIcon from '@material-ui/icons/Close';


const useStyles = makeStyles({
	replyHandel: {
		display: 'flex',
		borderBottom: '1px solid #f1f1f1',
		justifyContent: 'space-between',
		maxHeight: '100px',
		// boxShadow: 'inset -1px -3px 5px 0px #0000000d',
		background: '#fdfdfd',
		width: '100%',
		zIndex: 40,
		borderRadius: '10px 10px 0 0'
	},
	replyProps: {
		display: 'flex',
		flexDirection: 'column',
		padding: 10,
		width: 'inherit',
		borderLeft: '2px solid #d1803e',
		borderRadius: 'inherit',
		'& span:first-child': {
			marginBottom: 2
		},
		'& span:last-of-type': {
			maxHeight: '200px',
			overflowY: 'scroll',
		}
	},
})

function ReplyHandle ({open, sender, message, closeReplyHandle, handleChatHighlight}) {
	const {username, id} = JSON.parse(localStorage.getItem('details'))
	const classes = useStyles()
	return (
		<Slide in={open} direction='up'>
      	<div className={classes.replyHandel}
      	 >
    			{open && 
	      		<><div className={classes.replyProps}
	      			onClick={handleChatHighlight}
	      		>
	      			<span style={{color: '#ad39ad', fontWeight: 'bold'}}>
	      				{sender === username ? 'You' : sender} 
	      			</span>
	      			<span> {message} </span>
	      		</div>
	      		<div >
	      			<CloseIcon onClick={closeReplyHandle} style={{fontSize: '1.2rem', color: '#c55044', margin: 7,}} />
	      		</div></>
	     	 }
      	</div>
    	</Slide>
	)
}

export default ReplyHandle