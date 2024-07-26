"use client"

import React, { useRef } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axiosInstance from '@/lib/axiosInstance'
import { useRouter } from 'next/navigation'

const Login = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter()
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const password = formData.get("password");
        const email = formData.get("email");
        try {
            await axiosInstance.post("/auth/login", {
                email, password
            })
            router.push("/");
        } catch (error) {
            console.log(error)
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
                <CardTitle>Login</CardTitle>
                <CardDescription>
                    Welcome back! Please log in to your account to access your personalized travel plans and continue exploring new destinations.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-2" id='login' onSubmit={handleSubmit} ref={formRef}>
                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" name='email' placeholder="Enter Your Email" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password" name='password' placeholder="Enter Your Password" />
                    </div>
                </form>
            </CardContent>
            <CardFooter className='flex justify-center mx-auto'>
                <Button id='login' onClick={handleButtonClick}>Login</Button>
            </CardFooter>
        </Card>
    )
}

export default Login