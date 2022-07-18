import styles from './stylesheet/main.module.css'
const props = {
	appear: true,
	in: true,
	timeout: 500,
	classNames:	{
		appear: [styles.animate__animated, styles.animate__fadeIn].join(' '),
		exit: [styles.animate__animated, styles.animate__zoomOut].join(' '),
	} ,
	unmountOnExit: true,
	mountOnEnter: true
	
}
export default props