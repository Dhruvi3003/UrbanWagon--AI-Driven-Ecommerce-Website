import React from 'react'
import LatestCollection from '../component/LatestCollection'
import BestSeller from '../component/BestSeller'
import OurPolicy from '../component/OurPolicy'
import NewLetterBox from '../component/NewLetterBox'
// import Footer from '../component/Footer'

function Product() {
  return (
    <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex items-center justify-start flex-col py-[20px]'>

        <div className='w-[100%] min-h-[70px] flex items-center justify-center gap-[10px] flex-col '>
            <LatestCollection/>
        </div>
        <div className='w-[100%] min-h-[70px] flex items-center justify-center gap-[10px] flex-col '>
            <BestSeller/>
        </div>
        <div className='w-[100%] min-h-[70px] flex items-center justify-center gap-[10px] flex-col mb-2'>
            <OurPolicy/>
        </div>
        <div className='w-[100%] min-h-[70px] flex items-center justify-center gap-[2px] flex-col mt-[-20px]'>
            <NewLetterBox/>
        </div>
        
      
    </div>
  )
}

export default Product
