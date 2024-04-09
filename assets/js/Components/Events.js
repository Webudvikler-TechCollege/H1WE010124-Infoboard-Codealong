import { myFetch } from "../Utils/apiUtils.js"

export const Events = async () => {
	const config = await myFetch('../../../config.json')

	// Fetch event data from the API
	const endpoint = "https://iws.itcn.dk/techcollege/schedules?departmentCode=smed"
	let { value: events_data } = await myFetch(endpoint)

	const endpoint_friendly = "https://api.mediehuset.net/infoboard/subjects"
	const { result: friendly_data } = await myFetch(endpoint_friendly)

	events_data = events_data.filter(elm => config.array_valid_educations.includes(elm.Education))

	events_data.map(event => {
		event.Time = new Date(event.StartDate).toLocaleTimeString("en-GB", {
			hour: "2-digit",
			minute: "2-digit"
		})

		friendly_data.map(word => {
			if(word.name.toUpperCase() === event.Education.toUpperCase()) {
				event.Education = word.friendly_name
			}
			if(word.name.toUpperCase() === event.Subject.toUpperCase()) {
				event.Subject = word.friendly_name
			}
		})

		event.Stamp = new Date(event.StartDate).getTime()
	})


	events_data.sort((a,b) => {
		if(a.StartDate === b.StartDate) {
			return a.Education < b.Education ? -1 : 1
		} else {
			return a.StartDate < b.StartDate ? -1 : 1
		}
	})


	let curday_events = []
	let nextday_events = []
	const curdate = new Date()
	const curday_stamp = curdate.getTime()
	const nextday_stamp = curdate.setHours(0,0,0,0) + 86400000

	curday_events.push(...events_data.filter(elm => (elm.Stamp + 3600000) >= curday_stamp && (elm.Stamp < nextday_stamp)))
	nextday_events.push(...events_data.filter(elm => (elm.Stamp) >= nextday_stamp))

	if(nextday_events.length) {
		const nextday_date = new Date(nextday_events[0].StartDate)
		curday_events.push({ Day: nextday_date })
		curday_events.push(...nextday_events)
	}

	let acc_html = `
		<table>
			<tr>
				<th>Kl.</th>
				<th>Uddannelse</th>
				<th>Hold</th>
				<th>Fag</th>
				<th>Lokale</th>
			</tr>
	`

	curday_events.map(event => {
		acc_html += event.Day ?
		`
			<tr>
				<td colspan="5">${event.Day}</td>
			</tr>
		`
		:
		`
			<tr>
				<td>${event.Time}</td>
				<td>${event.Education}</td>
				<td>${event.Team}</td>
				<td>${event.Subject}</td>
				<td>${event.Room}</td>
			</tr>
		`
	})
	acc_html += `</table>`

	const container = document.getElementById('events')
	container.innerHTML = acc_html
}