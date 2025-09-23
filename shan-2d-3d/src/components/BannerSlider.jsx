import React, { useState, useEffect } from 'react';

const BannerSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const banners = [
        {
            id: 1,
            title: "Welcome to SKM WebDelight",
            subtitle: "Your Ultimate Gaming Experience",
            image: "/TemplateData/banner/b1.png",
            bgColor: "from-purple-600 to-blue-600"
        },
        {
            id: 2,
            title: "Shan Komee Games",
            subtitle: "Experience Traditional Myanmar Gaming",
            image: "/TemplateData/banner/b2.png",
            bgColor: "from-gold to-yellow-400"
        },
        {
            id: 3,
            title: "2D & 3D Lottery",
            subtitle: "Try Your Luck Today",
            image: "/TemplateData/banner/b3.png",
            bgColor: "from-green-600 to-teal-600"
        },
        {
            id: 4,
            title: "Slot Games",
            subtitle: "Spin and Win Big",
            image: "/TemplateData/banner/b4.png",
            bgColor: "from-red-600 to-pink-600"
        },
        {
            id: 5,
            title: "Premium Gaming",
            subtitle: "Join the Ultimate Gaming Community",
            image: "/TemplateData/banner/b5.png",
            bgColor: "from-indigo-600 to-purple-600"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [banners.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };

    return (
        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-2xl mb-6">
            {/* Banner Slides */}
            <div className="relative w-full h-full">
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <div className="w-full h-full flex items-center justify-center relative">
                            {/* Background Image */}
                            <div 
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${banner.image})` }}
                            />
                            
                            {/* Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgColor} bg-opacity-70`} />
                            
                            {/* Content */}
                            <div className="relative z-10 text-center text-white px-6">
                                <h2 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                                    {banner.title}
                                </h2>
                                <p className="text-lg md:text-xl opacity-90 drop-shadow-md">
                                    {banner.subtitle}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                    />
                ))}
            </div>
            
        </div>
    );
};

export default BannerSlider;
