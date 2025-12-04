import React from 'react'
import { formatCurrency } from '../app/utils'

const FeaturedBook = ({ bookList }) => {
    return (
        <div className="bg-white space-y-2.5 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 p-4 border-gray-200 uppercase tracking-wide">
                SÁCH MỚI BÁN CHẠY
            </h3>

            {bookList.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {bookList.map((book) => (
                        <div
                            key={book.id}
                            className="flex items-center gap-3 py-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer hover:border-gray-200 hover:shadow-sm"
                        >
                            <div className="flex-shrink-0 w-28 h-28">
                                <img
                                    src={book.photoUrl.replace('http://minio:9000', 'http://localhost:9000')}
                                    alt={book.title}
                                    className="w-full h-full object-fit shadow-sm"
                                />
                            </div>
                            <div className="flex-1 flex flex-col min-h-28 gap-2">
                                <h3 className="text-sm font-medium text-gray-800 line-clamp-1 leading-snug">
                                    {book.title}
                                </h3>
                                <p className="">
                                    <span className="text-red-600 font-bold text-base">
                                        {formatCurrency(book.sellerPrice)}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-6">Chưa có sách nào</p>
            )}
        </div>
    )
}

export default FeaturedBook