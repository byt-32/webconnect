import React from 'react'

export const useWindowHeight = () => {
	const [height, setHeight] = React.useState(`${window.innerHeight}`)
	window.addEventListener('resize', () => {
		setHeight(`${window.innerHeight}`)
	})
	return height
}


