import { NextRequest, NextResponse } from "next/server";
import { GenerationConfig, GoogleGenerativeAI } from "@google/generative-ai"
import { BudgetType, TravelType } from "@prisma/client";


import { prismadb } from "@/utils/prismadb";
import parseString from "@/lib/parseString";
import getImagesFromGoogle from "@/lib/getPlacesImages";
import getPrompt from "@/constants/getPrompt";
import { Trip } from "@/typings/gemini";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);


const determineTravelType = (person: string) => {
    switch (person) {
        case "Me":
            return TravelType.SOLO;
        case "Couple":
            return TravelType.COUPLE;
        case "Family":
            return TravelType.FAMILY;
        case "Friends":
            return TravelType.FRIENDS;
        default:
            throw new Error("Person Field can't be empty");
    }
};

const determineBudgetType = (budget: string) => {
    switch (budget) {
        case "Cheap":
            return BudgetType.CHEAP;
        case "Moderate":
            return BudgetType.MODERATE;
        case "Luxury":
            return BudgetType.LUXURY;
        default:
            throw new Error("Budget Field can't be empty");
    }
};

const generateNewTrip = async (prompt: string) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
    return newTrip;
};

const fetchImages = async (parsedNewTrip: Trip) => {
    const hotelsWithImages = await Promise.all(parsedNewTrip?.hotels?.map(async (hotel) => {
        try {
            hotel.hotelImageUrl = await getImagesFromGoogle(hotel?.hotelName) || hotel.hotelImageUrl;
        } catch (error) {
            console.error(`Failed to fetch image for hotel ${hotel?.hotelName}:`);
        }
        try {
            hotel.placesNearby = await Promise.all(hotel?.placesNearby?.map(async (place) => {
                try {
                    place.placeImageUrl = await getImagesFromGoogle(place?.placeName) || place?.placeImageUrl;
                } catch (error) {
                    console.error(`Failed to fetch image for place ${place?.placeName}:`);
                }
                return place;
            }));
        } catch (error) {
            console.error(`Failed to fetch images for places nearby hotel ${hotel?.hotelName}:`);
        }
        return hotel;
    }));

    const dailyPlanWithImages = await Promise.all(parsedNewTrip?.dailyPlan?.map(async (day) => {
        day.placesToVisit = await Promise.all(day.placesToVisit.map(async (place) => {
            try {
                place.placesImageUrl = await getImagesFromGoogle(place?.placeName) || place.placesImageUrl;
            } catch (error) {
                console.error(`Failed to fetch image for place ${place?.placeName}:`);
            }
            return place;
        }));
        return day;
    }));

    return { hotelsWithImages, dailyPlanWithImages }
}

const getChatSessionSendMessage = async (generationConfig: GenerationConfig | undefined, itinerary: any, prompt: string) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chatSession = model.startChat({
        generationConfig,
        history: itinerary as any,
    });

    await chatSession.sendMessage(prompt);
}


export async function POST(request: NextRequest) {
    const { id, email, budget, person, place, boarding, duration } = await request.json();

    const user = await prismadb.user.findFirst({
        where: { email },
        select: {
            itinerary: true,
            id: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            name: true,
        }
    });

    const tripArray = user?.itinerary.length as number
    console.log(tripArray)

    if (tripArray > 3) {
        return NextResponse.json({ message: "You have reached the maximum limit of 3 itineraries." }, { status: 403 })
    }
    const travelType = determineTravelType(person);
    const budgetType = determineBudgetType(budget);

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
    };

    const coverPlace = place.split(",")[0]

    const coverImage = await getImagesFromGoogle(coverPlace)

    const { prompt, otherPrompt } = getPrompt({ place, duration, boarding, person, budget })

    if (user) {
        const newTrip = await generateNewTrip(prompt);
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
            const { dailyPlanWithImages, hotelsWithImages } = await fetchImages(parsedNewTrip)

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

                    getChatSessionSendMessage(generationConfig, updatedHistory, otherPrompt)

                    const updatedItinerary = await prismadb.itinerary.update({
                        where: { id },
                        data: { history: updatedHistory, trip: updatedParsedNewTrip }
                    });

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

                getChatSessionSendMessage(generationConfig, newItinerary.history, prompt)

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



