import React, { useState, useEffect } from 'react';
import Backgound from '../component/Background';
import Hero from '../component/Hero';
import Product from './Product';
// import OurPolicy from '../component/OurPolicy';
// import NewLetterBox from '../component/NewLetterBox';
import Footer from '../component/Footer';


function Home() {
  let heroData=[
    {text1:"30% OFF Limited Offer",text2:"Style that"},
    {text1:"Discover the Best of Bold Fashion",text2:"Limited Time Only!"},
    {text1:"Explore Our Best Collection ",text2:"Shop Now!"},
    {text1:"Choose your Perfect Fasion Fit",text2:"Now on Sale!"}
  ]

  let [heroCount,setHeroCount] = useState(0);

  useEffect(()=>{
    let interval = setInterval(()=>{
      setHeroCount(prevCount => (prevCount === 3 ? 0 : prevCount + 1));
    },3000);
    return () => clearInterval(interval)
  },[])
  return (
    <div className='overflow-x-hidden relative top-[70px] animate-fadeInUp'>
      <div className='w-[100vw] lg:h-[100vh] md:h-[50vh] sm:h-[30vh] bg-gradient-to-l from-[#141414] to-[#0c2025] animate-fadeInUp'>
        <Backgound heroCount={heroCount}/>
        <Hero heroCount={heroCount} setHeroCount={setHeroCount} heroData={heroData[heroCount]}/>
      </div>
      <div className="animate-fadeInUp">
        <Product/>
      </div>
      {/* <OurPolicy/>
      <NewLetterBox/> */}
      <div className="animate-fadeInUp delay-300">
        <Footer/>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.7s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  )
}

export default Home;

/*
Add the following Tailwind CSS to your global styles (e.g., index.css):
@layer utilities {
  .animate-fade-in { @apply opacity-0 animate-[fadeIn_0.7s_ease-in-out_forwards]; }
  .animate-fade-in-slow { @apply opacity-0 animate-[fadeIn_1.2s_ease-in-out_forwards]; }
  .animate-slide-up { @apply opacity-0 translate-y-8 animate-[slideUp_0.7s_ease-in-out_forwards]; }
}
@keyframes fadeIn { to { opacity: 1; } }
@keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
*/
