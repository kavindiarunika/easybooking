import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {

    const tomeCategory =[
        {name:"stays payments" , path:"/staypaid"},
        {name:"GoTrip payments" , path:"/safaripaid"},
        {name:"Advertisment" , path:"/ads"},
        {name:"Vendor Register" , path:"/vendors"},
    ]

    
  return (
    <div>
        <div className='grid grid-cols-3 gap-4'>
            
           
            {tomeCategory.map((category, index) => (
                <Link to={category.path} key={index}>
                    <div key={index} className=" p-4 border rounded  bg-amber-300">
                        <h2>{category.name}</h2>
                    </div>
                </Link>
            ))}
                </div>
            
          
        </div>
  
  )
}

export default Home