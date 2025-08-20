import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'

function Card({ name, image, id, price }) {
  let { currency } = useContext(shopDataContext)
  let navigate = useNavigate()
  const serverUrl = "http://127.0.0.1:8000"

  return (
    <div
      className="w-[300px] max-w-[90%] h-[400px] bg-[#ffffff0a] backdrop:blur-lg rounded-lg hover:scale-[102%] 
                 flex flex-col p-[10px] cursor-pointer border border-[#80808049] transition-all duration-200"
      onClick={() => navigate(`/productdetail/${id}`)}
    >
      {/* Product Image */}
      <img
        src={`${serverUrl}/${image}`}
        alt={name}
        className="w-full h-[65%] rounded-sm object-cover"
      />

      {/* Product Name + Price Wrapper */}
      <div className="flex flex-col justify-between flex-1 mt-6">
        {/* Name */}
        <div className="text-[#c3f6fa] text-[18px] leading-tight break-words whitespace-normal">
          {name}
        </div>

        {/* Price */}
        <div className="text-[#f3fafa] text-[14px] font-semibold mb-3">
          {currency} {price}
        </div>
      </div>
    </div>
  )
}

export default Card
