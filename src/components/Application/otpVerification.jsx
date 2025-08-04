"use client"

import zSchema from '@/lib/zodSchema'
import React, { useState } from 'react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { ButtonLoading } from '@/components/Application/buttonLoading';
import { showToast } from '@/lib/showToast';



function OtpVerification({ email, onsubmit, loading }) {
  const [isResendingOTP, setIsResendingOTP] = useState(false);

  const formSchema = zSchema.pick({
    otp: true, email: true
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      email: email
    }
  })

  const handleOtpVerfication = async (values) => {
    onsubmit(values)

  }

  const resendOTP = async () => {
    try {
      setIsResendingOTP(true);
      const { data: registerResponse } = await axios.post('/api/auth/resend-otp', { email });

      if (!registerResponse.success) {
        throw new Error(registerResponse.message);
      }
      showToast('success', registerResponse.message);

    } catch (error) {

      showToast('error', error.message || 'Login failed');

    } finally {
      setIsResendingOTP(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOtpVerfication)} className="space-y-8">
          <div className='text-center mb-5'>
            <h1 className='text-2xl font-bold mb-2'>Please complete verification</h1>
            <p className='text-md'>We have sent an One-time password(OTP) to ypur registered email address. The OTP is valid for 10 minute only.</p>

          </div>

          <div className='mb-5 mt-5  flex justify-center'>
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">One TIme Password (OTP)</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot className="text-xl size-10" index={0} />
                        <InputOTPSlot className="text-xl size-10" index={1} />
                        <InputOTPSlot className="text-xl size-10" index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot className="text-xl size-10" index={3} />
                        <InputOTPSlot className="text-xl size-10" index={4} />
                        <InputOTPSlot className="text-xl size-10" index={5} />
                      </InputOTPGroup>
                    </InputOTP>

                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='mb-3'>
            <ButtonLoading type="submit" text="Verfiy" className="w-full cursor-pointer" loading={loading} />
            <div className='text-center mt-2'>
              {
                !isResendingOTP ? <button onClick={resendOTP} className='text-blue-500 hover:underline' >
                  Resend OTP
                </button> :
                  <span className='text-gray-500 text-md'>Resending OTP...</span>
              }

            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default OtpVerification