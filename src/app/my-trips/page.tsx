import Image from 'next/image'
import React from 'react'

import { prismadb } from '@/utils/prismadb'
import Header from '@/components/Header'
import capitalizeFirstLetter from '@/lib/capitalizeFirstLetter'
import DEFAULT_IMAGE from "@/assets/placeholder.jpeg"
import { getSession } from '@/lib/dal'

const MyTrips = async () => {
  const session = await getSession()
  const default_Image = DEFAULT_IMAGE
  const allTrips = await prismadb.itinerary.findMany({
    where: {
      userId: session?.id
    }, select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      cover: true,
      destination: true,
      budgetType: true,
      duration: true,
      travelOrigin: true,
    }
  })

  console.log(allTrips);
  return (
    <div className='w-screen h-screen overflow-x-hidden'>
      <Header />
      <div className='w-[75%] mx-auto my-12 '>
        <h1 className='mt-5 font-extrabold text-3xl'>
          My Trips
        </h1>

        <div className='mt-5 grid grid-cols-3 gap-5 px-3 py-2'>
          {allTrips?.map((trip, i: number) => (
            <a
              href={`/trip/${trip?.id}`}
              target='__blank' key={i} className='group enlarge flex flex-col gap-3'>
              <Image height={500} width={500} src={trip?.cover ?? default_Image} alt='photo' className='w-full h-48 object-cover rounded-t-md' />
              <div className='rounded-b-md px-3 py-2'>
                <h1 className='text-xl font-bold'>{trip?.destination}</h1>
                <p className='text-gray-500 font-medium text-base'>{Number(trip?.duration)} Days trip with {capitalizeFirstLetter(trip?.budgetType)} Budget</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div >
  )
}

export default MyTrips