import React, { useEffect, useState } from 'react'
import { Star } from 'lucide-react';

const ReviewModel = ({ isEdit, onSubmit, onClose, reviewData, bookId }) => {

    const [formData, setFormData] = useState({
        bookId: bookId || "",
        rating: 0,
        title: "",
        body: ""
    })

    const [currentRating, setCurrentRating] = useState(0);
    const [errors, setErrors] = useState({});

    // Fill form data when in edit mode or when reviewData changes
    useEffect(() => {
        if (reviewData) {
            setFormData({
                bookId: reviewData.bookId || bookId,
                rating: reviewData.rating || 0,
                title: reviewData.title || "",
                body: reviewData.body || ""
            });
            setCurrentRating(reviewData.rating || 0);
        }
    }, [reviewData, bookId]);

    const handleMouseEnter = (rating) => {
        setCurrentRating(rating);
    }

    const handleMouseLeave = () => {
        setCurrentRating(formData.rating);
    }

    const handleRatingClick = (rating) => {
        setFormData(prev => ({
            ...prev,
            rating: rating
        }));
        setCurrentRating(rating);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    }

    const validateForm = () => {
        const newErrors = {};

        if (formData.rating === 0) {
            newErrors.rating = "Vui lòng chọn số sao đánh giá";
        }

        if (!formData.title.trim()) {
            newErrors.title = "Vui lòng nhập tiêu đề đánh giá";
        } else if (formData.title.length < 5) {
            newErrors.title = "Tiêu đề phải có ít nhất 5 ký tự";
        }

        if (!formData.body.trim()) {
            newErrors.body = "Vui lòng nhập nội dung đánh giá";
        } else if (formData.body.length < 10) {
            newErrors.body = "Nội dung đánh giá phải có ít nhất 10 ký tự";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Ensure bookId is set
        const submitData = {
            ...formData,
            bookId: bookId || formData.bookId
        };

        onSubmit(submitData);
    }

    const displayRating = currentRating || formData.rating;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 max-w-lg mx-auto">
            {/* Header */}
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                    {isEdit ? "Chỉnh sửa đánh giá" : "Đánh giá sản phẩm"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    Chia sẻ cảm nhận của bạn về sản phẩm
                </p>
            </div>

            {/* Rating Section */}
            <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingClick(star)}
                            onMouseEnter={() => handleMouseEnter(star)}
                            onMouseLeave={handleMouseLeave}
                            className="p-1 rounded-full transition-all hover:scale-110"
                        >
                            <Star
                                className={`h-8 w-8 transition-colors ${star <= displayRating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-300 text-gray-300'
                                    }`}
                            />
                        </button>
                    ))}
                </div>
                {formData.rating > 0 && (
                    <p className="text-sm text-gray-600">
                        Bạn đã chọn {formData.rating} sao
                    </p>
                )}
                {errors.rating && (
                    <p className="text-sm text-red-600 mt-1">{errors.rating}</p>
                )}
            </div>

            {/* Title Input */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề đánh giá *
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Sách rất hay, đáng đọc!"
                    className={`w-full p-3 border rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                )}
            </div>

            {/* Content Textarea */}
            <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung đánh giá *
                </label>
                <textarea
                    id="body"
                    name="body"
                    rows={6}
                    value={formData.body}
                    onChange={handleInputChange}
                    placeholder="Chia sẻ chi tiết cảm nhận của bạn về sản phẩm..."
                    className={`w-full p-3 border rounded-lg text-gray-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.body ? 'border-red-500' : 'border-gray-300'
                        }`}
                ></textarea>
                {errors.body && (
                    <p className="text-sm text-red-600 mt-1">{errors.body}</p>
                )}
                <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                        {formData.body.length}/500 ký tự
                    </span>
                    {formData.body.length < 10 && (
                        <span className="text-xs text-gray-500">
                            Ít nhất 10 ký tự
                        </span>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                >
                    Hủy bỏ
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                >
                    {isEdit ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                </button>
            </div>
        </div>
    )
}

export default ReviewModel