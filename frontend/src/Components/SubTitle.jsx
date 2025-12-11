import React from 'react';

const SubTitle = ({ text1, text2 }) => {
  return (
    <div className="flex sm:flex-row flex-col items-center sm:items-start mt-8 sm:mt-12">
     
    

      {/* Title text */}
      <p className="text-emerald-400 text-2xl sm:text-4xl font-bold tracking-wide text-center sm:text-left ml-2">
        {text1} <span className="text-amber-200">{text2}</span>
      </p>

      {/* Subtle underline */}
    
    </div>
  );
};

export default SubTitle;
