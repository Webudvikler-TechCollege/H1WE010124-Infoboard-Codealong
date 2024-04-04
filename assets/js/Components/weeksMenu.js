import { myFetch } from "../Utils/apiUtils.js"

/**
 * Function to get the weeks menu
 */
export const WeeksMenu = async () => {
  // Get the div where the menu should be placed
  const container = document.querySelector("#weeksmenu")
  container.innerHTML = "<h2>Kantine Menu</h2>"

  // Get the data from the API
  const endpoint = "https://infoskaerm.techcollege.dk/umbraco/api/content/getcanteenmenu/?type=json"
  const data = await myFetch(endpoint)

  // Create a ul element
  const ul = document.createElement("ul")

  // Get the current weekday
  const weekday = new Date().getDay() - 1

  // Loop through the data and create a li element for each day
  data && data.Days
    ? data.Days.map((item, key) => {
        // Check if the current day is before the weekday
        if (key >= weekday) {
          // Create a li element
          const li = document.createElement("li")
          // Add a class to the li element if it is the current day
          if (weekday === key) {
            li.classList.add("selected")
          }
          // Add the content to the li element
          li.innerHTML = `<span>${item.DayName}:</span>
								<span>${item.Dish}</span>`
          // Append the li element to the ul element
          ul.append(li)
        }
        // Append the ul element to the div element
        container.append(ul)
      })
    : // Create a li element with a message if there is no data
      container.append(
        (document.createElement("li").textContent = `Der er ingen data`)
      )

  //Reloade hver time
  setInterval(() => {
    WeeksMenu()
  }, 3600000)
}
