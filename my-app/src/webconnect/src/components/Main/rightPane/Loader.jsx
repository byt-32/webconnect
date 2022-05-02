import React from 'react'
import { Preloader, Oval } from 'react-preloader-icon'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	loader: {
		height: `${window.innerHeight - 30}px`,
		width: '100%',
		display: 'flex',
		'alignItems': 'center',
		justifyContent: 'center'
	}
})
const Loader = ({customStyle}) => {
	const classes = useStyles()
	return (
		<section className={[classes.loader, customStyle].join(' ')}>
			<Preloader use={Oval} size={25} strokeWidth={7} strokeColor='#000' duration={1800} />
		</section>
	)
}

export default Loader