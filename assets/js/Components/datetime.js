/**
 * Clock component
 */
export const DateTime = () => {
	const container = document.getElementById('datetime'); // Get the clock element
	container.innerHTML = ''; // Clear the clock element

	const now = new Date() // Get the current date and time
	const date = now.getDate() // Get the current date
	const month = now.getMonth() // Get the current date
	const year = now.getYear() // Get the current date
	const hours = now.getHours() // Get the current hour
	const minutes = now.getMinutes() // Get the current minute

	const hoursStr = String(hours).padStart(2, "0") // Add leading zero if needed
	const minutesStr = String(minutes).padStart(2, "0") // Add leading zero if needed

	const dateheader = document.createElement('h4'); // Create a new h2 element
	dateheader.innerHTML = `${date}/${month}/${year}`; // Set the dateheader element to the current date

	const timeheader = document.createElement('h2'); // Create a new h2 element
	timeheader.innerHTML = `${hoursStr}<span id="blink">:</span>${minutesStr}`; // Set the timeheader element to the current time


	container.append(dateheader); // Append the dateheader element to the clock element
	container.append(timeheader); // Append the dateheader element to the clock element

	setTimeout(DateTime, 1000); // Call the Clock function again in 1 second
}