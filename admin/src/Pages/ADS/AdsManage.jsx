import React from 'react'
import { useNavigate } from 'react-router-dom'
import ShowAds from './ShowAds';

const AdsManage = () => {

    const navigate = useNavigate();

  return (
    <div className='bg-white flex flex-col items-center justify-between gap-4'>

        <div className='text-white '>
            <button
            onClick={() =>navigate('/addads')}
            className='bg-green-600 py-2 px-4 rounded-xl boder'>
                Add Ads
            </button>

<div className='mt-4 '>
 <ShowAds/>
</div>
          
        </div>

    </div>
  )
}

export default AdsManage