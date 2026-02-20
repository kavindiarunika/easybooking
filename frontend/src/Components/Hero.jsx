import React from "react";
import { heroImage } from "../assets/HomepageImages/home";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  return (
    <>
      <section className='w-full bg-[url("https://assets.prebuiltui.com/images/components/hero-section/hero-grid-gradient-img.png")] bg-cover bg-center bg-no-repeat px-4  '>
        <div className="w-full md:px-16 lg:px-24 xl:px-32 mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-8  sm:mt-24">
          {/* Left */}
          <div className="-mt-12 flex flex-col items-start">
            <a
              href="https://prebuiltui.com"
              className=" flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full p-1 pr-3 text-sm mx-auto md:mx-0 mt-20"
            >
              <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                NEW
              </span>
              <p className="flex items-center gap-2 text-indigo-600">
                <span className="text-sm">Try 30 days free trial option</span>
                <svg
                  className="mt-px"
                  width="6"
                  height="9"
                  viewBox="0 0 6 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m1 1 4 3.5L1 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </p>
            </a>

            <h1 className="prata-regular text-center lg:text-left text-neutral-900 text-3xl md:text-5xl lg:text-[52px]/16 leading-tight font-semibold max-w-[610px] mt-4">
              Discover your dream stay with{" "}
              <span className="text-green-800">comfort, style,</span>and moments
              that turn into lifelong memories.
            </h1>
            <p className="hidden sm:block text-center lg:text-left text-base/7 text-gray-700 max-w-md mt-4 mx-auto md:mx-0">
              compare hunderds of Hotels and Choose the one that suits you the
              best. We provide you with the best deals and offers for your stay.
            </p>

            <div className="flex items-center justify-center  gap-2 h-13 max-w-[440px] w-full rounded-full overflow-hidden mt-6 mx-auto md:mx-0">
              <button
                type="button"
                onClick={() => navigate("/vendor/register")}
                className="bg-white hover:bg-black hover:text-white w-32 sm:w-56 h-10 rounded-full text-sm text-black cursor-pointer mr-1.5"
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => navigate("/vendor/register?tab=login")}
                className="bg-green-600 hover:bg-green-700 w-32 sm:w-56 h-10 rounded-full text-sm text-slate-50 cursor-pointer mr-1.5"
              >
                Login
              </button>
            </div>

            {/* Avatars + Stars */}
            <div className="hidden  items-center mt-10 mx-auto lg:mx-0">
              <div className="flex -space-x-3 pr-3">
                <img
                  src={heroImage[1]}
                  alt="user3"
                  className="size-9 object-cover rounded-full border border-slate-50 hover:-translate-y-0.5 transition"
                />
              </div>

              <div>
                <div className="flex ">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-star text-transparent fill-[#FF8F20]"
                        aria-hidden="true"
                      >
                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                      </svg>
                    ))}
                </div>
                <p className="text-xs text-neutral-600">
                  Used by 10,000+ users
                </p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="mt-24 sm:mt-0 w-full max-w-md md:max-w-lg">
            <img
              className="w-full h-auto object-contain rounded-2xl shadow-amber-200"
              src={heroImage[1]}
              alt="Dashboard Preview"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
