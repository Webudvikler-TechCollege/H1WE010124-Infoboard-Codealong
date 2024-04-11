import { myFetch } from "../Utils/apiUtils.js"

/**
 * BusPlan component
 */
export const BusPlan = async () => {
	// Get the container e1ement
	const container = document.getElementById('busplan')
	// Clear the container
	container.innerHTML = ''
	
	// Get the data from the API
	const endpoint = `https://xmlopen.rejseplanen.dk/bin/rest.exe/multiDepartureBoard?id1=851400602&id2=851973402&rttime&format=json&useBus=1`
	const apiData = await myFetch(endpoint)
	// Slice the data to get only the first 5 departures
	const slicedData = apiData.MultiDepartureBoard?.Departure.slice(0, 5)

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
	if(slicedData.length) {
		slicedData.map(value => {
			
			const ul = document.createElement('ul')
			ul.classList.add('busplan')

			const liLine = document.createElement('li')
			liLine.innerText = value.name

			const liDirection = document.createElement('li')
			liDirection.innerText = value.direction
			
			const liTime = document.createElement('li')
			liTime.innerText = calcRemaingTime(`${value.date} ${value.time}`)
			
			ul.append(liLine, liDirection, liTime)
			container.append(ul)
		})
	}
	setTimeout(BusPlan,3600)
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
	const arrDepTime = departureTime.split(/[.: ]/);
	
	// Create a new date object with the departure time
	const depYear = new Date().getFullYear();
	const depMonth = parseInt(arrDepTime[1],10)-1
	const depDay = parseInt(arrDepTime[0],10)
	const depHours = parseInt(arrDepTime[3],10)
	const depMinutes = parseInt(arrDepTime[4],10)

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