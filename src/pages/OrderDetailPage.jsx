import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Download,
    MessageSquare,
    RotateCcw,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    Truck,
    Package,
    XCircle,
    MapPin,
    Phone,
    Mail,
    FileText,
    Book,
    ChevronRight,
    CreditCard,
    ShoppingBag,
    Printer,
    Eye,
    Tag,
    User,
    Home,
    PhoneCall,
    Mail as MailIcon,
    Check,
    X,
    Loader,
    AlertTriangle,
    ShieldCheck,
    ThumbsUp
} from "lucide-react";
import { Link, useParams } from 'react-router-dom';
import orderApi from '../api/orderApi';
import { toast } from 'react-toastify';
import { formatCurrency } from '../app/utils';
import rentalReturnApi from '../api/rentalReturnApi';

const OrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [returnNotes, setReturnNotes] = useState('');

    // Fetch order details
    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await orderApi.getOrderById(id);
            setOrder(response);
            console.log(response);
        } catch (error) {
            console.error('Lỗi khi tải chi tiết đơn hàng:', error);
            toast.error('Không thể tải chi tiết đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        try {
            const response = await orderApi.updateOrderStatus(id, {});
            console.log(response);
        } catch (error) {
            console.log(error);
            toast.error('Hủy đơn hàng thất bại');
        }
    }

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    };

    const formatDateOnly = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case "PROCESSING":
                return {
                    text: 'Đang xử lý',
                    description: 'Đơn hàng đang được xử lý',
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    icon: <Loader className="h-5 w-5" />,
                    badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                };

            case "WAIT_FOR_DELIVERY":
                return {
                    text: 'Chờ giao hàng',
                    description: 'Đơn hàng đang chờ giao cho đơn vị vận chuyển',
                    color: 'text-orange-600',
                    bgColor: 'bg-orange-50',
                    borderColor: 'border-orange-200',
                    icon: <Clock className="h-5 w-5" />,
                    badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
                };

            case "SHIPPING":
                return {
                    text: 'Đang giao hàng',
                    description: 'Đơn hàng đang được vận chuyển',
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    icon: <Truck className="h-5 w-5" />,
                    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
                };

            case "PAYMENT_ERROR":
                return {
                    text: 'Lỗi thanh toán',
                    description: 'Thanh toán không thành công',
                    color: 'text-red-600',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    icon: <XCircle className="h-5 w-5" />,
                    badgeClass: 'bg-red-100 text-red-800 border-red-200',
                };

            case "REFUNDING":
                return {
                    text: 'Đang hoàn tiền',
                    description: 'Đơn hàng đang được hoàn tiền',
                    color: 'text-purple-600',
                    bgColor: 'bg-purple-50',
                    borderColor: 'border-purple-200',
                    icon: <Loader className="h-5 w-5" />,
                    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
                };

            case "REFUND_ERROR":
                return {
                    text: 'Lỗi hoàn tiền',
                    description: 'Hoàn tiền không thành công',
                    color: 'text-red-700',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-300',
                    icon: <XCircle className="h-5 w-5" />,
                    badgeClass: 'bg-red-100 text-red-900 border-red-300',
                };

            case "REFUNDED":
                return {
                    text: 'Đã hoàn tiền',
                    description: 'Tiền đã được hoàn lại thành công',
                    color: 'text-emerald-600',
                    bgColor: 'bg-emerald-50',
                    borderColor: 'border-emerald-200',
                    icon: <CheckCircle className="h-5 w-5" />,
                    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                };

            case "CANCEL":
                return {
                    text: 'Đã hủy',
                    description: 'Đơn hàng đã bị hủy',
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-100',
                    borderColor: 'border-gray-300',
                    icon: <XCircle className="h-5 w-5" />,
                    badgeClass: 'bg-gray-200 text-gray-800 border-gray-300',
                };

            default:
                return {
                    text: status,
                    description: 'Trạng thái đơn hàng',
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    icon: <Package className="h-5 w-5" />,
                    badgeClass: 'bg-gray-100 text-gray-800 border-gray-200',
                };
        }
    };


    const getPaymentStatusInfo = (status) => {
        switch (status) {
            case 'PAYING':
                return { text: 'Đang thanh toán', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
            case 'PAID':
                return { text: 'Đã thanh toán', color: 'text-green-600', bgColor: 'bg-green-50' };
            case 'FAILED':
                return { text: 'Thất bại', color: 'text-red-600', bgColor: 'bg-red-50' };
            case 'REFUNDED':
                return { text: 'Đã hoàn tiền', color: 'text-blue-600', bgColor: 'bg-blue-50' };
            default:
                return { text: 'Chưa thanh toán', color: 'text-gray-600', bgColor: 'bg-gray-50' };
        }
    };

    const getRentalTypeText = (type) => {
        switch (type) {
            case 'DAILY': return 'Thuê ngày';
            case 'WEEKLY': return 'Thuê tuần';
            case 'MONTHLY': return 'Thuê tháng';
            default: return 'Thuê';
        }
    };

    const calculateRentalDays = (startDate, dueDate) => {
        if (!startDate || !dueDate) return 0;
        const start = new Date(startDate);
        const due = new Date(dueDate);
        const diffTime = Math.abs(due - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const handleReturnBook = (book) => {
        setShowReturnModal(true);
    };

    const handleSubmitReturn = async () => {
        try {
            const data = {
                orderId: id,
                rentalItemIds: order.rentalItems.map(item => item.id),
                addressId: order.addressId,
                customerNote: returnNotes,
                trackingNumber: ""
            }
            const response = await rentalReturnApi.createRentalRequest(data);
            console.log(response);
            toast.success(`Đã gửi yêu cầu trả sách. Vui lòng đợi xác nhận.`);

            setShowReturnModal(false);
            setReturnNotes('');
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Gửi yêu cầu trả sách thất bại');
        }

    };

    // Các trạng thái có thể hiển thị dưới dạng steps
    const statusSteps = [
        { key: 'PENDING', label: 'Chờ xác nhận', icon: Clock },
        { key: 'PROCESSING', label: 'Đang xử lý', icon: Loader },
        { key: 'DELIVERING', label: 'Đang giao', icon: Truck },
        { key: 'DELIVERED', label: 'Đã giao', icon: CheckCircle }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải chi tiết đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng</h2>
                    <p className="text-gray-600 mb-6">Đơn hàng bạn tìm kiếm không tồn tại.</p>
                    <Link
                        to="/customer/orders"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại danh sách đơn hàng
                    </Link>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusInfo(order.status);
    const paymentStatusInfo = getPaymentStatusInfo(order.payment?.status);
    const totalItems = (order.orderItems?.length || 0) + (order.rentalItems?.length || 0);
    const rentalDays = calculateRentalDays(order.rentStart, order.rentDue);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Link
                                to="/customer/orders"
                                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded-md"
                                title="Quay lại"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                            <div className="flex-1">
                                <h1 className="text-lg font-semibold text-gray-900">Đơn hàng #{order.id.substring(0, 8)}...</h1>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(order.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {/* Left Column - Order Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Items Card */}
                            <div className="bg-white rounded-lg border border-gray-200 p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <ShoppingBag className="h-5 w-5 text-blue-600" />
                                        Chi tiết sản phẩm
                                    </h2>
                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded">
                                        {totalItems} sản phẩm
                                    </span>
                                </div>

                                {/* Purchase Items */}
                                {order.orderItems && order.orderItems.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                            <Package className="h-4 w-4 text-blue-600" />
                                            Sách mua
                                        </h3>
                                        <div className="space-y-4">
                                            {order.orderItems.map((item) => (
                                                <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                                    <img
                                                        src={item.book?.photoUrl.replace('minio:9000', 'localhost:9000') || 'https://via.placeholder.com/64x80?text=Book'}
                                                        alt={item.book?.title}
                                                        className="w-16 h-20 object-cover rounded"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://via.placeholder.com/64x80?text=Book';
                                                        }}
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex justify-between">
                                                            <div>
                                                                <h4 className="font-medium text-gray-900 text-sm">{item.book?.title}</h4>
                                                                <p className="text-xs text-gray-500">{item.book?.author}</p>
                                                                <div className="mt-2">
                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                                                        <Tag className="h-3 w-3" />
                                                                        Mua
                                                                    </span>
                                                                    <span className="ml-2 text-xs text-gray-500">SL: {item.quantity}</span>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-semibold text-sm">{formatCurrency(item.book?.sellerPrice || 0)}</p>
                                                                <p className="text-xs text-gray-500">Tổng: {formatCurrency((item.book?.sellerPrice || 0) * item.quantity)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Rental Items */}
                                {order.rentalItems && order.rentalItems.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-green-600" />
                                            Sách thuê
                                        </h3>
                                        <div className="space-y-4">
                                            {order.rentalItems.map((item) => {
                                                const rentalPrice = order.rentalType === 'DAILY' ? item.book?.rentPricePerDay :
                                                    order.rentalType === 'WEEKLY' ? item.book?.rentPricePerWeek :
                                                        order.rentalType === 'MONTHLY' ? item.book?.rentPricePerMonth : 0;

                                                return (
                                                    <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                                        <img
                                                            src={item.book?.photoUrl.replace('minio:9000', 'localhost:9000') || 'https://via.placeholder.com/64x80?text=Book'}
                                                            alt={item.book?.title}
                                                            className="w-16 h-20 object-cover rounded"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = 'https://via.placeholder.com/64x80?text=Book';
                                                            }}
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex justify-between">
                                                                <div>
                                                                    <h4 className="font-medium text-gray-900 text-sm">{item.book?.title}</h4>
                                                                    <p className="text-xs text-gray-500">{item.book?.author}</p>
                                                                    <div className="mt-2 space-y-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                                                                <Calendar className="h-3 w-3" />
                                                                                {getRentalTypeText(order.rentalType)}
                                                                            </span>
                                                                            <span className="text-xs text-gray-500">SL: {item.quantity}</span>
                                                                        </div>
                                                                        <div className="text-xs text-gray-600 space-y-1">
                                                                            <p>📅 Thời gian thuê: {rentalDays} ngày</p>
                                                                            <p>⏰ Bắt đầu: {formatDateOnly(order.rentStart)}</p>
                                                                            <p>⏱️ Hạn trả: {formatDateOnly(order.rentDue)}</p>
                                                                            {item.book?.rentPenaltyPerDay && (
                                                                                <p>⚠️ Phí phạt: {formatCurrency(item.book.rentPenaltyPerDay)}/ngày</p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-semibold text-sm">{formatCurrency(rentalPrice)}</p>
                                                                    <p className="text-xs text-gray-500">Tiền cọc: {formatCurrency(item.book?.rentDeposit || 0)}</p>
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        Tổng: {formatCurrency((parseFloat(rentalPrice || 0) + parseFloat(item.book?.rentDeposit || 0)) * item.quantity)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Summary Card */}
                            <div className="bg-white rounded-lg border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Tổng kết đơn hàng</h3>
                                <div className="space-y-2">
                                    {order.totalPurchaseAmount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tổng tiền mua sách</span>
                                            <span>{formatCurrency(order.totalPurchaseAmount)}</span>
                                        </div>
                                    )}
                                    {order.totalRentAmount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tổng tiền thuê sách</span>
                                            <span>{formatCurrency(order.totalRentAmount)}</span>
                                        </div>
                                    )}
                                    {order.depositAmount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tiền cọc</span>
                                            <span>{formatCurrency(order.depositAmount)}</span>
                                        </div>
                                    )}
                                    {order.discount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Giảm giá</span>
                                            <span className="text-green-600">-{formatCurrency(order.discount)}</span>
                                        </div>
                                    )}
                                    <div className="pt-3 border-t border-gray-200">
                                        <div className="flex justify-between font-semibold">
                                            <span className="text-gray-900">Tổng cộng</span>
                                            <span className="text-lg text-blue-600">{formatCurrency(order.totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Info Cards */}
                        <div className="space-y-6">
                            {/* Shipping Address */}
                            <div className="bg-white rounded-lg border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Home className="h-5 w-5 text-gray-600" />
                                    Địa chỉ giao hàng
                                </h3>

                                <div className="space-y-2 text-sm">
                                    {/* Tên + SĐT */}
                                    <p className="font-medium text-gray-900">
                                        {order.address?.name}
                                        {order.address?.phone && (
                                            <span className="text-gray-500 font-normal">
                                                {" "}• {order.address.phone}
                                            </span>
                                        )}
                                    </p>

                                    {/* Label nếu có */}
                                    {order.address?.label && order.address.label !== "" && (
                                        <p className="inline-block text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                            {order.address.label}
                                        </p>
                                    )}

                                    {/* Địa chỉ chi tiết */}
                                    <p className="text-gray-600">
                                        {order.address?.street}
                                    </p>
                                    <p className="text-gray-600">
                                        {order.address?.ward}, {order.address?.district}
                                    </p>
                                    <p className="text-gray-600">
                                        {order.address?.province}
                                    </p>
                                </div>
                            </div>


                            {/* Payment Info */}
                            <div className="bg-white rounded-lg border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-gray-600" />
                                    Thanh toán
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Phương thức</span>
                                        <span className="font-medium">{order.payment?.paymentMethod === 'VN_PAY' ? 'VNPay' : 'COD'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Trạng thái</span>
                                        <span className={`font-medium ${paymentStatusInfo.color}`}>
                                            {paymentStatusInfo.text}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Số tiền</span>
                                        <span className="font-medium">{formatCurrency(order.payment?.amount || order.totalAmount)}</span>
                                    </div>
                                    {order.payment?.transactionNo && (
                                        <div className="pt-2 border-t border-gray-100">
                                            <p className="text-gray-600">Mã giao dịch:</p>
                                            <p className="font-mono text-sm">{order.payment.transactionNo}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
                                {/* Order Status */}
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${statusInfo.bgColor}`}>
                                        <div className={statusInfo.color}>
                                            {statusInfo.icon}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            Trạng thái đơn hàng
                                        </h3>

                                        <p className={`text-lg font-bold ${statusInfo.color}`}>
                                            {statusInfo.text}
                                        </p>

                                        <p className="text-sm text-gray-600">
                                            {statusInfo.description}
                                        </p>

                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock className="h-3 w-3 text-gray-400" />
                                            <span className="text-xs text-gray-500">
                                                Cập nhật: {formatDate(order.updatedAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Message */}
                                {order.status === 'DELIVERED' && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                        <span>Đơn hàng đã được giao thành công. Cảm ơn bạn đã mua sắm!</span>
                                    </div>
                                )}

                                {order.status === 'PROCESSING' && (
                                    <div className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                        Đơn hàng đang được chuẩn bị. Bạn sẽ nhận được thông báo khi đơn hàng được giao.
                                    </div>
                                )}

                                {order.status === 'CANCELLED' && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-red-50 border border-red-200 rounded-lg p-3">
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                        <span>
                                            Đơn hàng đã bị hủy. Nếu bạn đã thanh toán, tiền sẽ được hoàn trả trong 3-5 ngày làm việc.
                                        </span>
                                    </div>
                                )}

                                {/* Actions */}
                                {(order.status === 'PROCESSING' ||
                                    order.status === 'WAIT_FOR_DELIVERY' ||
                                    order.status === 'PENDING' ||
                                    (order.shipping.status === 'DELIVERED' && order.rentalItems?.length > 0)) && (
                                        <div className="pt-4 border-t border-gray-200 space-y-2">
                                            {(order.status === 'PROCESSING' || order.status === 'WAIT_FOR_DELIVERY' || order.status === 'PENDING') && (
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
                                                            handleCancelOrder();
                                                            toast.success('Đã hủy đơn hàng thành công');
                                                        }
                                                    }}
                                                    className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                                                >
                                                    Hủy đơn hàng
                                                </button>
                                            )}

                                            {order.shipping.status === 'DELIVERED' && order.rentalItems?.length > 0 && (
                                                <button
                                                    onClick={() => handleReturnBook(order.rentalItems[0].book)}
                                                    className="w-full px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                                >
                                                    <RotateCcw className="h-4 w-4" />
                                                    Yêu cầu trả sách thuê
                                                </button>
                                            )}
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Return Modal */}
            {showReturnModal && (
                <div className="fixed inset-0 bg-gray-600/30 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">

                        {/* Header */}
                        <div className="p-5 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-900">Yêu cầu trả sách</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Đơn hàng #{order.id}
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-5">

                            {/* Danh sách sách */}
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    Sách sẽ được trả
                                </p>

                                <div className="border border-gray-200 rounded-lg divide-y">
                                    {order.rentalItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3 p-3"
                                        >
                                            <img
                                                src={item.book.photoUrl.replace('minio:9000', 'localhost:9000')}
                                                alt={item.book.title}
                                                className="w-10 h-14 object-cover rounded border"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {item.book.title}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Thời hạn thuê: {rentalDays} ngày
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Ghi chú */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ghi chú thêm
                                </label>
                                <textarea
                                    value={returnNotes}
                                    onChange={(e) => setReturnNotes(e.target.value)}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập ghi chú (nếu có)..."
                                />
                            </div>

                            {/* Warning */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                                    <p className="text-sm text-amber-700">
                                        Vui lòng đảm bảo sách không bị hư hỏng, không viết/vẽ lên sách.
                                        Sách sẽ được kiểm tra khi nhận lại.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => setShowReturnModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-100"
                            >
                                Hủy
                            </button>

                            <button
                                onClick={handleSubmitReturn}
                                className={`px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700`}>
                                Gửi yêu cầu
                            </button>
                        </div>
                    </div>
                </div>

            )}
        </div>
    );
}

export default OrderDetailPage;