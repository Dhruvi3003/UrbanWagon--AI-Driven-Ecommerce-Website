import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import { shopDataContext } from '../context/ShopContext'
import Card from './Card'

function BestSeller() {
    let { products = [] } = useContext(shopDataContext); // ✅ Default to empty array

    let [bestSeller,setBestSeller] = useState([])

    useEffect(()=>{
      console.log("All",products);
      
    let filterProduct = products.filter((item) => item.best_seller)

    setBestSeller(filterProduct.slice(0,4));
    },[products])
  return (
    <div>
        <div className='h-[8%] w-[100%] text-center mt-[50px] '>
            <Title text1={"BEST"} text2={"SELLER"}/> 
            <p className='w-[100%] m-auto text-[13px] md:text-[20px] px-[10px] text-blue-100'>Tried, Tested, Loved – Discover Our All-Time Best Sellers.</p>
        </div>
        <div className='w-[100%] h-[50%] mt-[30px] flex items-center justify-center flex-wrap gap-[50px]'>
            {
             bestSeller.map((item,index)=>(
                <Card
                id={item.id}
                name={item.name}
                price={item.price}
                image={item.variants[0].image1}
              />
             ))
            }
        </div>
      
    </div>
  )
}

export default BestSeller
