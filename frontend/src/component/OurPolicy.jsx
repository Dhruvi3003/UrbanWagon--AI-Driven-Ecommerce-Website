import React from 'react'
import Title from './Title'
import { RiExchangeFundsLine } from "react-icons/ri";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { BiSupport } from "react-icons/bi";

function OurPolicy() {
  return (
    <div className='w-full lg:min-h-[80vh] md:min-h-[100vh] sm:min-h-[100vh] flex flex-col items-center justify-start bg-gradient-to-l from-[#141414] to-[#0c2025] px-2 sm:px-4 pt-[70px] gap-8 sm:gap-12'>
      <div className='w-full text-center'>
        <Title text1={"OUR"} text2={"POLICY"}/>
        <p className='w-full max-w-2xl mx-auto text-[13px] md:text-[20px] px-2 sm:px-4 text-blue-100'>Customer-Friendly Policies – Committed to Your Satisfaction and Safety.</p>
      </div>
      <div className='w-full flex flex-col md:flex-row items-center justify-center flex-wrap gap-8 sm:gap-10 md:gap-12 lg:gap-16'>
        <div className='w-[90vw] sm:w-[350px] md:w-[350px] min-h-[220px] max-w-[95vw] flex items-center justify-center flex-col gap-2 sm:gap-4 bg-[#1a232d]/30 rounded-xl p-4 md:shadow-md md:border border-none'>
          <RiExchangeFundsLine className='w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] text-[#90b9ff]' />
          <p className='font-semibold text-[18px] sm:text-[22px] md:text-[25px] text-[#a5e8f7] text-center'>Easy Exchange Policy</p>
          <p className='font-semibold text-[12px] sm:text-[15px] md:text-[18px] text-[aliceblue] text-center'>Exchange Made Easy – Quick, Simple, and Customer-Friendly Process.</p>
        </div>
        <div className='w-[90vw] sm:w-[350px] md:w-[350px] min-h-[220px] max-w-[95vw] flex items-center justify-center flex-col gap-2 sm:gap-4 bg-[#1a232d]/30 rounded-xl p-4 md:shadow-md md:border border-none'>
          <TbRosetteDiscountCheckFilled className='w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] text-[#90b9ff]' />
          <p className='font-semibold text-[18px] sm:text-[22px] md:text-[25px] text-[#a5e8f7] text-center'>7 Days Return Policy</p>
          <p className='font-semibold text-[12px] sm:text-[15px] md:text-[18px] text-[aliceblue] text-center'>Shop with Confidence – 7 Days Easy Return Guarantee.</p>
        </div>
        <div className='w-[90vw] sm:w-[350px] md:w-[350px] min-h-[220px] max-w-[95vw] flex items-center justify-center flex-col gap-2 sm:gap-4 bg-[#1a232d]/30 rounded-xl p-4 md:shadow-md md:border border-none'>
          <BiSupport className='w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] text-[#90b9ff]' />
          <p className='font-semibold text-[18px] sm:text-[22px] md:text-[25px] text-[#a5e8f7] text-center'>Best Customer Support</p>
          <p className='font-semibold text-[12px] sm:text-[15px] md:text-[18px] text-[aliceblue] text-center'>Trusted Customer Support – Your Satisfaction Is Our Priority.</p>
        </div>
      </div>
    </div>
  )
}

export default OurPolicy
