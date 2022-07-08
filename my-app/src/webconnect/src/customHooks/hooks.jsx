import React from 'react'
import shado from 'shado'

export const useWindowHeight = () => {
	const [height, setHeight] = React.useState(`${window.innerHeight}`)
	window.addEventListener('resize', () => {
		setHeight(`${window.innerHeight}`)
	})
	return height
}

function convertTime(argument) {
	
}

export function useDate(timestamp) {
	let newDate = new Date()
	let oldDate = new Date(timestamp)
	let mins = oldDate.toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit'})

	if (type(timestamp) === 'number') {
		if (oldDate.toDateString() === newDate.toDateString()) {
			return `last seen ${mins}`
		} else {
			let dateStr = oldDate.toDateString()
			let idx = (/[0-9](?=[0-9]{3})/).exec(dateStr)['index']
			let day = dateStr.split('').splice(0, idx-1).join('')

			return `last seen ${day}`
		}
	}
}

function type(val) {
	return typeof val
}

export function useAssert(obj) {

	
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