import React from 'react'
import { CiSearch } from "react-icons/ci";

const SearchBar = ({ value, onChange }) => {
  return (
    <div>
    <div className='flex flex-row items-center  gap-4 bg-white/80 w-64 sm:w-96 rounded-xl py-1 px-2 '>
         <input 
            type='text' 
            value={value}
            onChange={onChange}
            placeholder='search here ...' 
            className='w-48 sm:w-84 h-10  focus:outline-0  ' 
            id='search'
            />
         <CiSearch className='text-black text-lg ' htmlFor='search' />

    </div>


    </div>
  )
}

export default SearchBar