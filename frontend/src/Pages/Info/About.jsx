import React from "react";

const stats = [
  { value: "5,000+", label: "Happy Travelers" },
  { value: "120+", label: "Curated Experiences" },
  { value: "9", label: "Provinces Covered" },
  { value: "4.9★", label: "Average Rating" },
];

const values = [
  {
    icon: "🌿",
    title: "Authentic Experiences",
    desc: "We go beyond tourist traps to connect you with the soul of Sri Lanka — its people, flavors, and hidden landscapes.",
  },
  {
    icon: "🤝",
    title: "Trusted Partners",
    desc: "Every vendor, hotel, and guide in our network is personally vetted for quality, safety, and genuine hospitality.",
  },
  {
    icon: "🗺️",
    title: "Tailored Journeys",
    desc: "No two travelers are alike. We craft personalized itineraries that match your pace, budget, and passions.",
  },
  {
    icon: "🌱",
    title: "Sustainable Travel",
    desc: "We partner with eco-conscious operators and encourage responsible tourism that preserves Sri Lanka for generations.",
  },
];

const team = [
  { name: "Ayesha Perera", role: "Founder & CEO", emoji: "👩‍💼" },
  { name: "Rohan Silva", role: "Head of Experiences", emoji: "🧭" },
  { name: "Nimali Fernando", role: "Customer Happiness", emoji: "💛" },
];

export default function About() {
  return (
    <div className="bg-slate-950 text-gray-100">
      {/* Hero */}
      <section className="relative flex items-center justify-center min-h-[92vh] p-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_40%,rgba(180,140,60,0.18)_0%,transparent_60%),radial-gradient(ellipse_at_80%_70%,rgba(30,90,50,0.35)_0%,transparent_60%),radial-gradient(ellipse_at_60%_10%,rgba(200,160,80,0.12)_0%,transparent_55%),#0d1a12]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E')] opacity-40 pointer-events-none"></div>
        <div className="relative max-w-2xl text-center px-4">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-yellow-400 border border-yellow-600 rounded-full px-4 py-1 mb-7">
            ✦ Our Story
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-tight mb-7 text-gray-100">
            Discover Sri Lanka,
            <br />
            <em className="italic text-yellow-400">the way it was meant</em>
            <br />
            to be seen
          </h1>
          <p className="text-lg sm:text-xl font-light text-gray-300 max-w-xl mx-auto mb-7">
            SmartsBooking was born from a single belief — that travel should feel
            effortless, honest, and deeply human. We're locals who fell in love
            with our island all over again, and we want you to feel the same.
          </p>
          <div className="mx-auto w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
        </div>
      </section>

      {/* stats */}
      <div className="flex flex-wrap justify-center border-y border-yellow-700 bg-gray-900/50">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex-1 min-w-[150px] px-6 py-10 text-center border-r last:border-r-0"
          >
            <span className="block font-serif text-3xl text-yellow-400">
              {s.value}
            </span>
            <span className="block text-xs uppercase tracking-wider text-gray-400 mt-2">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* story */}
      <section className="max-w-5xl mx-auto py-24 px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-gradient-to-br from-green-800 via-slate-900 to-green-900">
            <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
              🌴
            </div>
            <div className="absolute bottom-6 left-6 bg-gray-800/70 backdrop-blur-sm border border-yellow-700 rounded-md px-5 py-3">
              <span className="block font-serif text-2xl text-yellow-400">
                2025
              </span>
              <span className="block text-xs uppercase tracking-wider text-gray-400">
                Founded in Colombo
              </span>
            </div>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-widest text-yellow-400 mb-4">
              Who We Are
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl text-gray-100 mb-6">
              A platform built by travelers, for travelers
            </h2>
            <div className="text-gray-300 space-y-6">
              <p>
                SmartsBooking started in 2025 when a small group of Sri Lankan
                travel enthusiasts realized that booking a trip here was far
                harder than it needed to be. Fragmented information, unreliable
                vendors, and a lack of transparency made it frustrating — even
                for locals.
              </p>
              <p>
                So we built what we wished existed. A single, trusted platform
                where you can book hill-country retreats, coastal safaris,
                tuk-tuk adventures, and cultural walking tours — all backed by
                real reviews and a team that genuinely cares.
              </p>
              <p>
                Today we work with over 300 local partners across all nine
                provinces, from the misty highlands of Nuwara Eliya to the
                turquoise waters of Mirissa. Every listing is hand-reviewed.
                Every partner is chosen with care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* values */}
      <section className="max-w-5xl mx-auto py-24 px-6">
        <span className="block text-xs uppercase tracking-widest text-yellow-400 mb-4">
          What Drives Us
        </span>
        <h2 className="font-serif text-3xl lg:text-4xl text-gray-100 mb-10 max-w-xl">
          Four principles that shape everything we do
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-gray-800/30 border border-yellow-700 rounded-lg p-8 hover:border-yellow-400 transition transform hover:-translate-y-1"
            >
              <span className="text-2xl mb-4 block">{v.icon}</span>
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
        <span className="block text-xs uppercase tracking-widest text-yellow-400 mb-4">
          The People
        </span>
        <h2 className="font-serif text-3xl lg:text-4xl text-gray-100 mb-6">
          Meet the team behind the magic
        </h2>
        <p className="text-gray-300 mb-10 max-w-md">
          We're a small, passionate crew based in Colombo with deep roots across
          the island. Each of us has a favourite spot we're secretly hoping
          you'll discover too.
        </p>
        <div className="flex flex-wrap gap-6">
          {team.map((t) => (
            <div
              key={t.name}
              className="flex-1 min-w-[180px] bg-gray-800/30 border border-yellow-700 rounded-lg p-8 text-center hover:border-yellow-400 transition"
            >
              <span className="text-4xl mb-4 block">{t.emoji}</span>
              <div className="font-serif text-lg text-gray-100">{t.name}</div>
              <div className="text-gray-400 text-sm mt-1">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-6 my-20 rounded-xl bg-gradient-to-br from-green-900 via-slate-900 to-green-900 border border-yellow-700 p-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(200,168,75,0.12)_0%,transparent_70%)] pointer-events-none"></div>
        <h2 className="font-serif text-3xl lg:text-4xl text-gray-100 mb-4">
          Ready to explore the Pearl of the Indian Ocean?
        </h2>
        <p className="text-gray-300 max-w-lg mx-auto mb-6 leading-relaxed">
          Let us handle the logistics while you focus on making memories. Your
          journey through Sri Lanka starts here.
        </p>
        <button className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 font-semibold text-sm uppercase tracking-wide px-10 py-3 rounded-full hover:opacity-90 transition">
          Start Planning →
        </button>
      </section>
    </div>
  );
}
