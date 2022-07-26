import React from 'react'

export const getWindowHeight = () => {
	const [height, setHeight] = React.useState(`${window.innerHeight}`)
	window.addEventListener('resize', () => {
		setHeight(`${window.innerHeight}`)
	})
	return height
}

export async function handleFetch(url, method, body, callback) {
	if (method.toLowerCase() === 'get') {

		const res = fetch(url)
		return res.json()

	} else {

		fetch(url, {
			method: method,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		})
		.then(res => res.json())
		.then(res => {
			callback(res)
		})
		.catch(err => {
			callback({error: true, msg: err})
		})
	}
}

export function getLastSeen(timestamp) {
	if (isNaN(timestamp)) return 
	let newDate = new Date()
	let oldDate = new Date(timestamp)
	let mins = oldDate.toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit'})
	console.log(oldDate)
	if (typeof timestamp === 'number') {
		if (oldDate.toDateString() === newDate.toDateString()) {
			return mins
		} else {
			let dateStr = oldDate.toDateString()
			let idx = (/[0-9](?=[0-9]{3})/).exec(dateStr)['index']
			let day = dateStr.split('').splice(0, idx-1).join('')

			return day
		}
	}
}

export function assert(obj) {
	/** 
		THIS FUNCTION BASICALLY CHECKS FOR
		A PREDEFINED SET OF JAVASCRIPT DATA TYPES AND RETURNS TRUE OR FALSE
		DATA TYPES EXPECTED: ARRAY, OBJECT LITERAL, STRING, NUMBER, BOOLEAN, NULL & UNDEFINED
	**/
	try {
		
		if (obj === undefined || obj === null) return false
		if (typeof obj === 'number') {
			if (obj !== -1) return true
				else return false
		}
		if (typeof obj === 'boolean') return obj

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