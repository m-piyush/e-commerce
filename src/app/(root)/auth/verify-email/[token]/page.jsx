"use client";

import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import verifiedImg from "../../../../../../public/assets/images/verified.gif";
import verificationFailedImg from "../../../../../../public/assets/images/verification-failed.gif";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";
import { useParams } from "next/navigation";
import Image from "next/image";

function EmailVerification() {
  const params = useParams(); // ✅ get params from hook
  const token = params?.token;

  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const { data: VerificationResponse } = await axios.post('/api/auth/verify-email', { token });
        setIsVerified(VerificationResponse.success);
      } catch (error) {
        setIsVerified(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      verify();
    }
  }, [token]);

  if (isLoading) {
    return <div className="text-center">Verifying...</div>;
  }

  return (
    <Card className="w-[400px] mx-auto">
      <CardContent>
        {!isVerified ? (
          <>
            <div className="flex items-center justify-center">
              <Image src={verifiedImg.src} alt="Verified" width={verifiedImg.width} height={verifiedImg.height} className="h-[100px] w-auto" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl text-green-500 font-bold my-5">Email Verification Success!</h1>
              <Button asChild>
                <Link href={WEBSITE_HOME}>Continue Shopping</Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center">
              <Image src={verificationFailedImg.src} alt="Verification Failed" width={verificationFailedImg.width} height={verificationFailedImg.height}  className="h-[100px] w-auto" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl text-red-500 font-bold my-5">Email Verification Failed!</h1>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default EmailVerification;
