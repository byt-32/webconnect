import React from 'react'

export const useWindowHeight = () => {
	const [height, setHeight] = React.useState(`${window.innerHeight}`)
	window.addEventListener('resize', () => {
		setHeight(`${window.innerHeight}`)
	})
	return height
}

export function useAssert(obj) {

	function type(val) {
		return typeof val
	}
	try {
		
		if (type(obj) === 'string') return true
		if (type(obj) === 'number') {
			if (obj > -1) return true
				else return false
		}
		if (type(obj) === 'boolean') return obj
		if (type(obj) === null || typeof obj === 'undefined') return false

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