import { myFetch } from "../Utils/apiUtils.js"
import { dayMonth2dk, timeToLocal } from "../Utils/dateUtils.js"

/**
 * Fetches the events from the API and displays them in the DOM
 */
export const Events = async () => {
  // Get the config settings
  const config = await myFetch("./config.json")

  // Get the current date
  let curDate = new Date()
  // Get the current date as a unix timestamp (divide to seconds)
  let curStamp = Math.round(curDate.getTime() / 1000)
  // Get the next day's midnight as a unix timestamp (divide to seconds)
  let nextDayStamp = Math.round(curDate.setHours(0, 0, 0, 0) / 1000) + 86400

  // Get the data from the API
  const endpoint = "https://iws.itcn.dk/techcollege/schedules?departmentCode=smed"
  const resultData = await myFetch(endpoint)
  // Destrucure the resultdata object to get the value property
  const { value: apiData } = resultData

  // Filter the data for unwanted educations via an array from the config
  let filteredData = apiData.filter((elm) =>
    config.array_valid_educations.includes(elm.Education)
  )

  // Get readable subjects and educations from the API
  const friendlyNames = await myFetch("https://api.mediehuset.net/infoboard/subjects")
  // Destructure the result object to get the result property
  const { result: arrFriendlyWords } = friendlyNames

  // Map and process the data - adjust timezone, set time format, replace cryptic names, add timestamp
  filteredData.map(event => {
    // Adjust the timezone to Denmark
    event.StartDate = event.StartDate.replace("+01:00", "+00:00")

    // Set the time format to hour:minute on the property item.Time
    event.Time = timeToLocal(activity.StartDate)

    // Replace cryptic names and abbreviations with readable versions on the properties item.Education and item.Subject
    arrFriendlyWords.map(word => {
      if(word.name.toUpperCase() === event.Education.toUpperCase()) {
        event.Education = word.friendly_name
      }
      if(word.name.toUpperCase() === event.Subject.toUpperCase()) {
        event.Subject = word.friendly_name
      }
    })

    // Add the Stamp property with a timestamp (divide to seconds)
    event.Stamp = Math.round(new Date(event.StartDate).getTime() / 1000)
  })

  // Sort the array by start time and education
  filteredData.sort((a, b) => {
    if (a.StartDate === b.StartDate) {
      return a.Education < b.Education ? -1 : 1
    } else {
      return a.StartDate < b.StartDate ? -1 : 1
    }
  })

  // Set accummulated var with table header
  let accHtml = `
			<table>
				<tr>
					<th>Kl.</th>
					<th>Uddannelse</th>
					<th>Hold</th>
					<th>Fag</th>
					<th>Lokale</th>
				</tr>`

  // Create array for current events to display
  let arrCurEvents = []

  // Push todays events to arrCurEvents
  arrCurEvents.push(
    ...filteredData.filter(
      (elm) => elm.Stamp + 3600 >= curStamp && elm.Stamp < nextDayStamp
    )
  )

  // Set array for next day's events
  let arrNextDayEvents = []
  // Push elements to arrNextDayEvents if greater than next day at midnight
  arrNextDayEvents.push(...filteredData.filter((elm) => elm.Stamp >= nextDayStamp))

  // If arrNextDayEvents has any events 
  if (arrNextDayEvents) {
    // Set a readabe date string with date utility function dayMonth2dk
    const nextDayString = dayMonth2dk(arrNextDayEvents[0].StartDate)
    // Add next day's events to arrCurEvents
    arrCurEvents.push({ Day: nextDayString })
    // Add arrNextDayEvents to arrCurEvents with a spread operator (...)
    arrCurEvents.push(...arrNextDayEvents)
  }

  // Limits arrCurEvents to max amount number from config object
  if (config.max_num_current_events) {
    arrCurEvents = arrCurEvents.slice(0, config.max_num_current_events)
  }

  // Maps arrCurEvents and adds the html to accHtml
  arrCurEvents.map(event => {
    // Ternary value to check if the property Day exists - if true, create a day row, else create a row
    accHtml += item.Day ? createDayRow(event) : createRow(event)
  })

  // Ends the table
  accHtml += `</table>`

  // Get the html element #eventWrapper
  const container = document.getElementById("eventWrapper") // Get the current_events element
  // Set the innerHTML of the #eventWrapper element
  container.innerHTML = accHtml 
}

/**
 * Create the current_events element row
 * @param {Object} item - Object with activity data
 * @returns HTML string
 */
function createRow({ Time, Education, Team, Subject, Room }) {
  return `
		  <tr>
		  <td>${Time}</td>
		  <td>${Education}</td>
		  <td>${Team}</td>
		  <td>${Subject}</td>
		  <td>${Room}</td>
		 </tr>`
}

/**
 * Create the current_events element day row
 * @param {Object} item - Object with date and day name
 * @returns HTML string
 */
function createDayRow({ Day }) {
  return `
	<tr>
		<td colspan="5">${Day}</td>
	</tr>`
}
