import { myFetch } from '../Utils/apiUtils.js'
import { dayMonth2dk, timeToLocal } from '../Utils/dateUtils.js'

export const EventList = async () => {
	// Fetch the config.json file
	const config = await myFetch('../../../config.json')

	// Fetch the events from the API
	const apiData = await myFetch('https://iws.itcn.dk/techcollege/schedules?departmentCode=smed')
	// Destructure the value from the apiData
	const { value: eventData } = apiData

	// Fetch the friendly words from the API
	const friendlyApiData = await myFetch('https://api.mediehuset.net/infoboard/subjects')
	const { result: friendlyData } = friendlyApiData

	// Filter the data for the valid educations
	const filteredData = eventData.filter(elm => 
		config.array_valid_educations.includes(elm.Education)
	)

	// Map over the filtered data
	filteredData.map(event => {
		// Set a property on the event object with the time format
		event.Time = timeToLocal(event.StartDate)

		// Set a property on the event object with a timestamp
		event.Timestamp = new Date(event.StartDate).getTime()

		// Set a property on the event object with the friendly name if the education or subject exists
		friendlyData.map(word => {
			if(word.name.toUpperCase() === event.Education.toUpperCase()) {
				event.Education = word.friendly_name
			}
			if(word.name.toUpperCase() === event.Subject.toUpperCase()) {
				event.Subject = word.friendly_name
			}
		})
	})

	// Sort the data by date and education
	filteredData.sort((a,b) => {
		if(a.StartDate === b.StartDate) {
			return a.Education < b.Education ? -1 : 1
		} else {
			return a.StartDate < b.StartDate ? -1 : 1
		}
	})

	const curDate = new Date()
	// Get the current day and the next day in timestamp format
	const curDayStamp = curDate.getTime()
	//const nextDayStamp = new Date(curDate.setDate(curDate.getDate() + 1)).setHours(0,0,0,0)
	const nextDayStamp = new Date().setHours(0,0,0,0)+86400000

	// Filter the data for the current day events
	const arrCurDayEvents = filteredData.filter(
		elm => (elm.Timestamp+3600000) >= curDayStamp && elm.Timestamp < nextDayStamp
	)

	// Filter the data for the next day events
	const arrNextDayEvents = filteredData.filter(
		(elm) => elm.Timestamp >= nextDayStamp
	)
	
	// If there are events for the next day, add a header to the array and merge the arrays
	if(arrNextDayEvents.length) {
		// Set the day and month for the next day
		const strNextDay = dayMonth2dk(arrNextDayEvents[0].StartDate)
		// Add a header to the array
		arrCurDayEvents.push({ Day: strNextDay })
		// Merge the arrays with a spread operator
		arrCurDayEvents.push(...arrNextDayEvents)
	}

	// Slice the array if the max_num_events is set in the config
	let arrSlicedEvents = []

	// If the max_num_events is set in the config, slice the array
	if(config.max_num_events) {
		arrSlicedEvents = arrCurDayEvents.slice(0, config.max_num_events)
	}

	// Create html elements for the events
	const div = document.createElement('div')
	div.classList.add('event-list')

	arrSlicedEvents.map(event => {
		if(event.Day) {
			const divDay = document.createElement('div')
			divDay.classList.add('day')
			divDay.innerText = event.Day
			div.append(divDay)

		} else {
			const divTime = document.createElement('div')
			divTime.innerText = event.Time
			const divEducation = document.createElement('div')
			divEducation.innerText = event.Education
			const divSubject = document.createElement('div')
			divSubject.innerText = event.Subject
			const divTeam = document.createElement('div')
			divTeam.innerText = event.Team
			const divRoom = document.createElement('div')
			divRoom.innerText = event.Room
			div.append(divTime, divEducation, divSubject, divTeam, divRoom)
	
		}

	})

	document.getElementById('events').append(div)
}