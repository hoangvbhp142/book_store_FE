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
        discountPrice, // Thêm
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

    // Tính phần trăm giảm giá
    const calculateDiscountPercent = () => {
        if (!discountPrice || discountPrice >= sellerPrice) return 0;
        return Math.round(((sellerPrice - discountPrice) / sellerPrice) * 100);
    };

    const discountPercent = calculateDiscountPercent();
    const hasDiscount = discountPercent > 0;

    return (
        <div className="bg-white hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col p-4 relative">
            {/* Discount Badge */}
            {hasDiscount && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                    -{discountPercent}%
                </div>
            )}

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
                <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-1 hover:text-blue-600 transition-colors">
                    {title}
                </h3>

                {/* Authors */}
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-1 mb-2">
                    {bookAuthors.map((a, i) => a.author.name + (i < bookAuthors.length - 1 ? ', ' : '')).join('')}
                </p>

                {/* Price */}
                <div className="mt-auto">
                    {hasDiscount ? (
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-red-600 font-bold text-base sm:text-lg">
                                {formatCurrency(discountPrice)}
                            </span>
                            <span className="text-gray-400 line-through text-xs sm:text-sm">
                                {formatCurrency(sellerPrice)}
                            </span>
                        </div>
                    ) : (
                        <span className="text-red-600 font-bold text-sm sm:text-base">
                            {formatCurrency(sellerPrice)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookCard;