import { myFetch } from "../Utils/apiUtils.js"
import { dayMonth2dk } from "../Utils/dateUtils.js"

export const ActivityList = async () => {
  // Get the config settings
  const config = await myFetch("./config.json")

  // Get the current date
  let curdate = new Date()
  // Get the current date as a unix timestamp
  let curstamp = Math.round(curdate.getTime() / 1000)
  // Get the next day's midnight as a unix timestamp
  let nextdaystamp = Math.round(curdate.setHours(0, 0, 0, 0) / 1000) + 86400

  // Get the data
  const endpoint =
    "https://iws.itcn.dk/techcollege/schedules?departmentCode=smed"
  const resultdata = await myFetch(endpoint)
  let { value: data } = resultdata

  // Filter the data for unwanted educations via an array from the config
  data = data.filter((elm) =>
    config.array_valid_educations.includes(elm.Education)
  )

  // Get readable subjects and educations from the API
  const friendly_names = await myFetch(
    "https://api.mediehuset.net/infoboard/subjects"
  )
  const { result: arr_friendly } = friendly_names

  // Map the data
  data.map((activity) => {
    // Adjust the timezone to Denmark
    activity.StartDate = activity.StartDate.replace("+01:00", "+00:00")

    // Set the time format to hour:minute on the property item.Time
    activity.Time = new Date(activity.StartDate).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })

    // Replace cryptic names and abbreviations with readable versions
    arr_friendly.map((word) => {
      if (word.name.toUpperCase() === activity.Education.toUpperCase()) {
        activity.Education = word.friendly_name
      }
      if (word.name.toUpperCase() === activity.Subject.toUpperCase()) {
        activity.Subject = word.friendly_name
      }
    })

    // Add the Stamp property with a timestamp (time in seconds)
    activity.Stamp = Math.round(new Date(activity.StartDate).getTime() / 1000)
  })

  // Sort the array by start time and education
  data.sort((a, b) => {
    if (a.StartDate === b.StartDate) {
      return a.Education < b.Education ? -1 : 1
    } else {
      return a.StartDate < b.StartDate ? -1 : 1
    }
  })

  // Set var with table header
  let acc_html = `
			<table>
				<tr>
					<th>Kl.</th>
					<th>Uddannelse</th>
					<th>Hold</th>
					<th>Fag</th>
					<th>Lokale</th>
				</tr>`

  // Create array for current activities
  let activities = []

  //
  activities.push(
    ...data.filter(
      (elm) => elm.Stamp + 3600 >= curstamp && elm.Stamp < nextdaystamp
    )
  )

  // Sætter array til næste dags aktiviteter
  let nextday_activities = []
  // Henter næste dags aktiviter hvis stamp er større end / lig midnat
  nextday_activities.push(...data.filter((elm) => elm.Stamp >= nextdaystamp))

  // Hvis der er nogle næste dags aktiviteter
  if (nextday_activities) {
    // Laver læsevenlig dato format (Eks: Mandag d. 16. maj)
    const nextday_friendly = dayMonth2dk(nextday_activities[0].StartDate)
    // Tilføjer array index med læsevenlig dato til activities
    activities.push({ Day: nextday_friendly })
    // Tilføjer næste dags aktiviteter til activities
    activities.push(...nextday_activities)
  }

  // Begrænser antallet af aktiviteter med tal fra config - henter alle hvis 0
  if (config.max_num_activities) {
    activities = activities.slice(0, config.max_num_activities)
  }

  // Mapper activities med table row functions
  activities.map((item) => {
    // Ternary value betinget af om Day property findes på item object
    acc_html += item.Day ? createDayRow(item) : createRow(item)
  })

  // Afslutter html table
  acc_html += `</table>`

  const container = document.getElementById("eventWrapper") // Get the activities element
  container.innerHTML = acc_html // Set the innerHTML of the activities element
}

/**
 * Create the activities element row
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
 * Create the activities element day row
 * @param {Object} item - Object with date and day name
 * @returns HTML string
 */
function createDayRow({ Day }) {
  return `
	<tr>
		<td colspan="5">${Day}</td>
	</tr>`
}
