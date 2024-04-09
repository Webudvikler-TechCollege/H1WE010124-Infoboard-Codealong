import { myFetch } from "../Utils/apiUtils.js"

/**
 * BusPlan component
 */
export const BusPlan = async () => {
	const container = document.getElementById('busplan')
	container.innerHTML = ''
	
	const endpoint = `https://xmlopen.rejseplanen.dk/bin/rest.exe/multiDepartureBoard?id1=851400602&id2=851973402&rttime&format=json&useBus=1`
	const api_data = await myFetch(endpoint)
	const sliced_data = api_data.MultiDepartureBoard?.Departure.slice(0, 5)

	const ul = document.createElement('ul')
	const li_name = document.createElement('li')
	li_name.innerText = 'Linje'
	const li_direction = document.createElement('li')
	li_direction.innerText = 'Retning'
	const li_time = document.createElement('li')
	li_time.innerText = 'Tid'
	ul.append(li_name, li_direction, li_time)
	container.append(ul)

	if(sliced_data.length) {
		sliced_data.map((value, index) => {
			
			const ul = document.createElement('ul')
			ul.classList.add('busplan')

			const li_name = document.createElement('li')
			li_name.innerText = value.name

			const li_direction = document.createElement('li')
			li_direction.innerText = value.direction
			
			const li_time = document.createElement('li')
			li_time.innerText = calcRemaingTime(`${value.date} ${value.time}`)
			
			ul.append(li_name, li_direction, li_time)
			container.append(ul)
		})
	}
	setTimeout(BusPlan,3600)
}

const calcRemaingTime = (departure_time) => {
	const curTimeStamp = new Date().getTime();

	const arrDepTime = departure_time.split(/[.: ]/);
	
	const depYear = new Date().getFullYear();
	const depMonth = parseInt(arrDepTime[1],10)-1
	const depDay = parseInt(arrDepTime[0],10)
	const depHours = parseInt(arrDepTime[3],10)
	const depMinutes = parseInt(arrDepTime[4],10)

	const depTimeStamp = new Date(
		depYear,
		depMonth,
		depDay,
		depHours,
		depMinutes
	).getTime();

	const diff_seconds = Math.abs(Math.floor((depTimeStamp - curTimeStamp) / 1000));
	const hours = Math.floor(diff_seconds / 3600);
	const minutes = Math.floor(diff_seconds / 60);
	return hours ? `${hours} t ${minutes} m` : `${minutes} m`
}