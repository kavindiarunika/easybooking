import React from 'react'
import heroImage from '../../../public/safahero.jpg'
import { safariassets } from '../../assets/safariassets/safa'
import SafariCards from './SafariCards'


const Safarihome = () => {
  return (
    <div className=' flex flex-col gap-4'>

        {/*------------------hero-------------------------- */}
     <div 
  className="relative w-full h-screen bg-cover   "
  style={{ backgroundImage: `url(${heroImage})` }}
>

    <div className='absolute w-full text-black inset-0  flex flex-row justify-center items-center gap-8'>
        <div className='w-3/4 ml-4 flex flex-col gap-8'>
           <h1 className='font-bold prata-regular text-4xl sm:text-6xl [-webkit-text-stroke:1px_green] '> ADVENTURE</h1>
           <p className="text-black text-xl sm:text-2xl bg-amber-300/20 rounded-xl p-2">"Step into the wild where nature tells its story — experience breathtaking landscapes, rare wildlife, and unforgettable safari moments."</p>
        </div>
        <div className='w-1/4 mr-4 text-right '>
        </div>
        </div>
  </div>



  

<SafariCards/>
         


    </div>
  )
}

export default Safarihome
