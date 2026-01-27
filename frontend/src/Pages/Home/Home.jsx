import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../../Components/Hero";
import HomeAdvertisement from "../../Components/HomeAdvertisement";
import Title from "../../Components/Title";

import Trending from "../../Components/Trending";
import Packages from "../../Components/Packages";
import AboutSection from "./VideoSection";
import VisitingPlaces from "../../Components/VisitingPlaces";
import Safari from '../../Components/Safari'
import Hotels from '../../Components/Hotels'
import CommingSoon from "../../Components/CommingSoon";

const Home = () => {
  const location = useLocation();

  // Scroll to section if navigation state exists
  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 200);
      }
    }
  }, [location]);

  return (
    <div className="bg-slate-950">
    
      <Hero />

      {/* Home Advertisement Section */}
      <HomeAdvertisement />

    
     <div className="w-full relative"> 
        <Trending />
      </div>
     <div className="w-full relative "> 
        <Safari/>
      </div>
     <div className="w-full relative "> 
        <VisitingPlaces/>
      </div>
       <AboutSection/>
      <div id="packages-section" className="w-full relative"> 
        <Packages />
      </div>

      <div className="w-full relative "> 
        <CommingSoon/>
      </div>

     
    </div>
  );
};

export default Home;