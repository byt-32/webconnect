import React from 'react'

export const useWindowHeight = () => {
	const [height, setHeight] = React.useState(`${window.innerHeight}`)
	window.addEventListener('resize', () => {
		setHeight(`${window.innerHeight}`)
	})
	return height
}

export function useAssert(obj) {
	try {
		if (typeof obj === 'boolean') return obj
		if (typeof obj === null || typeof obj === 'undefined') return false
		if (Array.isArray(obj)) {
			if ( obj.length > 0) {
				return true
			} else {
				return false
			}
		}
		if (Object.keys(obj).length > 0) return true
	} catch (err) {
		return err
	}
	return false
}