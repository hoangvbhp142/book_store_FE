import { useEffect, useState } from 'react';
import {
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    CreditCard,
    Calendar,
    BookOpen,
    Eye
} from 'lucide-react';
import PagingBar from '../components/PagingBar';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import orderApi from '../api/orderApi';
import { formatCurrency } from '../app/utils';

const CustomerOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [meta, setMeta] = useState({});

    const [params, setParams] = useState({
        sort: 'createdAt:desc',
        limit: 10,
        page: 1
    });

    // Hàm rút gọn ID để hiển thị
    const shortenId = (id) => {
        if (!id) return 'N/A';
        return id.substring(0, 20) + '...';
    };

    // Lấy icon cho trạng thái
    const getStatusIcon = (status) => {
        switch (status) {
            case 'PROCESSING':
            case 'PENDING':
                return <Clock className="h-4 w-4" />;
            case 'SHIPPED':
            case 'DELIVERING':
                return <Truck className="h-4 w-4" />;
            case 'COMPLETED':
            case 'DELIVERED':
                return <CheckCircle className="h-4 w-4" />;
            case 'CANCELLED':
            case 'FAILED':
                return <XCircle className="h-4 w-4" />;
            case 'PAYING':
                return <CreditCard className="h-4 w-4" />;
            default:
                return <Package className="h-4 w-4" />;
        }
    };

    // Lấy màu và text cho trạng thái
    const getStatusInfo = (order) => {
        const status = order.shipping ? order.shipping.status : order.status;
        console.log(order.id, status);


        switch (status) {
            case 'PROCESSING':
                return { text: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
            case 'PAYING':
                return { text: 'Đang thanh toán', color: 'bg-blue-100 text-blue-800 border-blue-200' };
            case 'WAIT_FOR_DELIVERY':
                return { text: 'Chờ xác nhận', color: 'bg-orange-100 text-orange-800 border-orange-200' };
            case 'SHIPPING':
                return { text: 'Đang giao hàng', color: 'bg-green-100 text-green-800 border-green-200' };
            case 'DELIVERED':
                return { text: 'Đã giao hàng', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
            case 'CANCEL':
                return { text: 'Đã hủy', color: 'bg-red-100 text-red-800 border-red-200' };
            case 'FAILED':
                return { text: 'Thất bại', color: 'bg-red-100 text-red-800 border-red-200' };
            default:
                return { text: status, color: 'bg-gray-100 text-gray-800 border-gray-200' };
        }
    };

    // Lấy thông tin loại đơn hàng
    const getOrderTypeInfo = (order) => {
        const hasPurchase = order.totalPurchaseAmount && parseFloat(order.totalPurchaseAmount) > 0;
        const hasRental = order.totalRentAmount && parseFloat(order.totalRentAmount) > 0;

        if (hasPurchase && hasRental) {
            return { text: 'Mua & Thuê', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: <BookOpen className="h-3 w-3" /> };
        } else if (hasPurchase) {
            return { text: 'Mua sách', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <Package className="h-3 w-3" /> };
        } else if (hasRental) {
            return { text: 'Thuê sách', color: 'bg-green-100 text-green-800 border-green-200', icon: <Calendar className="h-3 w-3" /> };
        }
        return { text: 'Không xác định', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: null };
    };

    // Hàm lấy tổng số sản phẩm
    const getTotalItems = (order) => {
        const purchaseItems = order.orderItems?.length || 0;
        const rentalItems = order.rentalItems?.length || 0;
        return purchaseItems + rentalItems;
    };

    // Format ngày đơn giản
    const formatSimpleDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            return dateString.split('T')[0];
        }
    };

    // Fetch orders từ API
    const fetchOrders = async () => {
        try {
            const response = await orderApi.getOrders(params);
            if (response && response.data) {
                setOrders(response.data);
                setMeta(response.meta);
            }
        } catch (error) {
            console.error('Lỗi khi tải đơn hàng:', error);
            toast.error('Lỗi khi tải đơn hàng!');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [params]);

    return (
        <div className="flex-1 min-h-screen bg-gray-50">
            <div className="px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900">Đơn hàng của tôi</h1>
                    <p className="text-gray-600 text-sm mt-1">
                        Quản lý và theo dõi đơn hàng của bạn
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <Package className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">Bạn chưa có đơn hàng nào</h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                Khi bạn đặt hàng, bạn sẽ thấy thông tin đơn hàng của mình ở đây.
                            </p>
                            <Link
                                to="/store"
                                className="inline-block bg-blue-600 text-white py-2 px-5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                            >
                                Mua sắm ngay
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Table Container - Thu hẹp chiều ngang */}
                        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            Mã đơn
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            Ngày đặt
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            SL
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            Tổng tiền
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            Loại
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            Trạng thái
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {orders.map((order) => {
                                        const statusInfo = getStatusInfo(order);
                                        const orderTypeInfo = getOrderTypeInfo(order);
                                        const totalItems = getTotalItems(order);

                                        return (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-900 font-mono">
                                                            {shortenId(order.id)}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {order.payment?.paymentMethod === 'VN_PAY' ? 'VNPay' : 'COD'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                                    <div className="text-sm text-gray-900">
                                                        {formatSimpleDate(order.createdAt)}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                                    <span className="text-sm text-gray-900">
                                                        {totalItems}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {formatCurrency(order.totalAmount)}
                                                    </div>
                                                    {order.rentalType && (
                                                        <div className="text-xs text-gray-500">
                                                            {order.rentalType === 'DAILY' ? 'Ngày' :
                                                                order.rentalType === 'WEEKLY' ? 'Tuần' :
                                                                    order.rentalType === 'MONTHLY' ? 'Tháng' : ''}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${orderTypeInfo.color}`}>
                                                        {orderTypeInfo.icon}
                                                        <span className="hidden sm:inline">{orderTypeInfo.text}</span>
                                                        <span className="sm:hidden">
                                                            {orderTypeInfo.text === 'Mua sách' ? 'Mua' :
                                                                orderTypeInfo.text === 'Thuê sách' ? 'Thuê' :
                                                                    orderTypeInfo.text === 'Mua & Thuê' ? 'M&T' : orderTypeInfo.text}
                                                        </span>
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                                                        {getStatusIcon(order.status)}
                                                        <span className="hidden sm:inline">{statusInfo.text}</span>
                                                        <span className="sm:hidden">
                                                            {statusInfo.text === 'Đang xử lý' ? 'Xử lý' :
                                                                statusInfo.text === 'Chờ xác nhận' ? 'Chờ' :
                                                                    statusInfo.text === 'Đang thanh toán' ? 'TT' :
                                                                        statusInfo.text === 'Đang giao hàng' ? 'Giao' :
                                                                            statusInfo.text === 'Đã giao hàng' ? 'Hoàn tất' : statusInfo.text}
                                                        </span>
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                                    <Link
                                                        to={`/customer/orders/${order.id}`}
                                                        className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-xs text-gray-500">
                                Hiển thị {orders.length} trên tổng {meta.limit} đơn
                            </div>
                            <PagingBar
                                totalPages={meta.pageCount}
                                pageSize={meta.limit}
                                currentPage={params.page}
                                onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CustomerOrderPage;