import { Link, useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye
} from 'lucide-react';
import PagingBar from '../../components/PagingBar'
import books from '../../data/Books'

const AdminBooksPage = () => {

    const navigate = useNavigate();

    console.log(books.slice(0, 5));


    return (
        // <div className="min-h-screen flex flex-col">

        <main className="flex-1 bg-gray-50/30 h-screen">
            <div className="container mx-auto">
                <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-200 mb-5">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search by title, author, or ISBN..."
                                className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 hover:bg-white"
                            />
                        </div>

                        <div className="flex gap-3 flex-shrink-0">
                            <select className="px-4 py-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 hover:bg-white transition-all min-w-[140px]"> {/* Thêm min-w cho select không quá nhỏ */}
                                <option>All Categories</option>
                            </select>
                            <select className="px-4 py-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 hover:bg-white transition-all min-w-[120px]">
                                <option>All Status</option>
                            </select>
                        </div>

                        <div className='flex items-center justify-end'>
                            <Link
                                to="/admin/add-new-book"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Thêm sách mới
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sách</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá bán</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá thuê</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {books.slice(0, 6).map((book) => (
                                        <tr key={book.id}>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <img src={book.image} alt="" />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{book.title}</p>
                                                    <p className="text-sm text-gray-500">by {book.author} | {book.category}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${book.salePrice}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${book.rentalPrice}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={
                                                    book.quantity === 0
                                                        ? "text-red-600 font-semibold"
                                                        : book.quantity < 5
                                                            ? "text-orange-600 font-semibold"
                                                            : "text-gray-900"
                                                }>
                                                    {book.quantity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${book.status === true
                                                    ? book.quantity > 5
                                                        ? "bg-green-100 text-green-800"
                                                        : book.quantity === 0
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}>
                                                    {book.status === true
                                                        ? book.quantity > 5
                                                            ? "Active"
                                                            : book.quantity === 0
                                                                ? "Out of stock"
                                                                : "Low stock"
                                                        : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-1 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                                                        <Link to={`/book/${book.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                        <span className="sr-only">View</span>
                                                    </button>
                                                    <button className="p-1 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                                                        onClick={() => navigate(`/admin/books/${book.id}/edit`)}>
                                                        <Edit className="h-4 w-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </button>
                                                    <button className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                            <p className="text-sm text-gray-600">Showing 1-8 of 234 books</p>
                            <PagingBar pageSize={5} totalPages={2} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
        // </div>
    );
}
export default AdminBooksPage;