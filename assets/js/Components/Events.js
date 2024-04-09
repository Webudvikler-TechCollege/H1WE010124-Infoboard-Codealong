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
		console.log(event);
	})


}