"use client"

import React, { useRef } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const Register = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const email = formData.get("email");
        const password = formData.get("password");
        const name = formData.get("name");
        console.log(email, name, password);
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
            <CardContent className="space-y-2">
                <form id='register' ref={formRef} onSubmit={handleSubmit}>
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
            <CardFooter>
                <Button onClick={handleButtonClick} id='register'>Save password</Button>
            </CardFooter>
        </Card>
    )
}

export default Register