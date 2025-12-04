import React from 'react';
import { formatCurrency } from '../app/utils';

const BookCard = ({ book }) => {
    const {
        title,
        description,
        photoUrl,
        publisher,
        bookAuthors,
        bookCategories,
        stockQty,
        sellerPrice,
        rentPricePerDay,
        rentPricePerWeek,
        rentPricePerMonth,
        publishedAt,
        page,
        weight,
        language,
        status
    } = book;

    // Truncate description
    const truncateDescription = (text, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="bg-white hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col p-4">
            {/* Image */}
            <div className="w-full h-56 sm:h-64 md:h-72 lg:h-64 overflow-hidden">
                <img
                    src={photoUrl.replace('http://minio:9000', 'http://localhost:9000')}
                    alt={title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 flex flex-col flex-1">
                {/* Title */}
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-1 hover:text-blue-600 transition-colors">
                    {title}
                </h3>

                {/* Authors */}
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-1 mb-2">
                    {bookAuthors.map((a, i) => a.author.name + (i < bookAuthors.length - 1 ? ', ' : '')).join('')}
                </p>

                {/* Price */}
                <span className="text-red-600 font-bold mt-auto text-sm sm:text-base">
                    {formatCurrency(sellerPrice)}
                </span>
            </div>
        </div>


    );
};

export default BookCard;