import sampleResponse from "./sampleData.json"

type PromptType = {
    place: string,
    duration: string,
    boarding: string,
    person: string,
    budget: string
}

const getPrompt = ({ place, duration, boarding, person, budget }: PromptType) => {
    const points = ` Make sure to match the key names exactly as specified: flight, hotels, dailyPlan, flightOptions, airline, flightNumber, departureAirport, arrivalAirport, price, bookingUrl, hotelName, hotelAddress, geoCoordinates, rating, description, placesNearby, placeName, placeDetails, ticketPricing, timeToTravel,
    dailyPlan,placesToVisit,timeToSpend,placeName,description,price. The structure and naming should not deviate from this format. There should be 3 fields: flight,hotels,dailyPlan. Price should always be number in dollars. timeToTravel will always be in "x minutes walk." ticketPricing will be x or "Free".timeToSpend will be in range like 10AM - 12PM.Hotels should be at least 3.placesName should be specified that is available on google maps. Places to Visit will be at least 6.Hotels will be from ${place}. Generate at least 3 flight recommendation`

    let prompt = `
       Generate Travel Plan for Location: ${place}, for ${duration} Day and ${duration} Night from ${boarding} for ${person} with a ${budget} budget with Flight details, Flight Price with Booking URL, Hotel options list with Hotel Name, Hotel Address, Price, Geo Coordinates, Rating, Description, and Places to visit nearby with Place Name, Place Details, Geo Coordinates, Ticket Pricing, time to travel each of the location for 1 Day and 1 Night with each day plan for best time to visit in JSON format.

    Please provide the response in the exact JSON format specified below. Do not change the key names or structure. Ensure that each section matches the example provided:
    ${sampleResponse}
    ${points}
    `;

    let otherPrompt = `Create another set of travel plan with same configurations and structure. Do not change the key names or structure. Ensure that each section matches the example provided:
    ${sampleResponse}
    ${points}
    `

    return { prompt, otherPrompt }
}

export default getPrompt