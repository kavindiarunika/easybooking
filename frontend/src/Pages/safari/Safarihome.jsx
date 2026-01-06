import React, { useState } from 'react';
import SafariCards from './SafariCards';
import { safa } from '../../assets/safari';

const Safarihome = () => {
  // State to store the currently selected category ('' means "All")
  const [selectedCategory, setSelectedCategory] = useState('');

  // Toggle category: if clicked again, reset to '' (show all)
  const handleCategory = (category) => {
    setSelectedCategory((prev) => (prev === category ? '' : category));
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="w-full h-40"></p>

      <div className="w-full flex flex-row justify-between items-center gap-4">
        {/*---------------------------left side-------------- */}
        <div className="w-1/4">
          <p className="prata-regular text-2xl text-green-200 ml-4 mb-8">
            Choose Category
          </p>

          <div className="ml-4 flex flex-col gap-4 border-r-2 border-r-red-200/50 text-xl  px-4 py-2">
            
            <p
              onClick={() => setSelectedCategory('')}
              className={`cursor-pointer text-white hover:text-green-200 transition px-4 py-2  rounded-xl ${
                selectedCategory === '' ? 'text-black  bg-green-400/30' : ''
              }`}
            >
              All
            </p>

            {Object.keys(safa).map((category) => (
              <p
                key={category}
                onClick={() => handleCategory(category)}
                className={`cursor-pointer text-white hover:text-green-200 transition  px-4 py-2 rounded-xl ${
                  selectedCategory === category
                    ? 'text-black font-bold bg-green-400/30'
                    : ''
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </p>
            ))}
          </div>
        </div>

        {/*---------------------------right side-------------- */}
        <div className="w-3/4">
        
          <SafariCards selectedCategory={selectedCategory} />
        </div>
      </div>
    </div>
  );
};

export default Safarihome;