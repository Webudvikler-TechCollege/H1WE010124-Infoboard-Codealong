/**
 * Function to fetch data from an endpoint
 * @param {*} endpoint 
 * @returns object 
 */
export const myFetch = async (endpoint) => {
	try {
		const response = await fetch(endpoint)
		if (response.ok) {
			const data = await response.json()
			return data
		}
	} catch (error) {
		console.error(`Fejl i fetch: ${error}`)
	}
}