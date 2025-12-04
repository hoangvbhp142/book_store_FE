import React from 'react';
import {
    Calendar,
    Clock,
    Package,
    User,
    MapPin,
    CreditCard,
    DollarSign,
    BookOpen,
    CalendarDays,
    History,
    CheckCircle,
    Clock4,
    Truck,
    Shield,
    AlertCircle
} from 'lucide-react';

const AdminOrderDetail = ({ orderData }) => {
    // Sử dụng dữ liệu mẫu nếu không có prop
    const order = orderData || {
        id: "ord_123456",
        code: "ORDER-20250101-0001",
        status: "PENDING",
        createdAt: "2025-01-01T10:00:00Z",
        updatedAt: "2025-01-01T10:05:00Z",

        user: {
            id: "u_001",
            name: "Nguyễn Văn A",
            email: "a.nguyen@example.com",
            phone: "0901234567"
        },

        address: {
            id: "addr_001",
            label: "HOME",
            receiverName: "Nguyễn Văn A",
            phone: "0901234567",
            street: "123 Nguyễn Trãi",
            ward: "Phường 5",
            district: "Quận 3",
            city: "Hồ Chí Minh"
        },

        items: [
            {
                orderItemId: "oi_001",
                type: "PURCHASE",
                quantity: 2,

                book: {
                    id: "b001",
                    title: "Dế Mèn Phiêu Lưu Ký",
                    thumbnail: "https://cdn.../b001.jpg",
                    author: "Tô Hoài",
                    price: 120000
                },

                unitPrice: 120000,
                total: 240000
            },
            {
                orderItemId: "oi_002",
                type: "RENTAL",
                quantity: 1,

                book: {
                    id: "b002",
                    title: "Harry Potter",
                    thumbnail: "https://cdn.../b002.jpg",
                    author: "J.K. Rowling",
                    deposit: 100000,
                    rentalPrices: {
                        DAILY: 15000,
                        WEEKLY: 50000,
                        MONTHLY: 120000
                    }
                },

                rentalType: "WEEKLY",
                rentalDuration: 1,
                deposit: 100000,
                rentalPrice: 50000,
                totalRent: 50000,
                totalDeposit: 100000,
                total: 150000
            }
        ],

        pricing: {
            subtotal: 390000,
            discount: 0,
            shippingFee: 25000,
            finalTotal: 415000
        },

        payment: {
            method: "COD",
            status: "UNPAID",
            paidAt: null
        },

        rentalInfo: {
            hasRental: true,
            allReturnDue: "2025-01-15T00:00:00Z"
        },

        logs: [
            { time: "2025-01-01T10:00:00Z", message: "Order created" },
            { time: "2025-01-01T10:05:00Z", message: "Waiting for confirmation" }
        ]
    };

    // Hàm format tiền VND
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Hàm format ngày
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Hàm lấy màu sắc cho trạng thái
    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
            case 'SHIPPING': return 'bg-purple-100 text-purple-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            case 'COMPLETED': return 'bg-emerald-100 text-emerald-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Hàm lấy màu sắc cho trạng thái thanh toán
    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'PAID': return 'bg-green-100 text-green-800';
            case 'UNPAID': return 'bg-red-100 text-red-800';
            case 'PARTIAL': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Hàm chuyển đổi rental type
    const getRentalTypeText = (type) => {
        switch (type) {
            case 'DAILY': return 'Thuê ngày';
            case 'WEEKLY': return 'Thuê tuần';
            case 'MONTHLY': return 'Thuê tháng';
            default: return type;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Chi tiết đơn hàng
                </h1>
                <p className="text-gray-600">Quản lý và xem chi tiết đơn hàng #{order.code}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột trái - Thông tin chính */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Thông tin đơn hàng */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-1">Thông tin đơn hàng</h2>
                                    <p className="text-gray-600 text-sm">ID: {order.id}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                        {order.status === 'PENDING' ? 'Đang chờ xử lý' :
                                            order.status === 'CONFIRMED' ? 'Đã xác nhận' :
                                                order.status === 'SHIPPING' ? 'Đang vận chuyển' :
                                                    order.status === 'DELIVERED' ? 'Đã giao hàng' :
                                                        order.status === 'CANCELLED' ? 'Đã hủy' :
                                                            order.status === 'COMPLETED' ? 'Hoàn thành' : order.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                        Thời gian đơn hàng
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Ngày tạo:</span>
                                            <span className="font-medium">{formatDate(order.createdAt)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Cập nhật cuối:</span>
                                            <span className="font-medium">{formatDate(order.updatedAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-green-600" />
                                        Thông tin thanh toán
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Phương thức:</span>
                                            <span className="font-medium">
                                                {order.payment.method === 'COD' ? 'Thanh toán khi nhận hàng' :
                                                    order.payment.method === 'BANK_TRANSFER' ? 'Chuyển khoản ngân hàng' :
                                                        order.payment.method === 'VNPAY' ? 'VNPay' : order.payment.method}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Trạng thái:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment.status)}`}>
                                                {order.payment.status === 'PAID' ? 'Đã thanh toán' :
                                                    order.payment.status === 'UNPAID' ? 'Chưa thanh toán' :
                                                        order.payment.status === 'PARTIAL' ? 'Thanh toán một phần' : order.payment.status}
                                            </span>
                                        </div>
                                        {order.payment.paidAt && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Thời gian thanh toán:</span>
                                                <span className="font-medium">{formatDate(order.payment.paidAt)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Danh sách sản phẩm */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Package className="h-6 w-6 text-blue-600" />
                                Danh sách sản phẩm ({order.items.length})
                            </h2>
                        </div>

                        <div className="p-6">
                            <div className="space-y-6">
                                {order.items.map((item) => (
                                    <div key={item.orderItemId} className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        {/* Hình ảnh sách */}
                                        <div className="w-full md:w-24 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                            {item.book.thumbnail ? (
                                                <img
                                                    src={item.book.thumbnail}
                                                    alt={item.book.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <BookOpen className="h-8 w-8 text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Thông tin sách */}
                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${item.type === 'PURCHASE' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                                            }`}>
                                                            {item.type === 'PURCHASE' ? 'MUA' : 'THUÊ'}
                                                        </span>
                                                        {item.type === 'RENTAL' && (
                                                            <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                                {getRentalTypeText(item.rentalType)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className="font-bold text-gray-900 text-lg mb-1">{item.book.title}</h3>
                                                    <p className="text-gray-600 text-sm mb-2">Tác giả: {item.book.author}</p>
                                                    <p className="text-gray-600 text-sm">Số lượng: {item.quantity}</p>
                                                </div>

                                                {/* Giá */}
                                                <div className="text-right">
                                                    {item.type === 'PURCHASE' ? (
                                                        <div>
                                                            <p className="text-gray-600 text-sm">Đơn giá: {formatCurrency(item.unitPrice)}</p>
                                                            <p className="text-lg font-bold text-blue-600 mt-1">
                                                                {formatCurrency(item.total)}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-1">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <span className="text-gray-600 text-sm">Giá thuê:</span>
                                                                <span className="font-medium">{formatCurrency(item.rentalPrice)}</span>
                                                            </div>
                                                            <div className="flex items-center justify-end gap-2">
                                                                <span className="text-gray-600 text-sm">Tiền cọc:</span>
                                                                <span className="font-medium">{formatCurrency(item.deposit)}</span>
                                                            </div>
                                                            <div className="border-t border-gray-200 pt-1 mt-1">
                                                                <p className="text-lg font-bold text-green-600">
                                                                    {formatCurrency(item.total)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Thông tin thêm cho sách thuê */}
                                            {item.type === 'RENTAL' && (
                                                <div className="mt-3 pt-3 border-t border-gray-200">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <CalendarDays className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm text-gray-600">
                                                                Thời gian thuê: {item.rentalDuration} {item.rentalType === 'DAILY' ? 'ngày' :
                                                                    item.rentalType === 'WEEKLY' ? 'tuần' : 'tháng'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Shield className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm text-gray-600">
                                                                Tổng cọc: {formatCurrency(item.totalDeposit)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tổng kết giá */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="max-w-md ml-auto space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tạm tính:</span>
                                        <span className="font-medium">{formatCurrency(order.pricing.subtotal)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Giảm giá:</span>
                                        <span className="font-medium text-green-600">-{formatCurrency(order.pricing.discount)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Phí vận chuyển:</span>
                                        <span className="font-medium">{formatCurrency(order.pricing.shippingFee)}</span>
                                    </div>

                                    <div className="border-t border-gray-200 pt-3 mt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                                            <span className="text-2xl font-bold text-blue-600">
                                                {formatCurrency(order.pricing.finalTotal)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lịch sử đơn hàng */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <History className="h-6 w-6 text-blue-600" />
                                Lịch sử đơn hàng
                            </h2>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                {order.logs.map((log, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                <p className="text-gray-900 font-medium">{log.message}</p>
                                                <span className="text-sm text-gray-500">{formatDate(log.time)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cột phải - Thông tin phụ */}
                <div className="space-y-6">
                    {/* Thông tin khách hàng */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <User className="h-6 w-6 text-blue-600" />
                                Thông tin khách hàng
                            </h2>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600">Họ tên</p>
                                    <p className="font-medium text-gray-900">{order.user.name}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-medium text-gray-900">{order.user.email}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Số điện thoại</p>
                                    <p className="font-medium text-gray-900">{order.user.phone}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Mã khách hàng</p>
                                    <p className="font-medium text-gray-900">{order.user.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Địa chỉ giao hàng */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <MapPin className="h-6 w-6 text-blue-600" />
                                Địa chỉ giao hàng
                            </h2>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                {order.address.label && (
                                    <div>
                                        <p className="text-sm text-gray-600">Loại địa chỉ</p>
                                        <p className="font-medium text-gray-900">{order.address.label}</p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm text-gray-600">Người nhận</p>
                                    <p className="font-medium text-gray-900">{order.address.receiverName}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Số điện thoại nhận</p>
                                    <p className="font-medium text-gray-900">{order.address.phone}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Địa chỉ chi tiết</p>
                                    <p className="font-medium text-gray-900">
                                        {order.address.street}, {order.address.ward}, {order.address.district}, {order.address.city}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin thuê (nếu có) */}
                    {order.rentalInfo && order.rentalInfo.hasRental && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <CalendarDays className="h-6 w-6 text-green-600" />
                                    Thông tin thuê sách
                                </h2>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="h-5 w-5 text-green-600" />
                                            <span className="font-medium text-green-800">Hạn trả sách:</span>
                                        </div>
                                        <span className="font-bold text-green-800">
                                            {formatDate(order.rentalInfo.allReturnDue)}
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-600 space-y-2">
                                        <p className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span>Đơn hàng có chứa sách thuê</span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4 text-amber-500" />
                                            <span>Cần theo dõi thời gian trả sách</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions - Nút hành động */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Hành động</h2>
                        </div>

                        <div className="p-6">
                            <div className="space-y-3">
                                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                    Cập nhật trạng thái
                                </button>

                                {order.payment.status === 'UNPAID' && (
                                    <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                                        Đánh dấu đã thanh toán
                                    </button>
                                )}

                                {order.status === 'PENDING' && (
                                    <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                                        Hủy đơn hàng
                                    </button>
                                )}

                                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                                    In hóa đơn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetail;