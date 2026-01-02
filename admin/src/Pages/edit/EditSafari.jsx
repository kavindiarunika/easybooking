import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";   
import axios from 'axios'
import { toast } from "react-toastify";
import { backendUrl } from "../../App";
import { set } from "mongoose";

const EditSafari = () => {
  const { id } = useParams();

   const [safariData, setSafariData] = useState({
    name: "",
    description: "",
    price: "",
    adventures: [],
    includeplaces: [],
    TeamMembers: "",
    whatsapp: "",
    totalDays: "",
    email: "",
    VehicleType: "",
    GuiderName: "",
    GuiderExperience: "",
  });

  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]);
  const [vehicleImages, setVehicleImages] = useState([]);
  const [guiderImage, setGuiderImage] = useState(null);
  const [shortVideo, setShortVideo] = useState(null);



  useEffect(()=>{
    const fetchData =async() =>{

      try{
        const response = await axios.get(`${backendUrl}/api/safari/safari/${id}`);
       
        setSafariData({
          name: response.data.name || "",
          description: response.data.description || "",
          price: response.data.price || "",
          adventures: response.data.adventures || [],
          includeplaces: response.data.includeplaces || [],
          TeamMembers: response.data.TeamMembers || "",
          whatsapp: response.data.whatsapp || "",
          totalDays: response.data.totalDays || "",
          email: response.data.email || "",
          VehicleType: response.data.VehicleType || "",
          GuiderName: response.data.GuiderName || "",
          GuiderExperience: response.data.GuiderExperience || "",

        })

      }
      catch(error){
        toast.error("Error fetching safari data");
      }
    }
  } ,[])
  return <div></div>;
};

export default EditSafari
