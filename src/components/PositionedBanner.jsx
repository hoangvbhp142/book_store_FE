import React from 'react';

const PositionedBanner = ({ banners = [], position = 'Trang chủ' }) => {
    const filteredBanners = banners
        .filter(banner => banner.position === position && banner.status === 'active')
        .sort((a, b) => a.order - b.order);

    if (filteredBanners.length === 0) {
        return null;
    }

    return (
        <div className="my-6">
            {filteredBanners.map((banner) => (
                <div key={banner.id} className="mb-4 last:mb-0">
                    <a
                        href={banner.link}
                        className="block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-full h-auto object-cover"
                        />
                    </a>
                </div>
            ))}
        </div>
    );
};

export default PositionedBanner;