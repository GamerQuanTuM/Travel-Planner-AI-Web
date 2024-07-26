import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai"
import { BudgetType, TravelType } from "@prisma/client";


import { prismadb } from "@/utils/prismadb";
import sampleResponse from "@/constants/sampleData.json"
import parseString from "@/lib/parseString";
import getImagesFromGoogle from "@/lib/getPlacesImages";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);


export async function POST(request: NextRequest) {
    const { id, email, budget, person, place, boarding, duration } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const user = await prismadb.user.findFirst({
        where: { email }
    });

    let travelType;
    let budgetType;

    switch (person) {
        case "Me":
            travelType = TravelType.SOLO
            break;
        case "Couple":
            travelType = TravelType.COUPLE
            break;
        case "Family":
            travelType = TravelType.FAMILY
            break;
        case "Friends":
            travelType = TravelType.FRIENDS
            break;
        default:
            console.log("Person Field cant be empty")
    }

    switch (budget) {
        case "Cheap":
            budgetType = BudgetType.CHEAP
            break;
        case "Moderate":
            budgetType = BudgetType.MODERATE
            break;
        case "Luxury":
            budgetType = BudgetType.LUXURY
            break;
        default:
            console.log("Budget Field cant be empty")
    }


    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
    };

    const coverPlace = place.split(",")[0]

    const coverImage = await getImagesFromGoogle(coverPlace)

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

    if (user) {
        const result = await model.generateContent(prompt);

        const newTrip = [
            {
                role: "user",
                parts: [{ text: prompt }],
            },
            {
                role: "model",
                parts: [{ text: result.response.text().replace(/\\n/g, '') }],
            },
        ];

        const parsed = parseString(newTrip[1]?.parts[0]?.text?.split("```json")[1]?.split("```")[0]);

        if (!parsed) {
            return NextResponse.json({ message: "Failed To Parse Trip" }, { status: 400 })
        }

        let parsedNewTrip;

        if (Array.isArray(parsed)) {
            parsedNewTrip = parsed[0]
        } else if (typeof parsed === "object") {
            parsedNewTrip = parsed
        }

        try {
            const hotelsWithImages = await Promise.all(parsedNewTrip?.hotels?.map(async (hotel: any) => {
                try {
                    hotel.hotelImageUrl = await getImagesFromGoogle(hotel?.hotelName) || hotel.hotelImageUrl;
                } catch (error) {
                    console.error(`Failed to fetch image for hotel ${hotel?.hotelName}:`, error);
                }
                try {
                    hotel.placesNearby = await Promise.all(hotel?.placesNearby?.map(async (place: any) => {
                        try {
                            place.placeNearbyImageUrl = await getImagesFromGoogle(place?.placeName) || place?.placeNearbyImageUrl;
                        } catch (error) {
                            console.error(`Failed to fetch image for place ${place?.placeName}:`, error);
                        }
                        return place;
                    }));
                } catch (error) {
                    console.error(`Failed to fetch images for places nearby hotel ${hotel?.hotelName}:`, error);
                }
                return hotel;
            }));

            const dailyPlanWithImages = await Promise.all(parsedNewTrip?.dailyPlan?.map(async (day: any) => {
                day.placesToVisit = await Promise.all(day.placesToVisit.map(async (place: any) => {
                    try {
                        place.placesImageUrl = await getImagesFromGoogle(place?.placeName) || place.placesImageUrl;
                    } catch (error) {
                        console.error(`Failed to fetch image for place ${place?.placeName}:`, error);
                    }
                    return place;
                }));
                return day;
            }));



            const updatedParsedNewTrip = {
                ...parsedNewTrip,
                hotels: hotelsWithImages,
                dailyPlan: dailyPlanWithImages,
            }

            if (id) {
                const existingItinerary = await prismadb.itinerary.findFirst({
                    where: { id },
                });

                if (existingItinerary) {
                    const updatedHistory = [
                        ...existingItinerary.history as any[],
                        ...newTrip
                    ];

                    const chatSession = model.startChat({
                        generationConfig,
                        history: updatedHistory as any[],
                    });

                    await chatSession.sendMessage(otherPrompt);


                    const updatedItinerary = await prismadb.itinerary.update({
                        where: { id },
                        data: { history: updatedHistory, trip: updatedParsedNewTrip }
                    });

                    const _history = chatSession.params?.history ?? [];
                    const historyMap = _history.map(item => item.parts.map(part => part.text).join(' ')).join('\n');
                    const updatedHistoryMap = updatedHistory.map(item => item.parts.map((part: any) => part.text).join(' ')).join('\n');

                    // console.log('Chat Session History:', historyMap);
                    // console.log('Updated Trip:', updatedHistoryMap);

                    if (historyMap === updatedHistoryMap) {
                        console.log('The history and updatedHistory are identical.');
                    } else {
                        console.log('The history and updatedHistory differ.');
                    }

                    const { history, ...itineraryWithoutHistory } = updatedItinerary

                    return NextResponse.json({ message: itineraryWithoutHistory }, { status: 200 });
                } else {
                    return NextResponse.json({ message: "Itinerary not found" }, { status: 404 });
                }
            } else {
                const newItinerary = await prismadb.itinerary.create({
                    data: {
                        userId: user.id,
                        history: newTrip,
                        trip: updatedParsedNewTrip,
                        cover: coverImage as string,
                        budgetType: budgetType as BudgetType,
                        travelType: travelType as TravelType,
                        duration: String(duration),
                        destination: place,
                        travelOrigin: boarding,

                    },
                });

                const chatSession = model.startChat({
                    generationConfig,
                    history: newItinerary.history as any,
                });

                await chatSession.sendMessage(prompt);

                const { history, ...itineraryWithoutHistory } = newItinerary

                return NextResponse.json({ message: itineraryWithoutHistory }, { status: 200 });
            }
        } catch (error) {
            console.log(error)
            return NextResponse.json({ message: "Failed to update hotels with images", error }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
}



