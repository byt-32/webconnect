import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

import { Button, Typography, Fade , Slide } from '@material-ui/core';

import image1 from '../../public/images/undraw_connected_re_lmq2.svg'
import image2 from '../../public/images/undraw_online_re_x00h\ (1).svg'
import image3 from '../../public/images/undraw_social_share_re_qb4v.svg'

import styles from  '../stylesheet/transition.css'

const useStyles = makeStyles({
	banner: {
		width: '40%',
		// paddingTop: '2rem',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		position: 'relative',
		['@media (max-width: 924px)']: {
			display: 'none'
		},
	},
	eachSlide: {
		position: 'absolute',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	image: {
		'& img': {
			width: '100%'
		},

		marginBottom: '1.5rem'
	}

})

const ImageBanner = ({ imgUrls }) => {
	const classes = useStyles()
	const {useState, useEffect} = React
	const urls = [
		{url: image2, text: 'Online'},
		// {url: image1, text: 'Connected'},
		{url: image3, text: 'Share'},
	]

	const [index, setIndex] = useState(0)
	const [slide, setSlide] = useState(urls[index])
	const [timer, setTimer] = useState(null)
	const [className, setName] = useState([])
	// const 

	useEffect(() => {
		

		let interval = setInterval(() => {
			setIndex((prev) => {
				if (prev === urls.length -1) {
					return 0
				} else {
					return prev + 1
				}
			})
			
		}, 3000)

		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		setSlide(urls[index])
	}, [index])

	return (
		<div className={classes.banner}>
			{
				urls.map((item, i) => {
					return (
						<Fade in={item.url === slide.url} key={i} >		
							<div className={[classes.eachSlide, ].join(' ')} style={{}}>
								<div className={classes.image}  > 
									<img src={item.url} />
								</div>
								<p> {item.text} </p>
							</div>
						</Fade>
					)
				})
			}
			
		</div>
	)
}

export default ImageBanner