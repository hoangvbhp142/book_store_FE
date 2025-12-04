// components/BannerCarousel.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BannerCarousel = ({ banners = [] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    // Lọc chỉ các banner active
    const activeBanners = banners.filter(banner => banner.status === 'active');

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // Auto play
    useEffect(() => {
        if (!isAutoPlay || activeBanners.length <= 1) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentSlide, isAutoPlay, activeBanners.length]);

    if (activeBanners.length === 0) {
        return (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Chưa có banner nào được kích hoạt</p>
            </div>
        );
    }

    return (
        <div
            className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-200 overflow-hidden"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
        >
            {/* Slides */}
            <div className="relative w-full h-full">
                {activeBanners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <a
                            href={banner.link}
                            className="block w-full h-full"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={banner.image}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay thông tin */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                                <h3 className="text-white text-xl font-bold mb-2">{banner.title}</h3>
                                <p className="text-gray-200 text-sm">{banner.position}</p>
                            </div>
                        </a>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {activeBanners.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-200"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-200"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {activeBanners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {activeBanners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentSlide ? 'bg-white' : 'bg-white/50'
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Slide Counter */}
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentSlide + 1} / {activeBanners.length}
            </div>
        </div>
    );
};

export default BannerCarousel;