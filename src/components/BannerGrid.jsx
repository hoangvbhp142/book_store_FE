// components/BannerGrid.jsx
import React, { useMemo } from 'react';

const BannerGrid = ({ banners = [] }) => {

  return (
    <div className="mb-8">
      <div
        className={`grid gap-4 ${banners.length === 1
            ? 'grid-cols-1'
            : banners.length === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}
      >
        {banners.map(banner => (
          <div
            key={banner.id}
            className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <a
              href={banner.link}
              className="block aspect-video bg-gray-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={banner.imageUrl.replace('minio:9000', 'localhost:9000')}
                alt={banner.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </a>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <h3 className="text-white font-semibold text-lg">
                {banner.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerGrid;
