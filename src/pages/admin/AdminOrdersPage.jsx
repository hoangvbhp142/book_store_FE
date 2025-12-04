import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Eye,
    Download,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    CreditCard,
    Wallet,
    User,
    ShoppingBag,
    DollarSign,
    AlertCircle,
    Filter,
    ChevronDown
} from 'lucide-react';
import PagingBar from '../../components/PagingBar';

const AdminOrdersPage = () => {
    // Dữ liệu mẫu từ API response
    const [orders, setOrders] = useState([
        {
            id: "ord_001",
            code: "ORDER-20250101-0001",
            status: "PENDING",
            createdAt: "2025-01-01T10:00:00Z",

            user: {
                id: "u_001",
                name: "Nguyễn Văn A",
                phone: "0901234567"
            },

            summary: {
                totalItems: 3,
                hasRentalItems: true,
                rentalReturnDue: "2025-01-15T00:00:00Z",
                subtotal: 390000,
                finalTotal: 415000
            },

            payment: {
                method: "COD",
                status: "UNPAID"
            }
        },
        {
            id: "ord_002",
            code: "ORDER-20250102-0005",
            status: "COMPLETED",
            createdAt: "2025-01-02T09:15:00Z",

            user: {
                id: "u_002",
                name: "Trần Thị B",
                phone: "0908888999"
            },

            summary: {
                totalItems: 1,
                hasRentalItems: false,
                rentalReturnDue: null,
                subtotal: 120000,
                finalTotal: 130000
            },

            payment: {
                method: "VNPAY",
                status: "PAID"
            }
        },
        {
            id: "ord_003",
            code: "ORDER-20250103-0010",
            status: "SHIPPING",
            createdAt: "2025-01-03T14:30:00Z",

            user: {
                id: "u_003",
                name: "Lê Văn C",
                phone: "0907777888"
            },

            summary: {
                totalItems: 2,
                hasRentalItems: true,
                rentalReturnDue: "2025-01-20T00:00:00Z",
                subtotal: 250000,
                finalTotal: 275000
            },

            payment: {
                method: "BANK_TRANSFER",
                status: "PAID"
            }
        },
        {
            id: "ord_004",
            code: "ORDER-20250104-0015",
            status: "CANCELLED",
            createdAt: "2025-01-04T11:45:00Z",

            user: {
                id: "u_004",
                name: "Phạm Thị D",
                phone: "0906666777"
            },

            summary: {
                totalItems: 4,
                hasRentalItems: false,
                rentalReturnDue: null,
                subtotal: 480000,
                finalTotal: 505000
            },

            payment: {
                method: "COD",
                status: "REFUNDED"
            }
        },
        {
            id: "ord_005",
            code: "ORDER-20250105-0020",
            status: "DELIVERED",
            createdAt: "2025-01-05T16:20:00Z",

            user: {
                id: "u_005",
                name: "Hoàng Văn E",
                phone: "0905555666"
            },

            summary: {
                totalItems: 1,
                hasRentalItems: true,
                rentalReturnDue: "2025-01-25T00:00:00Z",
                subtotal: 180000,
                finalTotal: 205000
            },

            payment: {
                method: "VNPAY",
                status: "PAID"
            }
        }
    ]);

    const [meta, setMeta] = useState({
        total: 120,
        page: 1,
        limit: 20,
        pageCount: 6,
        hasNext: true,
        hasPrev: false
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');

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

    // Hàm lấy icon cho trạng thái
    const getStatusIcon = (status) => {
        switch (status) {
            case "PENDING":
                return <Clock className="h-4 w-4" />;
            case "CONFIRMED":
                return <Package className="h-4 w-4" />;
            case "SHIPPING":
                return <Truck className="h-4 w-4" />;
            case "DELIVERED":
                return <CheckCircle className="h-4 w-4" />;
            case "COMPLETED":
                return <CheckCircle className="h-4 w-4" />;
            case "CANCELLED":
                return <XCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    // Hàm lấy màu sắc cho trạng thái
    const getStatusVariant = (status) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "CONFIRMED":
                return "bg-blue-100 text-blue-800";
            case "SHIPPING":
                return "bg-purple-100 text-purple-800";
            case "DELIVERED":
                return "bg-green-100 text-green-800";
            case "COMPLETED":
                return "bg-emerald-100 text-emerald-800";
            case "CANCELLED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Hàm lấy text hiển thị cho trạng thái
    const getStatusText = (status) => {
        switch (status) {
            case "PENDING": return "Chờ xử lý";
            case "CONFIRMED": return "Đã xác nhận";
            case "SHIPPING": return "Đang giao";
            case "DELIVERED": return "Đã giao";
            case "COMPLETED": return "Hoàn thành";
            case "CANCELLED": return "Đã hủy";
            default: return status;
        }
    };

    // Hàm lấy màu sắc cho trạng thái thanh toán
    const getPaymentStatusVariant = (status) => {
        switch (status) {
            case "PAID":
                return "bg-green-100 text-green-800";
            case "UNPAID":
                return "bg-red-100 text-red-800";
            case "PARTIAL":
                return "bg-yellow-100 text-yellow-800";
            case "REFUNDED":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
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

    // Tính toán thống kê từ dữ liệu orders
    const calculateStats = () => {
        const stats = {
            total: orders.length,
            pending: orders.filter(o => o.status === 'PENDING').length,
            shipping: orders.filter(o => o.status === 'SHIPPING').length,
            delivered: orders.filter(o => o.status === 'DELIVERED').length,
            completed: orders.filter(o => o.status === 'COMPLETED').length,
            cancelled: orders.filter(o => o.status === 'CANCELLED').length,
            totalRevenue: orders.reduce((sum, order) => sum + order.summary.finalTotal, 0),
            hasRental: orders.filter(o => o.summary.hasRentalItems).length,
            unpaid: orders.filter(o => o.payment.status === 'UNPAID').length
        };
        return stats;
    };

    const stats = calculateStats();

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

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 bg-gray-50/30">
                <div className="container mx-auto p-4 md:p-6">
                    {/* Thống kê nhanh */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Tổng đơn hàng</p>
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                    <p className="text-xs text-gray-500 mt-1">{formatCurrency(stats.totalRevenue)}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Đang xử lý</p>
                                    <p className="text-2xl font-bold">{stats.pending}</p>
                                    <p className="text-xs text-gray-500 mt-1">Chờ xác nhận</p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <Clock className="h-6 w-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Đang giao hàng</p>
                                    <p className="text-2xl font-bold">{stats.shipping}</p>
                                    <p className="text-xs text-gray-500 mt-1">Trên đường giao</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Truck className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Chưa thanh toán</p>
                                    <p className="text-2xl font-bold">{stats.unpaid}</p>
                                    <p className="text-xs text-gray-500 mt-1">Đang chờ thanh toán</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                        </div>
                    </div>

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
                                        <option value="PENDING">Chờ xử lý</option>
                                        <option value="CONFIRMED">Đã xác nhận</option>
                                        <option value="SHIPPING">Đang giao</option>
                                        <option value="DELIVERED">Đã giao</option>
                                        <option value="COMPLETED">Hoàn thành</option>
                                        <option value="CANCELLED">Đã hủy</option>
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
                                        <option value="PAID">Đã thanh toán</option>
                                        <option value="UNPAID">Chưa thanh toán</option>
                                        <option value="PARTIAL">Thanh toán một phần</option>
                                        <option value="REFUNDED">Đã hoàn tiền</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                                
                                <button className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-transparent">
                                    <Download className="h-4 w-4" />
                                    Xuất Excel
                                </button>
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
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
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
                                                    <p className="text-xs text-gray-500 font-mono">{order.id}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <User className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{order.user.name}</p>
                                                        <p className="text-sm text-gray-500">{order.user.phone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${order.summary.hasRentalItems ? 'bg-green-100' : 'bg-blue-100'}`}>
                                                        {order.summary.hasRentalItems ? (
                                                            <Calendar className="h-4 w-4 text-green-600" />
                                                        ) : (
                                                            <Package className="h-4 w-4 text-blue-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{order.summary.totalItems} sản phẩm</p>
                                                        <p className="text-xs text-gray-500">
                                                            {order.summary.hasRentalItems ? 'Có sách thuê' : 'Chỉ mua'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <p className="font-bold text-gray-900">{formatCurrency(order.summary.finalTotal)}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatCurrency(order.summary.subtotal)} + phí
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusVariant(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        {getStatusText(order.status)}
                                                    </span>
                                                    {order.summary.hasRentalItems && order.summary.rentalReturnDue && (
                                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            Hạn trả: {formatDate(order.summary.rentalReturnDue)}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        {getPaymentMethodIcon(order.payment.method)}
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {getPaymentMethodText(order.payment.method)}
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
                                                    <Link
                                                        to={`/admin/orders/${order.id}`}
                                                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    <button 
                                                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Tải hóa đơn"
                                                    >
                                                        <Download className="h-4 w-4" />
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
                                Hiển thị {filteredOrders.length} trên tổng số {meta.total} đơn hàng
                            </p>
                            <PagingBar 
                                pageSize={meta.limit} 
                                totalPages={meta.pageCount}
                                currentPage={meta.page}
                                hasNext={meta.hasNext}
                                hasPrev={meta.hasPrev}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminOrdersPage;