import { Star } from 'lucide-react'
import sach1 from '../assets/sach1.jpg'
import utils from '../app/utils'
const BookCard = ({ book, i }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="aspect-[2/3] bg-gray-100 relative overflow-hidden">
                <img
                    src={book?.image || sach1}
                    alt={`Book ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {i % 3 === 0 && (
                    <span className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">New</span>
                )}
                {i % 5 === 0 && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">Sale</span>
                )}
            </div>
            <div className="p-4 space-y-2">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-blue-600 transition-colors duration-200">
                    The Great Novel
                </h3>
                <p className="text-xs text-gray-600">Author Name</p>
                <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium text-gray-900">{(4 + Math.random()).toFixed(1)}</span>
                    <span className="text-xs text-gray-500">
                        ({Math.floor(Math.random() * 500 + 50)})
                    </span>
                </div>
                <div className="space-y-1 pt-2">
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-sm">{utils.formatCurrency(book.discountPrice ? book.discountPrice : book.salePrice)}</span>
                        {book.discountPrice && (
                            <span className="text-xs text-gray-500 line-through">{utils.formatCurrency(book.salePrice)}</span>
                        )}
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                        Thuê: {utils.formatCurrency(book.rentalPrice)}/tháng
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookCard
