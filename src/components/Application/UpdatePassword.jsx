'use client'
import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
import zSchema from '@/lib/zodSchema';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ButtonLoading } from '@/components/Application/buttonLoading';
import { z } from 'zod';
import { Eye } from "lucide-react"
import { EyeOff } from "lucide-react"
import axios from 'axios';
import { showToast } from '@/lib/showToast';
import { useRouter } from 'next/navigation';



function UpdatePassword({ email }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [isTypePassword, setIsTypePassword] = useState(true);
    const formSchema = zSchema.pick({
        email: true, password: true
    }).extend({
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    });
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email,
            password: "",
            confirmPassword: ""
        },
    })

    const handlePasswordUpdate = async (values) => {
        
        try {
            setLoading(true);
            const { data: passwordUpdate } = await axios.put('/api/auth/reset-password/update-password', values);
            if (!passwordUpdate.success) {
                throw new Error(passwordUpdate.message);
            }
            form.reset();
            showToast('success', passwordUpdate.message);
            router.push('/auth/login')
        } catch (error) {
            showToast('error', error.message);

        } finally {
            setLoading(false);
        }
    }
    return (
        <Card>
            <CardContent>
                <div className='text-center'>
                    <h1 className=' text-3xl font-bold '>Update Password</h1>
                    <p>Create new Password by filling out the form below</p>
                </div>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handlePasswordUpdate)} className="space-y-8">
                            <div className='mb-5'>
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className={'relative'}>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type='password' placeholder="Password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-5'>
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem className={'relative'}>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input type={isTypePassword ? 'password' : 'text'} placeholder="confirmPassword" {...field} />
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
                                <ButtonLoading type="submit" text="Update Password" className="w-full cursor-pointer" loading={loading} />
                            </div>
                        </form>
                    </Form>
                </div>

            </CardContent>

        </Card>
    )
}
export default UpdatePassword