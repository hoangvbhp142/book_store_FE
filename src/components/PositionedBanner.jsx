import React, { useMemo } from 'react';

const PositionedBanner = ({ banners = [] }) => {

    const activeBanners = useMemo(() => {
        const now = new Date();

        return banners
            .filter(banner => {
                if (!banner.isActive) return false;

                const start = banner.startDate ? new Date(banner.startDate) : null;
                const end = banner.endDate ? new Date(banner.endDate) : null;

                if (start && now < start) return false;
                if (end && now > end) return false;

                return true;
            })
            .sort((a, b) => a.sortOrder - b.sortOrder);
    }, [banners]);

    if (activeBanners.length === 0) {
        return null;
    }

    return (
        <div className="my-6">
            {activeBanners.map(banner => (
                <div key={banner.id} className="mb-4 last:mb-0">
                    <a
                        href={banner.link}
                        className="block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={banner.imageUrl.replace('minio:9000', 'localhost:9000')}
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
