"use client"

import React, { FC } from 'react'

type Props = {
    icon: string,
    heading: string,
    subHeading: string,
    isActive: boolean
}

const Card: FC<Props> = ({ heading, icon, subHeading, isActive }) => {
    return (
        <div className={`border ${isActive ? 'border-black' : 'border-[1px]'} rounded-lg flex flex-col justify-center gap-1 px-6 w-full max-w-[22rem] h-32 cursor-pointer hover:shadow-md`}>
            <h1 className='text-2xl'>{icon}</h1>
            <h1 className='text-xl font-semibold'>{heading}</h1>
            <h1 className='text-base font-normal text-[#6B72A1]'>{subHeading}</h1>
        </div>
    )
}

export default Card
