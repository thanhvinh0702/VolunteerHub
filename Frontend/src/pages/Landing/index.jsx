import React from "react";
import leaf1 from "../../assets/img/leaf-1.png";
import leaf2 from "../../assets/img/leaf-2.png";
import plant1 from "../../assets/img/plant-1.png";
import plant2 from "../../assets/img/plant-2.png";
import leaf3 from "../../assets/img/leaf-3.png";
import review1 from "../../assets/img/review-1.jpg";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { landing1 } from "../../assets/img/index";
import { MdOutlineDateRange } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import { AiOutlineFileDone } from "react-icons/ai";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dataLading = [
    {
      title: "Events",
      icon: <MdOutlineDateRange />,
      content: "200",
    },
    {
      title: "Active Volunteers",
      icon: <FaPeopleGroup />,
      content: "2000",
    },
    {
      title: "Hours Contributed",
      icon: <FaClock />,
      content: "50000",
    },
    {
      title: "Events Completed",
      icon: <AiOutlineFileDone />,
      content: "100",
    },
  ];
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <div className="">
      <header className="bg-[#FFF8F0] fixed w-full top-0 left-0 z-50">
        <nav className="max-w-screen-xl mx-auto flex items-center justify-between h-16 sm:h-20 px-6 sm:px-16">
          <div className="font-lobster text-2xl sm:text-[32px] text-green-900">
            VolunteerHub
          </div>
          <div
            className={`absolute top-0  min-h-[80vh] w-full bg-[#FFF8F0]/80 backdrop-blur-sm flex items-center justify-center duration-300 overflow-hidden lg:static lg:min-h-fit lg:bg-transparent lg:w-auto ${
              menuOpen ? "left-0" : "left-[-100%]"
            }`}
          >
            <ul className="flex flex-col items-center gap-8 lg:flex-row text-black">
              <li>
                <a href="" className="nav-link">
                  Home
                </a>
              </li>
              <li>
                <a href="" className="nav-link">
                  About
                </a>
              </li>
              <li>
                <a href="" className="nav-link">
                  Popular
                </a>
              </li>
              <li>
                <a href="" className="nav-link">
                  Review
                </a>
              </li>
            </ul>
            <div className="absolute bottom-0 -right-10 opacity-90 lg:hidden">
              <img src={leaf1} alt="leaf-1" className="w-32" />
            </div>
            <div className="absolute -top-5 -left-5 rotate-90 opacity-90 lg:hidden">
              <img src={leaf2} alt="leaf-2" className="w-32" />
            </div>
          </div>
          <div
            onClick={toggleMenu}
            className={`text-xl text-green-950 sm:text-3xl cursor-pointer z-50 transition-transform duration-300 lg:hidden ${
              menuOpen ? "rotate-90 text-green-400" : ""
            }`}
          >
            <i className={menuOpen ? "ri-close-line" : "ri-menu-4-line"}></i>
          </div>
        </nav>
      </header>
      <div className="mt-24">
        <section id="home" className="mt-20 px-6 sm:px-16">
          <div className="container max-w-screen-xl mx-auto">
            <div className="flex flex-col items-center gap-2 lg:flex-row mb-8">
              <div className="w-full space-y-5 lg:w-1/2">
                <p className="block max-w-min bg-green-950 border-amber-400 border-2 rounded-full px-2 py-1">
                  <span className="text-yellow-500 text-sm">
                    #TheSpiritofVolunteering
                  </span>{" "}
                </p>
                <h1 className="text-white max-sm:!text-2xl mb-15">
                  The Spirit of
                  <span className="text-yellow-500"> Volunteering</span>{" "}
                </h1>
                <p className="text-slate-300 font-lobster text-justify max-w-1/2 max-sm:max-w-full">
                  Connect passionate hearts with meaningful volunteer
                  activities. Together, we can create positive change for
                  communities and society.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row md:gap-4 lg:pt-5 xl:pt-10">
                  <button className="btn">
                    <span>Get started</span>
                    <i className="ri-leaf-line"></i>
                  </button>
                  <button className="btn btn_outline">
                    <span>Explore more</span>
                    <i className="ri-leaf-line"></i>
                  </button>
                </div>
                <div className="flex flex-row items-center gap-5 text-lg lg:pt-10">
                  <i className="ri-facebook-fill text-slate-300 hover:text-yellow-400 text-base"></i>
                  <i className="ri-instagram-fill text-slate-300 hover:text-yellow-400 text-base"></i>
                  <i className="ri-twitter-fill text-slate-300 hover:text-yellow-400 text-base"></i>
                  <i className="ri-youtube-fill text-slate-300 hover:text-yellow-400 text-base"></i>
                </div>
              </div>
              <div className="w-full relative lg:w-1/2 mt-5">
                <img
                  src={landing1}
                  alt="home"
                  className="w-full h-full object-cover rounded-2xl "
                />
                <div className="absolute -top-10 right-0 opacity-30 animate-movingY lg:top-0">
                  <i className="ri-leaf-line text-6xl text-yellow-400"></i>
                </div>
                <div className="absolute bottom-0 left-0 opacity-30 xl:bottom-12 animate-rotating">
                  <i className="ri-flower-line text-6xl text-yellow-400"></i>
                </div>
                <div className="hidden absolute -top-10 -left-5 opacity-30 lg:block animate-scaleUp lg:top-5">
                  <i className="ri-plant-line text-6xl text-yellow-500"></i>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="bg-white text-green-900 py-20">
          <div className="container mx-auto px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-2xl max-sm:text-xl">
            {dataLading.map((item) => (
              <div className="border border-green-900 p-5 cursor-pointer rounded-md hover:shadow-2xl hover:-translate-y-1 duration-300 space-y-5 flex flex-col items-center justify-center">
                <div className="text-center text-5xl max-sm:text-3xl">
                  {item.icon}
                </div>
                <p className="md:text-lg font-bold text-green-950/60">
                  {item.title}
                </p>
                <p className="font-lobster text-4xl">{item.content}</p>
              </div>
            ))}
          </div>
        </div>

        <section id="about" className="relative overflow-hidden">
          <div className="absolute -top-8 -right-12 opacity-50">
            <img src={leaf3} alt="leaf3" className="w-40 md:w-60 lg:w-80" />
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center mb-10 md:mb-20">
            <h2 className="title-landing">About Us</h2>
            <p className="max-w-2xl">Follow us for more</p>
          </div>
          <div className="container space-y-10 xl:space-y-0 mx-auto">
            <div className="flex flex-col items-center justify-center gap-5 lg:flex-row">
              <div className="w-full lg:w-1/2 lg:w-1/2">
                <img
                  src={plant1}
                  className="w-full sm:w-2/3 lg:w-full xl:w-2/3 mx-auto"
                />
              </div>
              <div className="w-full lg:w-1/2">
                <div className="space-y-5">
                  <h3>
                    🌍 Empowering{" "}
                    <span className="text-sky-200">Communities</span>
                  </h3>
                  <p className="font-lobster">
                    VolunteerHub is a community platform that connects
                    passionate individuals with meaningful volunteer
                    opportunities. We believe that every small action creates a
                    ripple of change — whether it’s planting trees, supporting
                    local causes, or organizing impactful events.
                  </p>
                </div>
              </div>
            </div>{" "}
            <div className="flex flex-col items-center justify-center gap-5 lg:flex-row">
              <div className="w-full lg:w-1/2 lg:w-1/2 order-1">
                <img
                  src={plant2}
                  className="w-full sm:w-2/3 lg:w-full xl:w-2/3 mx-auto"
                />
              </div>
              <div className="w-full lg:w-1/2 order-0">
                <div className="space-y-5">
                  <h3>
                    Make your <span className="text-yellow-500">green</span>{" "}
                    space
                  </h3>
                  <p className="font-lobster">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Rerum inventore, autem porro blanditiis dolore laborum nam
                    omnis dolores optio sapiente velit vero consequuntur
                    accusantium fugiat quisquam quos. Repudiandae, doloribus
                    voluptatum!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="review" className="py-20">
          <div className="flex flex-col items-center gap-3 text-center mb-10 md:mb-20">
            <h2 className="title-landing">Customer Review</h2>
            <p className="max-w-2xl">Follow instruction for more</p>
          </div>

          <div className="container mx-auto px-6">
            <Swiper
              modules={[Pagination, Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="mt-20 pb-12"
            >
              <SwiperSlide>
                <div className="flex flex-col gap-5 bg-green-900 rounded-md p-6 hover:-translate-y-1 hover:scale-105 duration-300">
                  <p className="font-lobster">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nihil repellat, fugiat dolorem dolores sequi quae veritatis
                    libero ullam ut quo eaque omni
                  </p>
                  <div className="flex items-center">
                    <img
                      src={review1}
                      alt="reviewer"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-2">
                      <p>John doe</p>
                      <p>Designer</p>
                    </div>
                    <i className="ri-double-quotes-r text-4xl ml-auto"></i>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="flex flex-col gap-5 bg-green-900 rounded-md p-6 hover:-translate-y-1 hover:scale-105 duration-300">
                  <p className="font-lobster">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nihil repellat, fugiat dolorem dolores sequi quae veritatis
                    libero ullam ut quo eaque omni
                  </p>
                  <div className="flex items-center">
                    <img
                      src={review1}
                      alt="reviewer"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-2">
                      <p>John doe</p>
                      <p>Designer</p>
                    </div>
                    <i className="ri-double-quotes-r text-4xl ml-auto"></i>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="flex flex-col gap-5 bg-green-900 rounded-md p-6 hover:-translate-y-1 hover:scale-105 duration-300">
                  <p className="font-lobster">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nihil repellat, fugiat dolorem dolores sequi quae veritatis
                    libero ullam ut quo eaque omni
                  </p>
                  <div className="flex items-center">
                    <img
                      src={review1}
                      alt="reviewer"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-2">
                      <p>John doe</p>
                      <p>Designer</p>
                    </div>
                    <i className="ri-double-quotes-r text-4xl ml-auto"></i>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="flex flex-col gap-5 bg-green-900 rounded-md p-6 hover:-translate-y-1 hover:scale-105 duration-300">
                  <p className="font-lobster">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nihil repellat, fugiat dolorem dolores sequi quae veritatis
                    libero ullam ut quo eaque omni
                  </p>
                  <div className="flex items-center">
                    <img
                      src={review1}
                      alt="reviewer"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-2">
                      <p>John doe</p>
                      <p>Designer</p>
                    </div>
                    <i className="ri-double-quotes-r text-4xl ml-auto"></i>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LandingPage;
