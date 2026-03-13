import React from "react";
import homepageImages from "../../assets/HomepageImages/home";
import { heroImage } from "../../assets/HomepageImages/home";
const stats = [
  { value: "5,000+", label: "Happy Travelers" },
  { value: "120+", label: "Curated Experiences" },
  { value: "9", label: "Provinces Covered" },
  { value: "4.9★", label: "Average Rating" },
];

const values = [
  {
    title: "Authentic Experiences",
    desc: "We go beyond tourist traps to connect you with the soul of Sri Lanka — its people, flavors, and hidden landscapes.",
  },
  {
    title: "Trusted Partners",
    desc: "Every vendor, hotel, and guide in our network is personally vetted for quality, safety, and genuine hospitality.",
  },
  {
    title: "Tailored Journeys",
    desc: "No two travelers are alike. We craft personalized itineraries that match your pace, budget, and passions.",
  },
  {
    title: "Sustainable Travel",
    desc: "We partner with eco-conscious operators and encourage responsible tourism that preserves Sri Lanka for generations.",
  },
];




export default function About() {
  return (
    <div className="bg-slate-950 text-gray-100">
     

      {/* story */}
      <section className="max-w-5xl mx-auto py-26">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* left text column */}
          <div className="mr-1 ml-2">
            <span className="text-sm text-green-400 uppercase">
              How It Started
            </span>
            <h2 className="prata-regular font-serif text-4xl lg:text-5xl text-gray-100 mt-4 mb-6 ">
              Our Dream is Global Learning Transformation
            </h2>
            <p className="inter-regular text-gray-300 mb-8">
              SmartsBooking started in 2025 when a small group of Sri Lankan
              travel enthusiasts realized that booking a trip here was far
              harder than it needed to be. Fragmented information, unreliable
              vendors, and a lack of transparency made it frustrating — even for
              locals.
            </p>
            <p className="inter-regular text-gray-300 mb-8">
              So we built what we wished existed. A single, trusted platform
              where you can book hill-country retreats, coastal safaris, tuk-tuk
              adventures, and cultural walking tours — all backed by real
              reviews and a team that genuinely cares.
            </p>
            <p className="inter-regular text-gray-300">
              Today we work with over 300 local partners across all nine
              provinces, from the misty highlands of Nuwara Eliya to the
              turquoise waters of Mirissa. Every listing is hand-reviewed. Every
              partner is chosen with care.
            </p>
          </div>
          {/* right image+stats column */}
          <div className="space-y-6">
            <img
              src={heroImage.about}
              alt="Sri Lanka"
              className="rounded-lg w-full object-cover"
            />
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-green-200 text-slate-900 rounded-lg p-6 text-center shadow"
                >
                  <div className="font-semibold text-xl mb-1">{s.value}</div>
                  <div className="text-sm uppercase tracking-wide">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* values */}
      <section className="max-w-5xl mx-auto py-24 px-6">
        <span className="block text-xs uppercase tracking-widest text-green-400 mb-4">
          What Drives Us
        </span>
        <h2 className="prata-regular font-serif text-3xl lg:text-4xl text-gray-100 mb-10 max-w-xl">
          Four principles that shape everything we do
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-gray-800/30 border border-green-700 rounded-lg p-8 hover:border-green-400 transition transform hover:-translate-y-1"
            >
              <h3 className="font-serif text-xl text-gray-100 mb-2">
                {v.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* team */}
      <section className="max-w-5xl mx-auto py-24 px-6">
        <span className="block text-xs uppercase tracking-widest text-green-400 mb-4">
          our Company
        </span>
        <div className="flex flex-col sm:flex-row gap-6 sm:12">
            <p className="text-gray-300 mb-10 max-w-md">
          At Code Builder, we transform ideas into powerful digital experiences. As a full-service software development company, we specialize in delivering robust, scalable, and innovative technology solutions tailored to meet the unique needs of startups, enterprises, and everything in between.

Founded with a passion for coding excellence and a vision for driving digital transformation, Code Builder has grown into a trusted partner for businesses across various industries. Our team of expert developers, designers, and strategists bring together deep technical knowledge and a creative mindset to craft applications that are not only
 functional but also user-centric and future-ready.
        </p>
        <img src="https://codebuilder.it.com/wp-content/uploads/2025/06/LOGO-1.png" className="w-96 h-84 bg-amber-50"/>
        </div>
      
       
      </section>

     
    </div>
  );
}
