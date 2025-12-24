import { Link } from 'react-router-dom';
import {
    Search,
    Eye,
    Calendar,
    AlertCircle,
    CheckCircle,
    Clock,
    HelpCircle
} from 'lucide-react';
import PagingBar from '../../components/PagingBar';
import { useState, useEffect } from 'react';
import { formatCurrency } from '../../app/utils';
import { toast } from 'react-toastify';
import adminRentalApi from '../../api/adminRentalApi';

const AdminRentalsPage = () => {
    const [rentals, setRentals] = useState([]);

    const [params, setParams] = useState({
        page: 1,
        limit: 10,
    });
    const [meta, setMeta] = useState({});

    const fetchRentals = async () => {
        try {
            const response = await adminRentalApi.getAllRentalItems(params);
            console.log(response);
            setRentals(response.data);
            setMeta(response.meta);
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Đã có lỗi xảy ra khi tải dữ liệu.");
        }
    }

    useEffect(() => {
        fetchRentals();
    }, [params]);

    // Hàm chuyển đổi state từ API thành status hiển thị
    const getDisplayStatus = (state, actualReturnDate) => {
        // Nếu đã có ngày trả thực tế thì là "Returned"
        if (actualReturnDate) return "Returned";

        // Nếu state là null hoặc không xác định
        if (!state) return "Pending";

        switch (state) {
            case "ACTIVE":
                return "Active";
            case "OVERDUE":
                return "Overdue";
            case "RETURNED":
                return "Returned";
            default:
                return "Unknown";
        }
    };

    // Hàm format date từ API
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Active":
                return <Clock className="h-4 w-4" />;
            case "Overdue":
                return <AlertCircle className="h-4 w-4" />;
            case "Returned":
                return <CheckCircle className="h-4 w-4" />;
            case "Pending":
                return <HelpCircle className="h-4 w-4" />;
            default:
                return null;
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case "Active":
                return "bg-blue-100 text-blue-800";
            case "Overdue":
                return "bg-red-100 text-red-800";
            case "Returned":
                return "bg-green-100 text-green-800";
            case "Pending":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 bg-gray-50/30 p-5">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-2xl font-bold text-gray-900">Quản Lý Sách Thuê</h1>
                </div>
                <div className="container mx-auto">
                    {/* Filters and Search */}
                    <div className="bg-white rounded-lg overflow-hidden mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <input
                                    placeholder="Tìm kiếm theo mã đơn, tên sách, SKU"
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400"
                                />
                            </div>
                            <select defaultValue="all" className="w-full md:w-[180px] border border-gray-300 rounded-md px-3 py-2 text-sm">
                                <option value="all">Tất cả trạng thái</option>
                                <option value="ACTIVE">Đang thuê</option>
                                <option value="OVERDUE">Quá hạn</option>
                                <option value="RETURNED">Đã trả</option>
                                <option value="PENDING">Chờ xử lý</option>
                            </select>
                            <select defaultValue="all" className="w-full md:w-[180px] border border-gray-300 rounded-md px-3 py-2 text-sm">
                                <option value="all">Tất cả thời gian</option>
                                <option value="today">Hôm nay</option>
                                <option value="week">Tuần này</option>
                                <option value="month">Tháng này</option>
                            </select>
                        </div>
                    </div>

                    {/* Rentals Table */}
                    <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
                        <div className="p-0">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sách (SKU)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đã trả</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phí phạt</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {rentals.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                                    Không có dữ liệu
                                                </td>
                                            </tr>
                                        ) : (
                                            rentals.map((rental) => {
                                                const displayStatus = getDisplayStatus(rental.state, rental.actualReturnDate);
                                                return (
                                                    <tr key={rental.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="font-mono font-semibold text-gray-900">
                                                                {rental.orderId.substring(0, 8)}...
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                ID: {rental.id.substring(0, 8)}...
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-medium text-gray-900">
                                                                {rental.book?.title || 'N/A'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                SKU: {rental.book?.sku || 'N/A'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold">
                                                                {rental.quantity || 0}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {rental.returnQuantity !== null && rental.returnQuantity !== undefined ? (
                                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 font-semibold">
                                                                    {rental.returnQuantity}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusVariant(displayStatus)}`}>
                                                                {getStatusIcon(displayStatus)}
                                                                {displayStatus}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap font-semibold">
                                                            {rental.penalty ? (
                                                                <span className="text-red-600">{formatCurrency(rental.penalty)}</span>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                                                                    <Eye className="h-4 w-4" />
                                                                    <span className="sr-only">Xem chi tiết</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 px-6">
                                <div className="text-xs text-gray-500">
                                    Hiển thị {rentals.length} trên tổng {meta.total || 0} đơn
                                </div>
                                <PagingBar
                                    totalPages={meta.pageCount || 1}
                                    pageSize={meta.limit || 10}
                                    currentPage={params.page}
                                    onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminRentalsPage;