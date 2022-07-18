function retrieveDate(date) {
	const index = (/[0-9](?=[0-9]{3})/).exec(date)['index']
	const year = date.split('').splice(index).join('')
	const day = date.split('').splice(0, index-1).join('')
	const fullDate = date

	return {year: year, day: day, fullDate: fullDate}
}

export default retrieveDate