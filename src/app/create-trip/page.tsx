"use client"

import React, { useState } from 'react'
import Header from '@/components/Header'
import Autocomplete from '@/components/placesAutocomplete'
import { Input } from '@/components/ui/input'
import Card from './card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axiosInstance'
import { useSession } from '@/context/authContext'

type Person = "Me" | "Couple" | "Family" | "Friends" | undefined
type Budget = "Cheap" | "Moderate" | "Luxury" | undefined

const CreateTrip = () => {

    const router = useRouter()
    const { session } = useSession()

    const [budget, setBudget] = useState<Budget>(undefined)
    const [person, setPerson] = useState<Person>(undefined)
    const [place, setPlace] = useState<string | undefined>(undefined)
    const [boarding, setBoarding] = useState<string | undefined>(undefined)
    const [error, setError] = useState<string | null>(null)
    const [duration, setDuration] = useState<string>("0")
    const [loading, setLoading] = useState(false)

    const handlePlaceSelected = (place: { formatted_address: string } | undefined) => {
        setPlace(place?.formatted_address)
    };
    const handleBoardingSelected = (place: { formatted_address: string } | undefined) => {
        setBoarding(place?.formatted_address)
    };

    const handleSelectedBudgetCard = (budget: Budget) => {
        setBudget(budget)
    }

    const handleSelectedPersonCard = (person: Person) => {
        setPerson(person)
    }

    const handleGenerateTrip = async () => {
        setError(null)

        if (budget === undefined || person === undefined) {
            setError("Travel Budget Field or Travel Companion Field can't be empty")
            return
        }
        if (!place || place === "" || !boarding || boarding === "") {
            setError("Place field can't be empty")
            return
        }
        if (duration === "0" || !duration) {
            setError("Travel Duration field can't be empty")
            return
        }

        // If no errors, log the trip details
        try {
            setLoading(true)
            const res = await axiosInstance.post("/gemini", {
                email: session?.email,
                budget,
                person,
                place,
                boarding,
                duration: parseInt(duration)
            })
            const trip = res.data
            if (!trip || !trip.message || !trip.message.id) {
                throw new Error('Invalid trip data received from API');
            }
            const id = trip.message.id
            router.push(`/trip/${id}`);
            setLoading(false)
            setError(null)
        } catch (error) {
            setLoading(false)
            setError(error as any)
            console.log(error)
        }
    }


    return (
        <div className='w-screen h-screen overflow-x-hidden'>
            <Header />
            <main className='w-[70%] mx-auto h-40 my-10'>
                <h1 className="text-3xl font-bold">Tell us your travel preferences 🏕️🌴</h1>
                <h2 className="text-xl font-normal text-[#6B7280] mt-5">Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</h2>

                <section className='mt-10 pb-10 space-y-10'>
                    <div className='flex flex-col gap-3'>
                        <label className='text-xl font-medium'>What is destination of choice?</label>
                        <Autocomplete onPlaceSelected={handlePlaceSelected} />
                    </div>
                    <div className='flex flex-col gap-3'>
                        <label className='text-xl font-medium'>What is origin of travel?</label>
                        <Autocomplete onPlaceSelected={handleBoardingSelected} />
                    </div>

                    <div className='flex flex-col gap-3'>
                        <label className='text-xl font-medium'>How many days are you planning your trip?</label>
                        <Input onChange={(e) => setDuration(e.target.value)} placeholder='Example:3' type='number' className='border-[#e5e7eb] border-[1px]' />
                    </div>

                    <div className='flex flex-col gap-3 w-full'>
                        <label className='text-xl font-medium'>What is Your Budget?</label>
                        <div className='flex gap-3 w-full'>
                            <div className='flex gap-3 w-1/3' onClick={() => handleSelectedBudgetCard("Cheap")}>
                                <Card icon='💵' heading='Cheap' subHeading='Stay conscious of costs' isActive={budget === "Cheap"} />
                            </div>
                            <div className='flex gap-3 w-1/3' onClick={() => handleSelectedBudgetCard("Moderate")}>
                                <Card icon='💰' heading='Moderate' subHeading='Keep cost on the average side' isActive={budget === "Moderate"} />
                            </div>
                            <div className='flex gap-3 w-1/3' onClick={() => handleSelectedBudgetCard("Luxury")}>
                                <Card icon='💸' heading='Luxury' subHeading='Dont worry about cost' isActive={budget === "Luxury"} />
                            </div>
                        </div>
                    </div>


                    <div className='flex flex-col gap-3'>
                        <label className='text-xl font-medium'>Who do you plan on traveling with on your next adventure?</label>
                        <div className='grid grid-cols-3 grid-rows-2 gap-3'>
                            <div className='flex gap-3' onClick={() => handleSelectedPersonCard("Me")}>
                                <Card icon='✈️' heading='Just Me' subHeading='A sole traveler in exploration' isActive={person === "Me"} />
                            </div>
                            <div className='flex gap-3' onClick={() => handleSelectedPersonCard("Couple")}>
                                <Card icon='🥂' heading='A Couple' subHeading='Two travelers in tandem' isActive={person === "Couple"} />
                            </div>
                            <div className='flex gap-3' onClick={() => handleSelectedPersonCard("Family")}>
                                <Card icon='🏡' heading='Family' subHeading='A group of fun loving adventure' isActive={person === "Family"} />
                            </div>
                            <div className='flex gap-3' onClick={() => handleSelectedPersonCard("Friends")}>
                                <Card icon='⛵' heading='Friends' subHeading='A bunch of thrill-seekers' isActive={person === "Friends"} />
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-end w-full'>
                        <Button disabled={loading} onClick={handleGenerateTrip} className={`button w-36 ${loading ? 'loading' : ''}`}>
                            {!loading ? <h1>Generate Trip</h1> : <span className='loader'></span>}
                        </Button>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default CreateTrip
