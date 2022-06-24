import React from 'react'

export const useWindowHeight = () => {
	const [height, setHeight] = React.useState(`${window.innerHeight}px`)
	window.addEventListener('resize', () => {
		setHeight(`${window.innerHeight}px`)
	})
	return height
}


