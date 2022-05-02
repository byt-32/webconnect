import React from 'react'
import styles from '../stylesheet/main.module.css'

const ImageBanner = ({ imgUrls }) => {
	return (
		<section className={[styles.signupMainLeft, styles.signupMainFc].join(' ')} >
			<div className={styles.SMRContainer}>
				<div className={styles.imgBox}>
					<div className={styles.imgContainer}>
						{imgUrls.map((item, idx) => {
							return <div key={idx}>
								<img src={`/images/${item.url}`} alt={item.text} width='100px' height='100px' />
								<p> {item.text} </p>
							</div>
						})}
					</div>	
					<div className={styles.slideShowDots}>
						{imgUrls.map((_, idx) => {
							return <div key={idx} className={[styles.dot].join(' ')}>

							</div>
						})}
					</div>
				</div>
			</div>
		</section>
	)
}

export default ImageBanner