import { myFetch } from "../Utils/apiUtils.js";

/**
 * BusPlan
 */
export const BusPlan = async () => {
	// Get the busplan element
	const endpoint = "https://xmlopen.rejseplanen.dk/bin/rest.exe/multiDepartureBoard?id1=851400602&id2=851973402&rttime&format=json&useBus=1"
	const data = await myFetch(endpoint)

	// Create the busplan element
	let container = document.querySelector('#busplan')
	// Clear the busplan element
	container.innerHTML = ''

	// Create a new h2 element
	const h2 = document.createElement('h2')
	h2.innerText = 'Busplan'
	container.append(h2)

	// Create a new ul element
	const ul = document.createElement('ul')
	const li_line = document.createElement('li')
	li_line.innerText = 'Linje'
	const li_dir = document.createElement('li')
	li_dir.innerText = 'Retning'
	const li_time = document.createElement('li')
	li_time.innerText = 'Tid'
	ul.append(li_line, li_dir, li_time)
	container.append(ul)

	if(data.MultiDepartureBoard.Departure.length) {
		const sliced_data = data.MultiDepartureBoard.Departure.splice(0,5)

		sliced_data.map((item, key) => {
			const ul = document.createElement('ul')
			const li_line = document.createElement('li')
			const li_dir = document.createElement('li')
			const li_time = document.createElement('li')

			li_line.innerText = item.line
			li_dir.innerText = item.direction
			li_time.innerText = calcRemaingTime(`${item.date} ${item.time}`)

			ul.append(li_line, li_dir, li_time)
			container.append(ul)
		})
	}
	setTimeout(BusPlan, 3600); // Call the BusPlan function again in 1 minute

}

/**
 * Calculate remaining time
 * @param {*} departure_datetime 
 * @returns string
 */
function calcRemaingTime(departure_datetime) {
	//console.log(departure_datetime);

	// Hent nutid i sekunder
	const curStamp = new Date().getTime()

	// Splitter dato streng op i et array dd-mm-yy-hh-mm
	const depParts = departure_datetime.split(/[.: ]/)

	const depYear = new Date().getFullYear()
	const depMonth = parseInt(depParts[1],10)-1
	const depDay = parseInt(depParts[0],10)
	const depHours = parseInt(depParts[3],10)
	const depMinutes = parseInt(depParts[4],10)

	const depStamp = new Date(
		depYear,
		depMonth,
		depDay,
		depHours,
		depMinutes
	).getTime()

	// Beregner forskel i sekunder fra nutid
	const diff_seconds = Math.abs(Math.floor((depStamp - curStamp) / 1000))
	const hours = Math.floor(diff_seconds / 3600)
	const minutes = Math.floor(diff_seconds / 60)
	return hours ? `${hours} t ${minutes} m` : `${minutes} m`
}