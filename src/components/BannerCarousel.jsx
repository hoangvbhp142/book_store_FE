// components/BannerCarousel.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BannerCarousel = ({ banners = [] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    // Lọc banner đang active + trong thời gian hiệu lực
    const activeBanners = useMemo(() => {
        const now = new Date();

        return banners.filter(banner => {
            if (!banner.isActive) return false;
            return true;
        });
    }, [banners]);

    const nextSlide = () => {
        setCurrentSlide(prev => (prev + 1) % activeBanners.length);
    };

    const prevSlide = () => {
        setCurrentSlide(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // Reset slide khi banner thay đổi
    useEffect(() => {
        setCurrentSlide(0);
    }, [activeBanners.length]);

    // Auto play
    useEffect(() => {
        if (!isAutoPlay || activeBanners.length <= 1) return;

        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlay, activeBanners.length]);

    if (activeBanners.length === 0) {
        return (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Chưa có banner nào được kích hoạt</p>
            </div>
        );
    }

    return (
        <div
            className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
        >
            {/* Slides */}
            <div className="relative w-full h-full">
                {activeBanners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <a
                            href={banner.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full h-full"
                        >
                            <img
                                src={banner.imageUrl.replace('minio:9000', 'localhost:9000')}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                            />

                            {/* Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                                <h3 className="text-white text-xl font-bold mb-1">
                                    {banner.title}
                                </h3>
                                <p className="text-gray-200 text-sm">
                                    {banner.position}
                                </p>
                            </div>
                        </a>
                    </div>
                ))}
            </div>

            {/* Navigation */}
            {activeBanners.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </>
            )}

            {/* Dots */}
            {activeBanners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {activeBanners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white/50'
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Counter */}
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentSlide + 1} / {activeBanners.length}
            </div>
        </div>
    );
};

export default BannerCarousel;
