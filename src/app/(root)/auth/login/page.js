'use client'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import React, { useState } from 'react'
import Logo from '../../../../../public/assets/images/logo-black.png';
import zSchema from '@/lib/zodSchema';
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ButtonLoading } from '@/components/Application/buttonLoading';
import { z } from 'zod';
import { Eye } from "lucide-react"
import { EyeOff } from "lucide-react"
import Link from 'next/link';
import { WEBSITE_REGISTER } from '@/routes/WebsiteRoute';
import axios from 'axios';
import { showToast } from '@/lib/showToast';
import OtpVerification from '@/components/Application/otpVerification';


function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [isTypePassword, setIsTypePassword] = useState(true);
    const [otpEmail, setOtpEmail] = useState();
    const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);

    const formSchema = zSchema.pick({
        email: true
    }).extend({
        password: z.string().min(6, { message: 'Password is required' })
    });
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const handleLoginSubmit = async (values) => {
        try {
            setLoading(true);
            const { data: loginResponse } = await axios.post('/api/auth/login', values);


            if (!loginResponse.success) {
                throw new Error(loginResponse.message);
            }
            setOtpEmail(values.email);
            form.reset();
            showToast('success', loginResponse.message);


        } catch (error) {

            showToast('error', error.message || 'Login failed');

        } finally {
            setLoading(false);
        }
    }
    // OTP verification component
    const handleOtpVerification = async (values) => {
        try {
            setOtpVerificationLoading(true);
            const { data: otpResponse } = await axios.post('/api/auth/verify-otp', values);

            if (!otpResponse.success) {
                throw new Error(otpResponse.message);
            }
            setOtpEmail('');
            showToast('success', otpResponse.message);

        } catch (error) {

            showToast('error', error.message || 'Login failed');

        } finally {
            setOtpVerificationLoading(false);
        }
    }

    return (
        <Card className="w-[400px]">
            <CardContent>
                <div className='flex justify-center '>
                    <Image src={Logo.src} alt="Logo" width={Logo.width} height={Logo.height} className=' max-w-[150px]' />
                </div>

                {otpEmail ? <>
                    <OtpVerification email={otpEmail} onsubmit={handleOtpVerification} loading={otpVerificationLoading} />
                </> : <>
                    <div className='text-center'>
                        <h1 className=' text-3xl font-bold '>Login Into Account</h1>
                        <p>Login into your account by filling out the form below</p>
                    </div>
                    <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleLoginSubmit)} className="space-y-8">
                                <div className='mb-5'>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type={"email"} placeholder="Email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className='mb-5'>
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className={'relative'}>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type={isTypePassword ? 'password' : 'text'} placeholder="Password" {...field} />
                                                </FormControl>
                                                <button className='absolute top-1/2 right-2 cursor-pointer' onClick={() => setIsTypePassword(!isTypePassword)} type='button'>
                                                    {isTypePassword ? <Eye size={16} strokeWidth={1} /> : <EyeOff size={16} strokeWidth={1} />}
                                                </button>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='mb-3'>
                                    <ButtonLoading type="submit" text="Login" className="w-full cursor-pointer" loading={loading} />
                                    {/* <Button>
                                           test
                                         </Button> */}
                                </div>
                                <div className='text-center'>
                                    <div className='flex justify-center items-center'>
                                        <p>Don't have account</p>
                                        <Link className='text-primary underline' href={WEBSITE_REGISTER}>Create account</Link>
                                    </div>
                                    <div>
                                        <Link className='text-primary underline' href={''}>forget password ?</Link>

                                    </div>
                                </div>
                            </form>
                        </Form>
                    </div>

                </>}





            </CardContent>

        </Card>
    )
}

export default LoginPage