import React from 'react';

const Title = ({ text1, text2 }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6 mt-12">
      <p className="text-center sm:text-left text-white text-xl sm:text-3xl">
        {text1}{" "}
        <span className="text-white font-semibold text-lg sm:text-3xl">
          {text2}
        </span>
      </p>
      <div className="w-12 sm:w-24 h-[2px] bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"></div>
    </div>
  );
};

export default Title;
