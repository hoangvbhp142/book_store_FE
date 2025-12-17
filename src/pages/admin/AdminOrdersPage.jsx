import { useState, useEffect } from 'react';
import { data, Link } from 'react-router-dom';
import {
    Search,
    Eye,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    CreditCard,
    Wallet,
    AlertCircle,
    ChevronDown,
    RefreshCw,
    AlertTriangle
} from 'lucide-react';
import PagingBar from '../../components/PagingBar';
import { toast } from 'react-toastify';
import adminOrderApi from '../../api/adminOrderApi';
import addressApi from '../../api/addressApi';
import OrderDetailModal from '../../modal/OrderDetailModal';
import { formatDate, formatCurrency } from '../../app/utils';
import shippingApi from '../../api/shippingApi';

const AdminOrdersPage = () => {

    const today = new Date().toISOString().split('T')[0];

    // Dữ liệu mẫu từ API response
    const [orders, setOrders] = useState([]);
    const [meta, setMeta] = useState({});

    const [params, setParams] = useState({
        sort: 'createdAt:desc',
        q: '',
        limit: 10,
        page: 1
    });



    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');

    // State cho modal
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Hàm mở modal xem chi tiết
    const handleViewOrder = async (order) => {
        try {
            const response = await adminOrderApi.getOrderDetails(order.id);
            setSelectedOrder(response);
            setIsModalOpen(true);

        } catch (error) {
            console.log(error);
            toast.error('Lỗi khi tải chi tiết đơn hàng!');
            return;
        }
    };

    const handleCancelOrder = async () => {
        try {
            const response = await adminOrderApi.updateOrder(selectedOrder.id, {});
            toast.success('Hủy đơn hàng thành công!');
        } catch (error) {
            console.log(error);
            toast.error('Lỗi khi hủy đơn hàng!');
        }
    }

    const handleShipping = async (data) => {
        try {
            const response = await shippingApi.create(data);
            console.log(response);
            toast.info('Cập nhật thông tin vận chuyển thành công!');
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Lỗi khi cập nhật thông tin vận chuyển!');
        }
    }

    const handleShippingUpdate = async (id, data) => {
        try {
            const response = await shippingApi.update(id, data);
            console.log(response);
            toast.info('Cập nhật thông tin vận chuyển thành công!');
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Lỗi khi cập nhật thông tin vận chuyển!');
        }
    }

    // Hàm đóng modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    // Đóng modal khi nhấn ESC
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                handleCloseModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden'; // Ngăn scroll body
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto'; // Khôi phục scroll
        };
    }, [isModalOpen]);

    // Hàm lấy icon cho trạng thái
    const getStatusIcon = (status) => {
        switch (status) {
            case "PROCESSING":
                return <Clock className="h-4 w-4" />;
            case "WAIT_FOR_DELIVERY":
                return <Package className="h-4 w-4" />;
            case "SHIPPING":
                return <Truck className="h-4 w-4" />;
            case "PAYMENT_ERROR":
                return <AlertCircle className="h-4 w-4" />;
            case "REFUNDING":
                return <RefreshCw className="h-4 w-4" />;
            case "REFUND_ERROR":
                return <AlertTriangle className="h-4 w-4" />;
            case "REFUNDED":
                return <CheckCircle className="h-4 w-4" />;
            case "CANCEL":
                return <XCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    // Hàm lấy màu sắc cho trạng thái
    const getStatusVariant = (status) => {
        switch (status) {
            case "PROCESSING":
                return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case "WAIT_FOR_DELIVERY":
                return 'bg-blue-100 text-blue-800 border border-blue-200';
            case "SHIPPING":
                return 'bg-purple-100 text-purple-800 border border-purple-200';
            case "PAYMENT_ERROR":
                return 'bg-red-100 text-red-800 border border-red-200';
            case "REFUNDING":
                return 'bg-orange-100 text-orange-800 border border-orange-200';
            case "REFUND_ERROR":
                return 'bg-red-100 text-red-800 border border-red-200';
            case "REFUNDED":
                return 'bg-gray-100 text-gray-800 border border-gray-200';
            case "CANCEL":
                return 'bg-gray-200 text-gray-800 border border-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    // Hàm lấy text hiển thị cho trạng thái
    const getStatusText = (status) => {
        switch (status) {
            case "PROCESSING": return 'Đang xử lý';
            case "WAIT_FOR_DELIVERY": return 'Chờ giao hàng';
            case "SHIPPING": return 'Đang giao hàng';
            case "PAYMENT_ERROR": return 'Lỗi thanh toán';
            case "REFUNDING": return 'Đang hoàn tiền';
            case "REFUND_ERROR": return 'Lỗi hoàn tiền';
            case "REFUNDED": return 'Đã hoàn tiền';
            case "CANCEL": return 'Đã hủy';
            default: return status;
        }
    };


    // Hàm lấy màu sắc cho trạng thái thanh toán
    const getPaymentStatusVariant = (status) => {
        switch (status) {
            case "PAYING":
                return 'bg-yellow-100 text-yellow-800';
            case "PAID":
                return 'bg-green-100 text-green-800';
            case "PAYMENT_ERROR":
                return 'bg-red-100 text-red-800';
            case "REFUNDING":
                return 'bg-orange-100 text-orange-800';
            case "REFUND_ERROR":
                return 'bg-red-100 text-red-800';
            case "REFUNDED":
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Hàm lấy text hiển thị cho phương thức thanh toán
    const getPaymentMethodText = (method) => {
        switch (method) {
            case "COD": return "COD";
            case "VNPAY": return "VNPay";
            case "BANK_TRANSFER": return "Chuyển khoản";
            default: return method;
        }
    };

    // Hàm lấy icon cho phương thức thanh toán
    const getPaymentMethodIcon = (method) => {
        switch (method) {
            case "COD": return <Wallet className="h-3 w-3" />;
            case "VNPAY": return <CreditCard className="h-3 w-3" />;
            case "BANK_TRANSFER": return <CreditCard className="h-3 w-3" />;
            default: return <CreditCard className="h-3 w-3" />;
        }
    };

    // Lọc orders dựa trên search và filter
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            searchQuery === '' ||
            order.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.user.phone.includes(searchQuery);

        const matchesStatus =
            statusFilter === 'all' ||
            order.status === statusFilter;

        const matchesPayment =
            paymentFilter === 'all' ||
            order.payment.status === paymentFilter;

        return matchesSearch && matchesStatus && matchesPayment;
    });

    // Hàm xử lý thay đổi trạng thái đơn hàng
    const handleStatusChange = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));

        if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder({ ...selectedOrder, status: newStatus });
        }

        // Ở đây bạn có thể thêm API call để cập nhật trạng thái
        console.log(`Cập nhật trạng thái đơn ${orderId} thành ${newStatus}`);
    };

    // Hàm xử lý thanh toán
    const handleMarkAsPaid = (orderId) => {
        setOrders(orders.map(order =>
            order.id === orderId ? {
                ...order,
                payment: {
                    ...order.payment,
                    status: "PAID",
                    paidAt: new Date().toISOString()
                }
            } : order
        ));

        if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder({
                ...selectedOrder,
                payment: {
                    ...selectedOrder.payment,
                    status: "PAID",
                    paidAt: new Date().toISOString()
                }
            });
        }

        console.log(`Đánh dấu đơn ${orderId} đã thanh toán`);
    };

    const fetchOrders = async () => {
        try {
            const response = await adminOrderApi.getAllOrders(params);
            setOrders(response.data);
            setMeta(response.meta);
        } catch (error) {
            console.log(error);
            toast.error('Lỗi khi tải danh sách đơn hàng!');
        }
    }

    useEffect(() => {
        fetchOrders();
    }, [params]);

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 bg-gray-50/30">
                <div className="flex justify-between items-center px-5 pt-5">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Đơn Hàng</h1>
                    </div>
                </div>
                <div className="container mx-auto p-4 md:p-6">
                    {/* Bộ lọc và tìm kiếm */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        placeholder="Tìm kiếm theo mã đơn, tên khách hàng, số điện thoại..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="relative">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full md:w-48 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10"
                                    >
                                        <option value="all">Tất cả trạng thái</option>
                                        <option value="PROCESSING">Đang xử lý</option>
                                        <option value="WAIT_FOR_DELIVERY">Chờ giao hàng</option>
                                        <option value="SHIPPING">Đang giao hàng</option>
                                        <option value="CANCEL">Đã hủy</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>


                                <div className="relative">
                                    <select
                                        value={paymentFilter}
                                        onChange={(e) => setPaymentFilter(e.target.value)}
                                        className="w-full md:w-48 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10"
                                    >
                                        <option value="all">Tất cả thanh toán</option>
                                        <option value="PAYING">Đang thanh toán</option>
                                        <option value="PAID">Đã thanh toán</option>
                                        <option value="PAYMENT_ERROR">Lỗi thanh toán</option>
                                        <option value="REFUNDING">Đang hoàn tiền</option>
                                        <option value="REFUND_ERROR">Lỗi hoàn tiền</option>
                                        <option value="REFUNDED">Đã hoàn tiền</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bảng đơn hàng */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thanh toán</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{order.code}</p>
                                                    <p
                                                        className="text-xs text-gray-500 font-mono truncate max-w-[80px]"
                                                        title={order.id}
                                                    >
                                                        {order.id}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${order.rentalItems.length > 0 ? 'bg-green-100' : 'bg-blue-100'}`}>
                                                        {order.rentalItems.length > 0 ? (
                                                            <Calendar className="h-4 w-4 text-green-600" />
                                                        ) : (
                                                            <Package className="h-4 w-4 text-blue-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{order.rentalItems.length + order.orderItems.length} sản phẩm</p>
                                                        <p className="text-xs text-gray-500">
                                                            {order.rentalItems.length > 0 ? 'Có sách thuê' : 'Chỉ mua'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <p className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusVariant(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        {getStatusText(order.status)}
                                                    </span>
                                                    {order.rentalItems.length > 0 && (
                                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            Hạn trả: {formatDate(order.rentDue)}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        {getPaymentMethodIcon(order.payment.paymentMethod)}
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {getPaymentMethodText(order.payment.paymentMethod)}
                                                        </span>
                                                    </div>
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusVariant(order.payment.status)}`}>
                                                        {order.payment.status === 'PAID' ? 'Đã thanh toán' :
                                                            order.payment.status === 'UNPAID' ? 'Chưa thanh toán' :
                                                                order.payment.status === 'PARTIAL' ? 'Thanh toán một phần' :
                                                                    order.payment.status === 'REFUNDED' ? 'Đã hoàn tiền' : order.payment.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {formatDate(order.createdAt).split(' ')[0]}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {formatDate(order.createdAt).split(' ')[1]}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewOrder(order)}
                                                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Phân trang */}
                        <div className="flex flex-col md:flex-row items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                            <p className="text-sm text-gray-600 mb-4 md:mb-0">
                                Hiển thị {filteredOrders.length} trên tổng số {meta.limit} đơn hàng
                            </p>
                            <PagingBar
                                pageSize={meta.limit}
                                totalPages={meta.pageCount}
                                currentPage={meta.page}
                                hasNext={meta.hasNext}
                                hasPrev={meta.hasPrev}
                                onPageChange={(page) => setParams((prev) => ({ ...prev, page: page }))}
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal chi tiết đơn hàng */}
            {isModalOpen && selectedOrder && (
                <OrderDetailModal
                    selectedOrder={selectedOrder}
                    onCloseModal={handleCloseModal}
                    onMarkAsPaid={handleMarkAsPaid}
                    getStatusIcon={getStatusIcon}
                    getStatusVariant={getStatusVariant}
                    getStatusText={getStatusText}
                    formatDate={formatDate}
                    handleCancelOrder={handleCancelOrder}
                    handleShipping={handleShipping}
                    handleShippingUpdate={handleShippingUpdate} />
            )}
        </div>
    );
};

export default AdminOrdersPage;