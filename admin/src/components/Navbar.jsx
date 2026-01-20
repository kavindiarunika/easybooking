import React from 'react'
import { assets } from '../assets/assets'
import { FiLogOut, FiBell, FiUser } from 'react-icons/fi'

const Navbar = ({settoken}) => {
  return (
    <div className='flex items-center px-6 py-3 justify-between bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg'>
      {/* Logo */}
      <div className='flex items-center gap-3'>
        <img src={assets.logo} alt="" className='w-[max(10%,80px)] brightness-0 invert'/>
        <span className='text-white font-bold text-xl hidden md:block'>Admin Panel</span>
      </div>

      {/* Right Section */}
      <div className='flex items-center gap-4'>
        {/* Notifications */}
        <button className='relative p-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-full transition'>
          <FiBell size={20} />
          <span className='absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full'></span>
        </button>

        {/* Admin Profile */}
        <div className='flex items-center gap-2 px-3 py-1 bg-slate-700 rounded-full'>
          <FiUser className='text-green-400' size={18} />
          <span className='text-white text-sm hidden sm:block'>Admin</span>
        </div>

        {/* Logout Button */}
        <button 
          onClick={() => {
            settoken(null);
            localStorage.removeItem('token');
          }}
          className='flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg'
        >
          <FiLogOut size={18} />
          <span className='hidden sm:block'>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Navbar