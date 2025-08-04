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
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute';
import axios from 'axios';
import { showToast } from '@/lib/showToast';


function Register() {
  const [loading, setLoading] = useState(false);
  const [isTypePassword, setIsTypePassword] = useState(true);
  const formSchema = zSchema.pick({
    name: true, email: true, password: true
  }).extend({
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
  })

  const handleRegisterSubmit = async (values) => {
    try {
      setLoading(true);
      const { data: registerResponse } = await axios.post('/api/auth/register', values);
      if (!registerResponse.success) {
        throw new Error(registerResponse.message);
      }
      form.reset();
      // alert(registerResponse.message);
      showToast('success', registerResponse.message);

    } catch (error) {
      // alert(error.message)
      showToast('error', error.message);

    } finally {
      setLoading(false);
    }
  }
  return (
    <Card>
      <CardContent>
        <div className='flex justify-center '>
          <Image src={Logo.src} alt="Logo" width={Logo.width} height={Logo.height} className=' max-w-[150px]' />
        </div>
        <div className='text-center'>
          <h1 className=' text-3xl font-bold '>Create Account</h1>
          <p>Create new account by filling out the form below</p>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegisterSubmit)} className="space-y-8">
              <div className='mb-5'>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input type={"text"} placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                <ButtonLoading type="submit" text="Create acoount" className="w-full cursor-pointer" loading={loading} />
                {/* <Button>
                  test
                </Button> */}
              </div>
              <div className='text-center'>
                <div className='flex justify-center items-center gap-2'>
                  <p>Already have an account</p>
                  <Link className='text-primary underline' href={WEBSITE_LOGIN}>Login</Link>
                </div>
              </div>
            </form>
          </Form>
        </div>

      </CardContent>

    </Card>
  )
}
export default Register