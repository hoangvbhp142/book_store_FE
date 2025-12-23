import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye
} from 'lucide-react';
import PagingBar from '../../components/PagingBar';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { fetchBooks, deleteBook } from '../../stores/bookSlice';
import AdvancedPagingBar from '../../components/AdvancedPagingBar';

const AdminBooksPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // State cho search và filter
    const [selectedCategory, setSelectedCategory] = useState('all');

    const [searchParams, setSearchParams] = useSearchParams();
    const [params, setParams] = useState({
        sort: searchParams.get("sort") || "name:asc",
        q: searchParams.get("q") || "",
        limit: Number(searchParams.get("limit") || 10),
        page: Number(searchParams.get("page") || 1),
        filter: {
            status: searchParams.get("status") || ""
        }
    });

    // ==========EVENT HANDLER ==========
    const updateParams = (patch) => {
        const next = {
            ...params,
            ...patch,
            filter: {
                ...params.filter,
                ...(patch.filter || {})
            }
        };
        setParams(next);

        // Đồng bộ lên URL
        const toSet = {
            ...(next.sort ? { sort: next.sort } : {}),
            ...(next.q ? { q: next.q } : {}),
            ...(next.page !== 0 ? { page: next.page } : {}),
            ...(next.limit !== 0 ? { limit: next.limit } : {}),
            ...(next.filter.status ? { status: next.filter.status } : {})
        };

        console.log(toSet);

        setSearchParams(toSet);
    };


    const { bookList, loading, error, meta } = useSelector(state => state.books);

    const fetchBookList = () => {
        try {
            const finalParams = {
                ...params,
                filter: JSON.stringify(params.filter || {})
            }
            console.log(finalParams);

            dispatch(fetchBooks({ params: finalParams, isAdmin: true }));
        } catch (error) {
            console.log(error);
            toast.error(error.message || 'Lỗi khi tải danh sách sách');
        }
    };

    useEffect(() => {
        fetchBookList();
    }, [dispatch, params]); // Refetch khi filter thay đổi

    // Xử lý xóa sách
    const handleDeleteBook = async (bookId) => {
        if (window.confirm('Bạn có chắc muốn xóa sách này?')) {
            try {
                await dispatch(deleteBook(bookId)).unwrap();
                toast.success('Xóa sách thành công');
                fetchBookList(); // Refresh danh sách
            } catch (error) {
                toast.error(error.message || 'Lỗi khi xóa sách');
            }
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount || 0);
    };

    // Get status display
    const getStatusDisplay = (book) => {
        const statusMap = {
            'DRAFT': { text: 'Bản nháp', color: 'bg-gray-100 text-gray-800' },
            'PUBLISHED': {
                text: book.stockQty > 0 ? 'Đang bán' : 'Hết hàng',
                color: book.stockQty > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            },
            'ARCHIVED': { text: 'Đã lưu trữ', color: 'bg-yellow-100 text-yellow-800' }
        };

        return statusMap[book.status] || statusMap.DRAFT;
    };

    return (
        <main className="flex-1 bg-gray-50/30 min-h-screen">
            <div className="container mx-auto p-4">

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Sách</h1>
                    </div>
                </div>
                {/* Search and Filter Section */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">

                    {/* SEARCH */}
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên sách, mô tả..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 hover:bg-white"
                            value={params.q}
                            onChange={(e) => updateParams({ q: e.target.value })}
                        />
                    </div>

                    {/* FILTERS */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">        

                        {/* STATUS */}
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 hover:bg-white transition-all flex-1 lg:min-w-[120px]"
                            value={params.filter.status || ""}
                            onChange={(e) => {
                                const status = e.target.value;
                                updateParams({
                                    filter: {
                                        status: status
                                    }
                                })
                            }}
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="DRAFT">Bản nháp</option>
                            <option value="PUBLISHED">Đang bán</option>
                            <option value="ARCHIVED">Đã lưu trữ</option>
                        </select>

                        {/* SORT — BỔ SUNG MỚI */}
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 hover:bg-white transition-all flex-1 lg:min-w-[150px]"
                            value={params.sort || ""}
                            onChange={(e) => updateParams({ sort: e.target.value })}
                        >
                            <option value="">Sắp xếp mặc định</option>
                            <option value="title:asc">Tên A → Z</option>
                            <option value="title:desc">Tên Z → A</option>
                            <option value="price:asc">Giá thấp → cao</option>
                            <option value="price:desc">Giá cao → thấp</option>
                            <option value="createdAt:desc">Mới nhất</option>
                            <option value="createdAt:asc">Cũ nhất</option>
                        </select>

                    </div>

                    {/* ADD NEW BOOK BUTTON */}
                    <div className='flex items-center justify-end w-full lg:w-auto'>
                        <Link
                            to="/admin/books/add-new-book"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Thêm sách mới
                        </Link>
                    </div>
                </div>

                {/* Books Table */}
                <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sách</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá bán</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá thuê</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bookList && bookList.length > 0 ? (
                                        bookList.map((book) => {
                                            const statusInfo = getStatusDisplay(book);
                                            return (
                                                <tr key={book.id} className="hover:bg-gray-50">
                                                    <td className='px-6 py-4 whitespace-nowrap'>
                                                        <img
                                                            src={book.photoUrl ? book.photoUrl.replace('http://minio:9000', 'http://localhost:9000') : ''}
                                                            alt={book.title}
                                                            className="h-20 w-20 object-contain rounded-lg"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{book.title}</p>
                                                            <p className="text-sm text-gray-500">
                                                                {book.bookAuthors?.map(author => author.author.name).join(', ') || 'Chưa có tác giả'}
                                                            </p>
                                                            <p className="text-xs text-gray-400">ISBN: {book.isbn}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                        {formatCurrency(book.sellerPrice)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                        {formatCurrency(book.rentPricePerMonth)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={
                                                            book.stockQty === 0
                                                                ? "text-red-600 font-semibold"
                                                                : book.stockQty < 5
                                                                    ? "text-orange-600 font-semibold"
                                                                    : "text-gray-900"
                                                        }>
                                                            {book.stockQty}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                            {statusInfo.text}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link
                                                                to={`/book/${book.id}`}
                                                                className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                            <button
                                                                className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                                                                onClick={() => navigate(`/admin/books/${book.id}/edit`)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
                                                                onClick={() => handleDeleteBook(book.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                                Không tìm thấy sách nào
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                            <p className="text-sm text-gray-600">
                                Hiển thị {bookList?.length || 0} sách
                            </p>
                            <AdvancedPagingBar
                                meta={meta}
                                onPageChange={(page) => updateParams({ page: page })}
                                onLimitChange={(limit) => updateParams({ limit: limit, page: 1 })} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AdminBooksPage;