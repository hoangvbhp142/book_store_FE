import React, { useEffect, useState } from 'react'

import { Star } from 'lucide-react';

const ReviewModel = ({ isEdit, onSubmit, onClose, reviewData }) => {


    const [formData, setFormData] = useState({
        rating: 5,
        comment: ''
    })

    const [currentRating, setCurrentRating] = useState(formData.rating || 0);

    const handleMouseEnter = (rating) => {
        setCurrentRating(rating);
        formData.rating = rating;
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4 max-w-lg mx-auto">
            {/* --- Chọn sao --- */}
            <div className="flex items-center justify-center gap-0.5">
                {Array.from({ length: 5 }, (_, index) => index + 1).map((i, star) => (
                    <Star
                        key={star}
                        className={`h-6 w-6 cursor-pointer ${i <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-400 text-gray-400'} hover:scale-110 transition-transform duration-150`}
                        onMouseEnter={() => handleMouseEnter(i)}
                    />
                ))}
            </div>

            {/* --- Nhập nội dung đánh giá --- */}
            <div>
                <textarea
                    rows={6}
                    placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                ></textarea>
            </div>

            {/* --- Hành động --- */}
            <div className="flex justify-end gap-2">
                <button
                    onClick={onClose}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    Hủy
                </button>
                <button className="px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all">
                    Gửi đánh giá
                </button>
            </div>
        </div>


    )
}

export default ReviewModel
