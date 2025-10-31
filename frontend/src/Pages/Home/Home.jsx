import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../../Components/Hero";
import Title from "../../Components/Title";
import AboutLankaHome from "../About/AboutLankaHome";
import Trending from "../../Components/Trending";
import Packages from "../../Components/Packages";
import AboutSection from "./VideoSection";
import Gallery from "../Gallery/Gallery";



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

     <AboutSection/>
     <div className="w-full relative"> 
        <Trending />
      </div>
       <div id="special-selection">
        <AboutLankaHome />
      </div>
     
     
      <Title text1={"Gallery"} text2={"Section"} />
      <div id="gallery-section">
        <Gallery />
      </div>
       <div id="packages-section" className="w-full relative"> 
        <Packages />
      </div>

     
    </div>
  );
};

export default Home;