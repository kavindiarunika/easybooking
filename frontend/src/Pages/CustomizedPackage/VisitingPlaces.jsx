import React from "react";

// Sample JSON data
const placesData = [
  {
    id: 1,
    title: "Sigiriya - The Lion Rock Fortress",
    description:
      "Sigiriya, often called the Lion Rock Fortress, is one of Sri Lanka’s most spectacular and historically significant landmarks. Rising nearly 200 meters above the surrounding plains in the heart of the island, this ancient rock fortress was built in the 5th century AD by King Kashyapa I as a royal palace and stronghold. The site is renowned for its remarkable combination of natural beauty and human creativity, featuring intricately designed water gardens, frescoes of celestial maidens, and the famous Mirror Wall covered with ancient graffiti. Halfway up the rock, visitors can see the colossal lion’s paws that once formed the grand entrance to the summit palace, giving Sigiriya its name—derived from “Sinhagiri,” meaning “Lion Rock.”",
    image:
      "https://www.travelmapsrilanka.com/destinations/destinationimages/sigiriya-rock-fortress-sri-lanka.webp",
  },
  {
    id: 2,
    title: "Unawatuna Beach - Ocean Pearl Unawatuna",
    description:
      "Unawatuna Beach is one of Sri Lanka’s most famous and picturesque coastal gems, located just south of the historic city of Galle. Known for its crescent-shaped shoreline, golden sands, and calm turquoise waters, it offers the perfect setting for relaxation and seaside adventures alike. Protected by a natural coral reef, the beach provides safe swimming conditions and is a favorite spot for snorkeling, diving, and paddleboarding. Beneath the surface, visitors can discover a colorful underwater world filled with tropical fish and vibrant corals. The palm-fringed coastline is lined with beach cafés, seafood restaurants, and boutique hotels, creating a laid-back yet lively tropical vibe. As the sun sets, Unawatuna Beach transforms into a serene paradise with breathtaking ocean views and a warm, golden glow — making it one of the most enchanting places to unwind on Sri Lanka’s southern coast.",
    image:
      "https://www.gokitetours.com/wp-content/uploads/2024/10/The-10-Most-Breathtaking-Beaches-in-Sri-Lanka.webp",
  },
  {
    id: 3,
    title: "Madu River - Madu Ganga",
    description:
      "Madu River (also known as Madu Ganga) is a stunning and tranquil waterway located near Balapitiya, along Sri Lanka’s southwest coast. It is one of the country’s most beautiful natural ecosystems, famous for its mangrove forests, islands, and rich biodiversity. The river flows into the Indian Ocean, forming a large estuary that is home to over 60 small islands, many of which are covered in lush greenery and connected by narrow waterways. A Madu River boat safari is a popular experience, allowing visitors to glide through calm waters surrounded by mangroves, spot exotic birds, monkeys, and water monitors, and even visit a small cinnamon island where locals demonstrate traditional cinnamon production.",
    image:
      "https://res.klook.com/image/upload/c_crop,h_607,w_1080,x_0,y_382,z_0.4/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/fhoxicmjz1bfbdm3nwfp.jpg",
  },
  {
    id: 4,
    title: "Ambalangoda Traditional Mask Museum",
    description:
      "Ambalangoda Le Katayam refers to the traditional mask-making craft of Ambalangoda, a coastal town on Sri Lanka’s southwest coast. This town is renowned for producing vibrant, hand-carved wooden masks used in local rituals, dance performances, and cultural festivals. The masks, often painted in bold colors with intricate designs, represent a variety of characters, from demons and protective spirits to mythical creatures, reflecting the rich folklore and ancient rituals of Sri Lankan culture.",
    image:
      "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/0f/2d/d7/52.jpg",
  },
  {
    id: 5,
    title: "Nine Arches Bridge - Ella",
    description:
      "The Nine Arch Bridge, also known as the Bridge in the Sky, is an iconic railway viaduct located in Demodara, near Ella, in Sri Lanka’s central highlands. Built during the British colonial period, this magnificent bridge stretches approximately 91 meters long and stands about 24 meters high, supported by nine elegant arches made entirely of stone and brick, without the use of steel. Surrounded by lush tea plantations, dense forests, and misty mountains, the bridge offers breathtaking panoramic views and is a favorite spot for photographers and travelers alike. One of the most magical experiences is watching a train pass over the bridge, framed by the vibrant green scenery and the rolling hills of Ella.",
    image:
      "https://www.orienthotelsl.com/wp-content/uploads/2023/01/Nine-Arch-Bridge-Ella-1200x630-1.jpg",
  },
  {
    id: 6,
    title: "Nilaveli Beach",
    description:
      "Nilaveli Beach is a stunning stretch of coastline located on the northeastern coast of Sri Lanka, near the city of Trincomalee. Known for its pristine white sand and crystal-clear turquoise waters, Nilaveli is a paradise for beach lovers and water sports enthusiasts. The beach is relatively quiet and less commercialized than other tourist areas, making it an ideal spot for relaxation and tranquility. Visitors can enjoy swimming, snorkeling, and diving in the vibrant coral reefs just offshore, or take a boat trip to nearby Pigeon Island, a protected marine sanctuary home to diverse marine life.",
    image:
      "https://travel.com/wp-content/uploads/2025/09/Aerial-view-of-Nilaveli-Beach-in-Sri-Lanka-showing-pristine-white-sand-and-turquoise-waters.webp",
  },
  {
    id: 7,
    title: "Sinharaja Forest Reserve",
    description:
      "Sinharaja Forest Reserve is a UNESCO World Heritage Site and one of the last remaining rainforests in Sri Lanka. Located in the southwest of the island, this biodiverse hotspot is home to a wide variety of flora and fauna, including many endemic species. The forest is crisscrossed by numerous streams and rivers, creating a lush and vibrant ecosystem. Visitors to Sinharaja can explore its many trails, guided by knowledgeable local naturalists who can help spot the unique wildlife, including rare birds, reptiles, and insects. The reserve is also significant for its conservation efforts, protecting the rich biodiversity of Sri Lanka's rainforest.",
    image:
      "https://blog.maiglobetravels.fr/wp-content/uploads/2020/03/Sinharaja_Rain_Forest.jpg",
  },
];

const VisitingPlaces = () => {
  return (
    <div className="w-full flex flex-col gap-24 p-8 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <p className="w-full h-16"></p>

     
      {placesData.map((place, index) => (
        <div
          key={place.id}
          className={`flex flex-col md:flex-row items-center gap-12 transition-transform duration-500 hover:scale-[1.02] ${
            index % 2 === 1 ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* Image */}
          <div className="md:w-1/2 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={place.image}
              alt={place.title}
              className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Text */}
          <div className="md:w-1/2 p-6 bg-gray-800/70 rounded-3xl shadow-lg backdrop-blur-sm">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-amber-400 drop-shadow-lg">
              {place.title}
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg">{place.description}</p>
             <p className=" text-lg text-cyan-300 mt-4">Contact Us: +94 71 978 0312</p>
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default VisitingPlaces;
