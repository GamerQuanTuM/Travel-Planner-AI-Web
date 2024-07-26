import Image from 'next/image';
import Link from 'next/link';

import Header from '@/components/Header';
import capitalizeFirstLetter from '@/lib/capitalizeFirstLetter';
import { DailyPlan, FlightOption, Hotel, PlacesToVisit, Trip as TripType } from '@/typings/gemini';
import { timeDifference } from '@/lib/timeDifference';
import Airplane from "@/assets/plane.jpeg"
import DEFAULT_IMAGE from "@/assets/placeholder.jpeg"
import { prismadb } from '@/utils/prismadb';

const Trip = async ({ params }: { params: { id: string } }) => {
    // const default_Image = process.env.NEXT_PUBLIC_DEFAULT_IMAGE_URL as string
    const default_Image = DEFAULT_IMAGE

    const id = params.id

    const travelDetails = await prismadb.itinerary.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            trip: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            cover: true,
            destination: true,
            budgetType: true,
            duration: true,
            travelOrigin: true,
            travelType: true
        }
    });

    if (!travelDetails || typeof travelDetails.trip !== 'object') {
        return <div>Error loading trip details</div>
    }

    const trip = travelDetails.trip as unknown as TripType;

    return (
        <div className='w-screen h-screen overflow-x-hidden'>
            <Header />

            <div className='w-[75%] mx-auto my-12 '>
                <div>
                    <Image src={travelDetails?.cover as string} alt="" width={1500} height={1500} className='w-full h-80 object-cover rounded-md' />
                </div>

                <h1 className='mt-5 font-extrabold text-2xl'>
                    {travelDetails?.destination}
                </h1>

                <div className='flex justify-between'>
                    <div className='mt-5 flex gap-3 items-center'>
                        <div className='bg-gray-200 rounded-2xl text-slate-700 text-center px-3 py-2 w-auto'>📅 {travelDetails?.duration} Days</div>
                        <div className='bg-gray-200 rounded-2xl text-slate-700 text-center px-3 py-2 w-auto'>💰 {capitalizeFirstLetter(travelDetails?.budgetType as string)} Budget</div>
                        <div className='bg-gray-200 rounded-2xl text-slate-700 text-center px-3 py-2 w-auto'>🥂 Traveler: {capitalizeFirstLetter(travelDetails?.travelType as string)}</div>
                    </div>
                </div>

                <h1 className='mt-12 font-bold text-xl'>
                    Airplane Recommendation
                </h1>

                <div className='grid grid-cols-2 gap-5 mt-5'>
                    {trip?.flight?.flightOptions.map((flight: FlightOption, i: number) => (
                        <Link target='__blank' href={`${flight?.bookingUrl}`} key={i} className='border-[1px] border-gray-200 px-3 py-2 rounded-md enlarge flex gap-5'>
                            <Image src={Airplane} alt='airplane' className='w-auto h-40 rounded-md object-contain bg-amber-200' />
                            <div className="flex flex-col gap-2 justify-center">
                                <h1 className='text-lg font-semibold'>{flight?.airline}</h1>
                                <h2 className='text-base font-normal'>🛫 {flight?.departureAirport}</h2>
                                <h2 className='text-base font-normal'>🛬 {flight?.arrivalAirport}</h2>
                                <h2 className='text-base font-normal'>💰 ${flight?.price}</h2>
                            </div>
                        </Link>
                    ))}
                </div>

                <h1 className='mt-12 font-bold text-xl'>
                    Hotel Recommendation
                </h1>

                <div className='mt-5 grid grid-cols-3 gap-6'>
                    {trip?.hotels.map((hotel: Hotel, i: number) => (
                        <Link target='__blank' href={`https://www.google.com/maps/search/?api=1&query=${hotel?.hotelName}`} key={i} className='group rounded-md enlarge'>
                            <Image src={hotel?.hotelImageUrl ?? default_Image} alt="Hotel" width={500} height={500} className='object-cover w-full h-60' />
                            <div className='py-3 flex flex-col justify-center gap-3 border-t-0 border-gray-200 border-[0.5px] px-2 rounded-b-md'>
                                <h1 className='text-lg font-semibold'>{hotel?.hotelName}</h1>
                                <h1 className='text-base font-medium'>📍 {hotel?.hotelAddress}</h1>
                                <h1 className='text-base font-medium'>💰 ${hotel?.price} per night</h1>
                                <h1 className='text-base font-medium'>⭐ {hotel?.rating} stars</h1>
                            </div>
                        </Link>
                    ))}
                </div>

                <h1 className='mt-12 font-bold text-xl'>
                    Places to Visit
                </h1>

                <div className='mt-5'>
                    {trip?.dailyPlan.map((plan: DailyPlan, i: number) => (
                        <div key={i} className=''>
                            <h1 className='text-xl font-semibold'>Day {plan?.day}</h1>
                            <div className='my-3 grid grid-cols-2 gap-x-7 gap-y-3'>
                                {plan.placesToVisit.map((place: PlacesToVisit, j: number) => {
                                    const [startTime, endTime] = place?.timeToSpend?.split(' - ');
                                    const difference = timeDifference(startTime, endTime);
                                    return (
                                        <div key={j}>
                                            <h1 className='text-red-500 text-base font-medium my-2'>{place.timeToSpend}</h1>
                                            <Link target='__blank' href={`https://www.google.com/maps/search/?api=1&query=${place?.placeName}`} className='flex gap-3 items-center border-[1px] border-gray-200 px-3 py-2 group rounded-md enlarge min-h-48'>
                                                <Image src={place?.placesImageUrl as string || default_Image} alt='place' width={500} height={500} className='w-40 h-40 object-cover rounded-md' />
                                                <div className='flex flex-col gap-4 justify-between'>
                                                    <h1 className='text-lg font-semibold'>{place?.placeName}</h1>
                                                    <h2 className='text-sm font-medium text-gray-500'>{place?.description}</h2>
                                                    <h2 className='text-sm font-medium'>🕙 {difference}</h2>
                                                    <h2 className='text-sm font-medium'>🎟️ {place?.price != "Free" ? `${place?.price}` : `${place?.price}`}</h2>
                                                </div>
                                            </Link>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default Trip

