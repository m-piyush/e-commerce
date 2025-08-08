
import { Button } from '@/components/ui/button'
import React from 'react'
import { cookies } from "next/headers";

function Home() {
  const check=async()=>{
     const cookieStore = await cookies();
     console.log("cookieStore",cookieStore);
     
  }
  check();
  return (
    <>
      <h1>Button</h1>
      <Button>Test</Button>
      {/* <hi>Cloudinary setup mesia model and uploading </hi> */}
    </>
  )
}

export default Home