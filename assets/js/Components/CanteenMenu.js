import { myFetch } from "../Utils/apiUtils.js"

/**
 * Function to fetch the weeks menu and display it
 */
export const CanteenMenu = async () => {
	// Fetch the menu from the endpoint
	const endpoint = "https://infoskaerm.techcollege.dk/umbraco/api/content/getcanteenmenu/?type=json"
	const data = await myFetch(endpoint)

	// Get the container to display the menu
	const container = document.getElementById("menu")
	// Clear the container
	container.innerHTML = ""
	// Get the current day
	const curday = (new Date().getDay()-1)
	// Create a ul element
	const ul = document.createElement("ul")

	// Loop through the days and display the menu
	data && data.Days && data.Days.map((value, key) => {
		if(key >= curday) {
			const li = document.createElement("li")
			li.innerHTML = `<span>${value.DayName}:</span>
							<span>${value.Dish}</span>`
	
			// Add active class to the current day				
			if (key === curday) {
				li.classList.add("active")
			}
			// Append the li to the ul
			ul.appendChild(li)
		}
	})
	// Append the ul to the container
	container.appendChild(ul)

	// Reload menu every hour
	setInterval(() => {
		CanteenMenu()
	},3600000)
}