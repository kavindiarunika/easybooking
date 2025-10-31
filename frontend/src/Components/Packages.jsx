import React, { useEffect } from "react";

const excursions = [
  {
    title: "Cultural and Historical Excursions",
    description:
      "If you are interested in the culture and history of Sri Lanka, visit the ancient capitals Anuradhapura and Polonnaruwa. Explore amazing architecture, statues, palaces, man-made lakes, and huge dagobas. Kandy, the center of world Buddhism, houses the Temple of the Tooth Relic. Sigiriya, a rock fortress, and Dambulla cave temple are must-see highlights.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRW-eyTqNuihbAc_wpiKvjxAh8Xx_rHcKVajg&s",
  },
  {
    title: "Nature and Wildlife Excursions",
    description:
      "Explore Sri Lanka's natural wonders: jeep safaris in national parks, elephant orphanage in Pinnawala, Sinharaja rainforest, train rides through tea plantations and waterfalls, Peradeniya Botanical Garden, river and sea safaris, fishing, whale and dolphin watching, and visiting turtle farms.",
    image: "https://www.onthegotours.com/repository/Elephants-in-Sri-Lanka--On-The-Go-Tours-345681493287055.jpg",
  },
  {
    title: "Adventure Tours",
    description:
      "Adventure seekers can enjoy white water rafting, elephant safaris, buffalo cart rides, hot air balloon rides over ancient dagobas, and shipwreck dive tours. These activities provide excitement for thrill-seekers visiting Sri Lanka.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLqB6QWdyWbVg_KHi_hIcyXDejPche6V10Xg&s",
  },
  {
    title: "Services & Support",
    description:
      "Interpreter services, train ticket booking, and car with driver services are available. Russian-speaking or English-speaking drivers can optimize your route, and costs include fuel, parking, tolls, and driver accommodation. Save money while enjoying personalized excursions.",
    image: "https://www.lankaholidays.com/pics/45602/Bus.jpg",
  },
];

const Package = () => {
  // Fade-in effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".fade-in-card");
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
          section.classList.add("opacity-100", "translate-y-0");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // trigger on load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-20">
      <h2 className="text-3xl font-bold text-center mb-10 text-yellow-600">
        Excursions in Sri Lanka
      </h2>

      <div className="flex flex-wrap gap-6 justify-center">
        {excursions.map((item, index) => (
          <div
            key={index}
            className="fade-in-card flex-shrink-0 w-full sm:w-80 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-500 opacity-0 transform translate-y-10"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Package;
