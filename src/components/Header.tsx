"use client"

import React from 'react'
import Image from 'next/image'

import Logo from "@/assets/travel-ai-extended.png"
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

const Header = ({ show = true }: { show?: boolean }) => {
    const router = useRouter()
    return (
        <header className='h-[12%] border border-b-2 flex justify-between items-center px-12'>
            <button onClick={() => router.push("/")}>
                <Image src={Logo} alt='Logo.png' height={500} width={500} className='object-contain w-40 h-28 cursor-pointer' />
            </button>
            {show && <div>
                <Button variant="default">Sign In</Button>
            </div>}
        </header>
    )
}

export default Header