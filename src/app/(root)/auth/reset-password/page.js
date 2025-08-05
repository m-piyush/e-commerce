'use client'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import React, { useState } from 'react'
import Logo from '../../../../../public/assets/images/logo-black.png';
import zSchema from '@/lib/zodSchema';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {ButtonLoading} from '@/components/Application/buttonLoading';
import Link from 'next/link';
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute';
import axios from 'axios';
import { showToast } from '@/lib/showToast';
import OtpVerification from '@/components/Application/otpVerification';
import UpdatePassword from '@/components/Application/UpdatePassword';
import { useDispatch } from 'react-redux';



function ResetPassword() {
  const [isOtpVerfied, setIsOtpVerified] = useState(false);
  const [otpEmail, setOtpEmail] = useState();
  const [emailVerificationLoading, setEmailVerificationLoading] = useState(false);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
    const dispatch = useDispatch();

  const formSchema = zSchema.pick({
    email: true
  })
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  // OTP verification component
  const handleOtpVerification = async (values) => {
    try {
     
      setOtpVerificationLoading(true);
      const { data: otpResponse } = await axios.post('/api/auth/reset-password/verify-otp', values);

      if (!otpResponse.success) {
        throw new Error(otpResponse.message);
      }
      showToast('success', otpResponse.message);
      setIsOtpVerified(true)
      dispatch(login(otpResponse.data))
    } catch (error) {

      showToast('error', error.message || 'Login failed');

    } finally {
      setOtpVerificationLoading(false);
    }
  }

  // EMail verification component
  const handleEmailVerification = async (values) => {

    try {
      setEmailVerificationLoading(true);
      const { data: sendOtpResponse } = await axios.post('/api/auth/reset-password/send-otp', values);

      if (!sendOtpResponse.success) {
        throw new Error(sendOtpResponse.message);
      }
      setOtpEmail(values.email);
      showToast('success', sendOtpResponse.message);

    } catch (error) {

      showToast('error', error.message || 'Login failed');

    } finally {
      setOtpVerificationLoading(false);
    }
  }

  return (
    <Card className="w-[400px]">
      <CardContent>

        {!otpEmail ? <>
          <div className='text-center'>
            <h1 className=' text-3xl font-bold '>ResetPassword</h1>
            <p>Enter your email for password</p>
          </div>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEmailVerification)} className="space-y-8">
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

                <div className='mb-3'>
                  <ButtonLoading type="submit" text="Send OTP" className="w-full cursor-pointer" loading={emailVerificationLoading} />
                </div>
                <div className='text-center'>
                  <div>
                    <Link className='text-primary underline' href={WEBSITE_LOGIN}>Back to login</Link>

                  </div>
                </div>
              </form>
            </Form>
          </div>

        </> :
          <>
            {
              !isOtpVerfied ?
                <OtpVerification email={otpEmail} onsubmit={handleOtpVerification} loading={otpVerificationLoading} />
                :
                <UpdatePassword email={otpEmail} />
            }
          </>

        }





      </CardContent>

    </Card>
  )
}

export default ResetPassword