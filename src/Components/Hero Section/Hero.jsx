import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, Parallax } from 'swiper/modules';
import { useTheme } from '../../contexts/ThemeContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/parallax';

const Hero = () => {
  const { isDarkMode } = useTheme();
  const swiperRef = useRef(null);

  const slides = [
    {
      id: 1,
      image: 'https://www.ajsupplements.com/static/1.jpeg',
      title: 'Nutrivolent',
      subtitle: 'Advanced Nutritional Solutions for Livestock',
      description: 'Partner with us to unlock the full potential of your livestock and drive sustainable business growth through our advanced nutritional strategies. Revolutionize your livestock\'s health and productivity by collaborating with the industry leader in performance trace minerals and innovative nutritional solutions.'
    },
    {
      id: 2,
      image: 'https://www.ajsupplements.com/static/2.jpg',
      title: 'Premium Quality',
      subtitle: 'Science-Backed Supplements for Animal Health',
      description: 'Our cutting-edge research and development team creates premium nutritional supplements that enhance animal performance, boost immunity, and ensure optimal health. Trust in our certified quality standards and proven results.'
    },
    {
      id: 3,
      image: 'https://www.ajsupplements.com/static/3.jpeg',
      title: 'Global Excellence',
      subtitle: 'Worldwide Distribution & Expert Support',
      description: 'With decades of experience in animal nutrition, we provide comprehensive solutions for farmers, veterinarians, and agricultural professionals worldwide. Our global network ensures reliable supply and expert technical support.'
    }
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, Autoplay, EffectFade, Parallax]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          stopOnLastSlide: false,
        }}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        parallax={true}
        navigation={{
          nextEl: '.swiper-button-next-custom, .swiper-button-next-custom-mobile',
          prevEl: '.swiper-button-prev-custom, .swiper-button-prev-custom-mobile',
        }}
        pagination={{
          el: '.swiper-pagination-custom',
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 3,
        }}
        speed={1200}
        allowTouchMove={true}
        touchRatio={1}
        touchAngle={45}
        grabCursor={true}
        preventClicks={false}
        preventClicksPropagation={false}
        slideToClickedSlide={false}
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative">
            {/* Background Image with Parallax */}
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${slide.image})`,
                filter: isDarkMode ? 'brightness(0.5) saturate(1.1)' : 'brightness(0.7) saturate(1.1)',
                transform: 'scale(1.1)',
                transition: 'transform 8s ease-out, filter 0.5s ease'
              }}
              data-swiper-parallax="-300"
            />
            
            {/* Enhanced Gradient Overlays - Reduced Opacity */}
            <div 
              className={`absolute inset-0 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-black/60 via-black/45 to-black/55' 
                  : 'bg-gradient-to-br from-black/45 via-black/30 to-black/40'
              }`}
              data-swiper-parallax="-100"
            />
            
            <div 
              className={`absolute inset-0 ${
                isDarkMode 
                  ? 'bg-gradient-to-t from-transparent via-transparent to-black/20' 
                  : 'bg-gradient-to-t from-transparent via-transparent to-black/10'
              }`}
              data-swiper-parallax="-50"
            />

            {/* Content with Parallax Effects */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              {/* Subtle background for text readability */}
              <div 
                className={`absolute inset-0 ${
                  isDarkMode 
                    ? 'bg-black/20' 
                    : 'bg-black/10'
                }`}
                data-swiper-parallax="-150"
              />
              
              <div 
                className="text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10"
                data-swiper-parallax="-200"
              >
                {/* Animated Title */}
                <h1 
                  className={`text-5xl sm:text-6xl lg:text-8xl font-bold mb-8 transition-all duration-1000 ease-smooth animate-slideInFromBottom ${
                    isDarkMode ? 'text-white' : 'text-white'
                  }`} 
                  style={{
                    textShadow: isDarkMode 
                      ? '0 8px 40px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.7)' 
                      : '0 8px 40px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.6)'
                  }}
                  data-swiper-parallax="-300"
                >
                  <span className="inline-block hover:scale-105 transition-all duration-700 ease-smooth hover:text-blue-200">
                    {slide.title}
                  </span>
                </h1>
                
                {/* Animated Subtitle */}
                <h2 
                  className={`text-2xl sm:text-3xl lg:text-5xl font-semibold mb-10 transition-all duration-1000 ease-smooth animate-slideInFromLeft ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-200'
                  }`} 
                  style={{
                    textShadow: isDarkMode 
                      ? '0 6px 25px rgba(0,0,0,0.8), 0 3px 15px rgba(0,0,0,0.6)' 
                      : '0 6px 25px rgba(0,0,0,0.7), 0 3px 15px rgba(0,0,0,0.5)'
                  }}
                  data-swiper-parallax="-250"
                >
                  <span className="inline-block hover:scale-105 transition-all duration-700 ease-smooth hover:text-blue-100">
                    {slide.subtitle}
                  </span>
                </h2>
                
                {/* Animated Description */}
                <p 
                  className={`text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-5xl mx-auto transition-all duration-1000 ease-smooth animate-slideInFromRight ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-50'
                  }`} 
                  style={{
                    textShadow: isDarkMode 
                      ? '0 4px 20px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.6)' 
                      : '0 4px 20px rgba(0,0,0,0.7), 0 2px 10px rgba(0,0,0,0.5)'
                  }}
                  data-swiper-parallax="-200"
                >
                  {slide.description}
                </p>

                {/* Enhanced Call to Action Button */}
                <div 
                  className="mt-16 animate-slideInFromBottom" 
                  data-swiper-parallax="-150"
                >
                  <button className={`group relative px-12 py-6 rounded-full font-bold text-xl transition-all duration-1000 ease-smooth hover:scale-110 hover:shadow-glow-xl ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white shadow-2xl' 
                      : 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-400 hover:via-blue-500 hover:to-blue-600 text-white shadow-2xl'
                  }`}>
                    {/* <span className="relative z-10 transition-all duration-500 ease-smooth group-hover:scale-105">Partner With Us</span> */}
                    <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 ease-smooth ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700' 
                        : 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons - Desktop */}
        <div className="swiper-button-prev-custom absolute left-8 top-1/2 -translate-y-1/2 z-20 group hidden md:block">
          <button className={`p-4 rounded-full transition-all duration-700 ease-smooth hover:scale-125 hover:shadow-glow-xl ${
            isDarkMode 
              ? 'bg-gray-900/90 hover:bg-gray-800/95 text-white backdrop-blur-md' 
              : 'bg-white/90 hover:bg-white/95 text-gray-800 backdrop-blur-md'
          }`}>
            <svg className="w-7 h-7 transition-all duration-500 ease-smooth group-hover:-translate-x-1 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className="swiper-button-next-custom absolute right-8 top-1/2 -translate-y-1/2 z-20 group hidden md:block">
          <button className={`p-4 rounded-full transition-all duration-700 ease-smooth hover:scale-125 hover:shadow-glow-xl ${
            isDarkMode 
              ? 'bg-gray-900/90 hover:bg-gray-800/95 text-white backdrop-blur-md' 
              : 'bg-white/90 hover:bg-white/95 text-gray-800 backdrop-blur-md'
          }`}>
            <svg className="w-7 h-7 transition-all duration-500 ease-smooth group-hover:translate-x-1 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Buttons - Bottom */}
        <div className="swiper-button-prev-custom-mobile absolute bottom-8 left-1/2 -translate-x-16 z-20 group md:hidden">
          <button className={`p-3 rounded-full transition-all duration-700 ease-smooth hover:scale-125 hover:shadow-glow-xl ${
            isDarkMode 
              ? 'bg-gray-900/90 hover:bg-gray-800/95 text-white backdrop-blur-md' 
              : 'bg-white/90 hover:bg-white/95 text-gray-800 backdrop-blur-md'
          }`}>
            <svg className="w-6 h-6 transition-all duration-500 ease-smooth group-hover:-translate-x-1 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className="swiper-button-next-custom-mobile absolute bottom-8 left-1/2 translate-x-4 z-20 group md:hidden">
          <button className={`p-3 rounded-full transition-all duration-700 ease-smooth hover:scale-125 hover:shadow-glow-xl ${
            isDarkMode 
              ? 'bg-gray-900/90 hover:bg-gray-800/95 text-white backdrop-blur-md' 
              : 'bg-white/90 hover:bg-white/95 text-gray-800 backdrop-blur-md'
          }`}>
            <svg className="w-6 h-6 transition-all duration-500 ease-smooth group-hover:translate-x-1 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Custom Pagination */}
        {/* <div className="swiper-pagination-custom absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20"></div> */}
      </Swiper>
    </div>
  );
};

export default Hero;