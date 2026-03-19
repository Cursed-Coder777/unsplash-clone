
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const Home = async () => {

  redirect('/home')
  return(
    <div className='flex justify-center items-center h-screen'>
   <Link className='bg-blue-400 text-white p-4 rounded-lg' href="/home">
      Go to Home
    </Link>
  </div>
  )
}

export default Home