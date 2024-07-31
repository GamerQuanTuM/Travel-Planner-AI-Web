import React from 'react'

import CreateTripNavigateButton from './create-trip-naviagte-button'
import Header from '@/components/Header'
import Carousel from '@/components/Carousel'
import Footer from '@/components/Footer'
import Feedback from '@/components/Feedback'
import DownloadSection from '@/components/DownloadSection'

export default async function Home() {
  return (
    <div className='h-screen w-screen overflow-x-hidden'>
      <Header />
      <main className='my-10 w-full'>
        <h1 className='text-6xl font-bold text-[#F56551] text-center'>Discover Your Next Adventure with AI:</h1>
        <h2 className='text-5xl font-bold text-center mt-5'>Personalized Itineraries at Your Fingertips</h2>
        <h5 className='text-lg font-bold text-center text-[#747680] mt-12'>Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget</h5>
        <CreateTripNavigateButton />

        <div className='mt-10 flex justify-center mx-2'>
          <Carousel />
        </div>
        <div className='mt-10'>
          <DownloadSection />
        </div>
        <div className='mt-10'>
          <Feedback />
        </div>
      </main>
      <Footer />
    </div>
  )
}
