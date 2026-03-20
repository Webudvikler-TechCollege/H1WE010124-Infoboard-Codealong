import { myFetch } from "../Utils/apiUtils.js"
const CACHE_KEY = 'busplan';
const CACHE_TIME = 30 * 60 * 1000; // 30 minutter
const endpoint = `https://www.rejseplanen.dk/api/nearbyDepartureBoard?accessId=5b71ed68-7338-4589-8293-f81f0dc92cf2&originCoordLat=57.048731&originCoordLong=9.968186&format=json`

const getBusPlanApiData = async () => {
	const apiData = await myFetch(endpoint)
	localStorage.setItem(CACHE_KEY, JSON.stringify({
		data: apiData,
		timestamp: CACHE_TIME
	}))
	return apiData
}

/**
 * BusPlan component
 */
export const BusPlan = async () => {
	// Get the container e1ement
	const container = document.getElementById('busplan')

	// Get the data from the API
	let apiData;
	const cached = localStorage.getItem(CACHE_KEY);

	if (cached) {
		const parsed = JSON.parse(cached)

		const isExpired = Date.now() - parsed.timestamp > CACHE_TIME

		if (!isExpired) {
			apiData = cached.data
		} else {
			apiData = await getBusPlanApiData()
		}
	} else {
		apiData = await getBusPlanApiData()
	}

	// Slice the data to get only the first 5 departures	
	const slicedData = apiData.Departure.slice(0, 5)

	// Clear the container
	container.innerHTML = ''

	// Create the unordered list element headers
	const ul = document.createElement('ul')
	const liLine = document.createElement('li')
	liLine.innerText = 'Linje'
	const liDirection = document.createElement('li')
	liDirection.innerText = 'Retning'
	const liTime = document.createElement('li')
	liTime.innerText = 'Tid'
	// Append the list elements to the ul element
	ul.append(liLine, liDirection, liTime)
	container.append(ul)

	// Map the sliced data and create the list elements with data values
	if (slicedData.length) {
		slicedData.map(value => {

			const ul = document.createElement('ul')
			ul.classList.add('busplan')

			const liLine = document.createElement('li')
			liLine.innerText = value.name.split(' ')[1]

			const liDirection = document.createElement('li')
			liDirection.innerText = value.direction

			const liTime = document.createElement('li')
			liTime.innerText = calcRemaingTime(`${value.date} ${value.time}`)

			ul.append(liLine, liDirection, liTime)
			container.append(ul)
		})
	}
	setTimeout(BusPlan, 3600)
}

/**
 * Function to calculate the remaining time from now to departure
 * @param {*} departureTime 
 * @returns 
 */
export const calcRemaingTime = departureTime => {

	// Get the current timestamp
	const curTimeStamp = new Date().getTime();
	// Split the departure time into an array
	const arrDepTime = departureTime.split(/[- :]/);

	// Create a new date object with the departure time
	const depYear = new Date().getFullYear();
	const depMonth = parseInt(arrDepTime[1], 10) - 1
	const depDay = parseInt(arrDepTime[2], 10)
	const depHours = parseInt(arrDepTime[3], 10)
	const depMinutes = parseInt(arrDepTime[4], 10)

	// Get the timestamp of the departure time
	const depTimeStamp = new Date(
		depYear,
		depMonth,
		depDay,
		depHours,
		depMinutes
	).getTime();

	// Calculate the difference in seconds
	const diffSeconds = Math.abs(Math.floor((depTimeStamp - curTimeStamp) / 1000));
	// Calculate the hours and minutes
	const hours = Math.floor(diffSeconds / 3600);
	const minutes = Math.floor(diffSeconds / 60);
	// Return the remaining time in a readable format - hours and minutes
	return hours ? `${hours} t ${minutes} m` : `${minutes} m`
}