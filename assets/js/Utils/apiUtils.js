export const myFetch = async (endpoint) => {
	let response = ''

	try {
		response = await fetch(endpoint)
		if (response.ok) {
			const data = await response.json()
			return data
		}
	} catch (error) {
		console.error(`Fejl i fetch: ${error}`)
	}
}