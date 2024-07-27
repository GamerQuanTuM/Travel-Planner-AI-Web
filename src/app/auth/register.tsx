"use client"

import React, { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axiosInstance from '@/lib/axiosInstance'
import { useToast } from '@/components/ui/use-toast'
import { useSession } from '@/context/authContext'

const Register = () => {
    const { session, refreshSession } = useSession()
    const formRef = useRef<HTMLFormElement>(null);
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");
        const name = formData.get("name");
        setLoading(false)
        try {
            await axiosInstance.post("/auth/register", {
                name, email, password
            })
            await refreshSession();
            setLoading(false)
            if (session) {
                router.push("/");
            }
        } catch (error: any) {
            console.log(error.response.data)
            setError(error.response.data)
            toast({
                title: error.response.data?.message || "Something went wrong"
            })
            setLoading(false)
        }

    }

    const handleButtonClick = () => {
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>
                    Join us today! Create a new account to start planning your perfect trips and discover exciting places tailored to your preferences.
                </CardDescription>
            </CardHeader>
            <CardContent >
                <form className="space-y-2" id='register' ref={formRef} onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" name='email' placeholder="Enter Your Email" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name='name' placeholder="Enter Your Name" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password" name='password' placeholder="Enter Your Password" />
                    </div>
                </form>
            </CardContent>
            <CardFooter className='flex justify-center mx-auto'>
                <Button onClick={handleButtonClick} id='register'>Register</Button>
            </CardFooter>
        </Card>
    )
}

export default Register