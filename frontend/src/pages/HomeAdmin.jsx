import React, { useState } from 'react'
// import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { useContext, useEffect } from 'react'
// import { authDataContext } from '../context/AuthContextAdmin'
import axios from 'axios'
import NavAdmin from '../component/NavAdmin'

function HomeAdmin() {
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [recentOrders, setRecentOrders] = useState([])
  const [totalSales, setTotalSales] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const delivery_fee = 40;

  const  serverUrl = "http://127.0.0.1:8000"

  const fetchCounts = async () => {
    try {
      const products = await axios.get(`${serverUrl}/api/products/`, {}, { withCredentials: true })
      setTotalProducts(products.data.length)
      const orders = await axios.get(`${serverUrl}/api/orders/all/`, { withCredentials: true })
      setTotalOrders(orders.data.length)
      // Sort orders by created_at descending (latest first)
      const sortedOrders = [...orders.data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setRecentOrders(sortedOrders.slice(0, 3));
      // Sum all order prices + delivery fee for each order
      setTotalSales(
        orders.data.reduce((sum, o) => sum + Number(o.total_amount) + delivery_fee, 0)
      );
    } catch (err) {
      console.error('Failed to fetch counts', err)
    }
  }

  useEffect(() => {
    fetchCounts()
  }, [])

  return (
    <div className='min-h-screen w-full bg-gradient-to-l from-[#141414] to-[#0c2025] text-white'>
      
      {/* <NavAdmin/> */}
      {/* Sidebar for xl+ screens */}
      <div className='hidden xl:block fixed left-0 h-full w-[220px] z-40'>
        <Sidebar />
      </div>
      {/* Topbar for mobile/tablet/desktop
      <div className='xl:hidden w-full sticky top-0 z-30 bg-[#101c1f] shadow-sm flex items-center justify-between px-4 py-3'>
        <span className='text-[#afe2f2] text-lg font-bold'>UrbanWagon Admin Panel</span>
      </div> */}
      {/* Main dashboard area */}
      <div className='flex flex-col items-center justify-center min-h-screen w-full xl:pl-[220px] pt-8 pb-8 px-2 sm:px-4'>
        <div className='w-full max-w-5xl bg-[#0e232a]/70 rounded-2xl shadow-2xl p-6 sm:p-10 flex flex-col gap-10'>
          <h1 className='text-[28px] sm:text-[32px] md:text-[38px] font-bold text-[#afe2f2] text-center mb-2 mt-[40px]'>UrbanWagon Admin Panel</h1>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            <div className='bg-[#0000003a] rounded-lg shadow flex flex-col items-center justify-center h-[120px] p-4 border border-[#1e3a4a]'>
              <div className='text-[#dcfafd] text-[18px] sm:text-[20px] mb-2'>Total Products</div>
              <span className='px-6 py-2 bg-[#030e11] rounded-lg border border-[#969595] text-[22px] font-bold'>{totalProducts}</span>
            </div>
            <div className='bg-[#0000003a] rounded-lg shadow flex flex-col items-center justify-center h-[120px] p-4 border border-[#1e3a4a]'>
              <div className='text-[#dcfafd] text-[18px] sm:text-[20px] mb-2'>Total Orders</div>
              <span className='px-6 py-2 bg-[#030e11] rounded-lg border border-[#969595] text-[22px] font-bold'>{totalOrders}</span>
            </div>
            <div className='bg-[#0000003a] rounded-lg shadow flex flex-col items-center justify-center h-[120px] p-4 border border-[#1e3a4a]'>
              <div className='text-[#dcfafd] text-[18px] sm:text-[20px] mb-2'>Total Sales</div>
              <span className='px-6 py-2 bg-[#030e11] rounded-lg border border-[#969595] text-[22px] font-bold'>₹ {totalSales}</span>
            </div>
          </div>
          {/* Recent Orders */}
          <section className='w-full'>
            <h2 className='text-[22px] sm:text-[25px] text-[#b6f7e7] font-semibold mb-4'>Recent Orders</h2>
            <div className='flex flex-col gap-3'>
              {recentOrders.length === 0 && <div className='text-[16px] text-[#b6b6b6]'>No recent orders.</div>}
              {recentOrders.map((order, idx) => {
                let address = {};
                try {
                  address = typeof order.address === "string"
                    ? JSON.parse(order.address.replace(/'/g, '"'))
                    : order.address;
                } catch (e) {
                  address = {};
                }
                // Capitalize first letter utility
                const capitalize = (str) =>
                  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
                return (
                  <div key={order.id || idx} className='bg-[#1a2a2e] rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-[#2e4a4e] w-full'>
                    <div>
                      <span className='font-bold text-[#7ee8f7]'>Order:</span> <span className='text-[#e0e0e0]'>{order.id?.toString().slice(-6) || 'N/A'}</span>
                    </div>
                    <div>
                      <span className='font-bold text-[#7ee8f7]'>User:</span> <span className='text-[#e0e0e0]'>
                        {capitalize(address?.firstName) || ""} {capitalize(address?.lastName) || ""}
                      </span>
                    </div>
                    <div>
                      <span className='font-bold text-[#7ee8f7]'>Amount:</span> <span className='text-[#e0e0e0]'>₹ {Number(order.total_amount) + delivery_fee}</span>
                    </div>
                    <div>
                      <span className='font-bold text-[#7ee8f7]'>Status:</span> <span className='text-[#e0e0e0]'>{order.status || order.payment_method}</span>
                    </div>
                    <div>
                      <span className='font-bold text-[#7ee8f7]'>Payment:</span> <span className={`font-semibold ${order.payment_verified ? 'text-green-400' : 'text-red-400'}`}>{order.payment_verified ? 'Done' : 'Pending'}</span>
                    </div>
                    <div>
                      <span className='font-bold text-[#7ee8f7]'>Date:</span> <span className='text-[#e0e0e0]'>{order.created_at ? new Date(order.created_at).toLocaleDateString() : ""}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          {/* Quick Actions */}
          <section className='w-full'>
            <h2 className='text-[22px] sm:text-[25px] text-[#b6f7e7] font-semibold mb-4'>Quick Actions</h2>
            <div className='flex flex-col sm:flex-row gap-4 w-full'>
              <a href='/add' className='flex-1 bg-[#0e6b8c] hover:bg-[#0b4c66] text-white px-4 py-3 rounded-lg text-[18px] text-center transition'>Add Product</a>
              <a href='/lists' className='flex-1 bg-[#0e8c5a] hover:bg-[#0b6642] text-white px-4 py-3 rounded-lg text-[18px] text-center transition'>Product List</a>
              <a href='/orders' className='flex-1 bg-[#8c0e3b] hover:bg-[#660b2b] text-white px-4 py-3 rounded-lg text-[18px] text-center transition'>All Orders</a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default HomeAdmin
