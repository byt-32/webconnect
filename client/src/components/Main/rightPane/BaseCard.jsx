import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { getWindowHeight } from '../../../lib/script'
import common from '@material-ui/core/colors/common';

const useStyles = makeStyles({
	card: {
		boxShadow: 'none',
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		width: '100%',
		background: 'transparent',
		flexDirection: 'column',
		'& .MuiCardHeader-root': {
			background: common.white,
    	boxShadow: '-1px 1px 1px 0px #cbcbcb',
			marginLeft: 5,
			height: '3.7rem',
			padding: '0 16px',
			position: 'relative',
			'& .MuiCardHeader-title': {
				fontWeight: 'bold',

				'& .MuiCardHeader-avatar': {
					marginRight: 10
				}
			},
			['@media (max-width: 660px)']: {
				// width: '100%'
				marginLeft: 0,
				padding: '0 16px 0 39px'
			},
		},
		'& .MuiCardHeader-action': {
			alignSelf: 'center',
			marginTop: 0,
			['@media (max-width: 351px)']: {
				marginLeft: 0,
				display: 'none'
			},
		},
		'& .MuiCardContent-root': {
			flex: 1,
			overflowY: 'scroll',
			position: 'relative',
			
		},
		'& .MuiCardActions-root': {
			position: 'relative',
			marginBottom: '1rem',
			paddingTop: '.25rem',
			flexDirection: 'column',
			alignItems: 'stretch',
			// boxShadow: '0px 0px 2px 1px #0000000d'
			'& .MuiInputBase-root': {
				flex: 1,
				background: common.white,
				margin: 0,
				padding: '11px 10px',

				'& textarea': {
					height: '19px'
				}
				// borderRadius: '15px',
				// boxShadow: '1px 2px 4px 0px #00000021'
			},

			['@media (max-width: 660px)']: {
				marginBottom: '.2rem'
			},
		},

		'& .MuiInputBase-inputMultiline': {
			overflowY: 'scroll !important'
		},

	},
})

const BaseCard = ({children}) => {
	const classes = useStyles()
	return (
		<Card 
			className={classes.card}
      style={{
      	height: `${getWindowHeight()}px`
      }}
		>
			{children}
		</Card>
	)
}

export default BaseCard