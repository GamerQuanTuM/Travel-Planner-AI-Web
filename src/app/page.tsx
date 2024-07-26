import React from 'react'
import Image from 'next/image'

import CreateTripNavigateButton from './create-trip-naviagte-button'
import Header from '@/components/Header'

export default function Home() {
  return (
    <div className='h-screen w-screen'>
      <Header />
      <main className='my-10 w-full'>
        <h1 className='text-6xl font-bold text-[#F56551] text-center'>Discover Your Next Adventure with AI:</h1>
        <h2 className='text-5xl font-bold text-center mt-5'>Personalized Itineraries at Your Fingertips</h2>
        <h5 className='text-lg font-bold text-center text-[#747680] mt-12'>Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget</h5>
        <CreateTripNavigateButton />

        <div className='mt-28 flex justify-center'>
          <Image src={"https://aitrip.tubeguruji.com/landing.png"} alt='Logo.png' height={500} width={500} className='' />
        </div>
      </main>
    </div>
  )
}
