import React from 'react'
import { Link } from 'react-router-dom'
import { Filter, Search, BookOpenIcon, CalendarIcon, CheckCircleIcon } from 'lucide-react';

import { useState } from 'react';

const genres = ["All", "Classic Literature", "Dystopian Fiction", "Romance", "Coming of Age", "Fantasy"]

const Hero = () => {
    return (
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-14 sm:py-20 md:py-24 overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-8 left-8 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute bottom-8 right-8 w-36 h-36 bg-indigo-200 rounded-full opacity-30 blur-2xl"></div>

            <div className="relative container mx-auto px-4 sm:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Heading */}
                    <h1 className="font-sans text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-5 leading-snug sm:leading-tight">
                        Khám phá thế giới sách
                    </h1>

                    {/* Subtext */}
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                        Hàng ngàn tựa sách hay – linh hoạt giữa <span className="text-blue-600 font-semibold">mua</span> và <span className="text-green-600 font-semibold">thuê</span> phù hợp nhu cầu của bạn.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
                        <Link
                            to="/store"
                            className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-md hover:bg-blue-700 hover:shadow-blue-200 hover:scale-[1.03] active:scale-100 transition-all flex items-center justify-center gap-2"
                        >
                            <BookOpenIcon className="h-5 w-5" />
                            Khám phá ngay
                        </Link>

                        <Link
                            to="/rent"
                            className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-blue-400 hover:text-blue-600 hover:scale-[1.03] active:scale-100 transition-all flex items-center justify-center gap-2"
                        >
                            <CalendarIcon className="h-5 w-5" />
                            Tìm sách thuê
                        </Link>
                    </div>

                    {/* Info List */}
                    <div className="mt-12 flex flex-wrap justify-center gap-6 sm:gap-10 text-sm sm:text-base text-gray-500">
                        {[
                            'Đa dạng thể loại',
                            'Giao hàng nhanh chóng',
                            'Giá cả hợp lý',
                        ].map((text, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
