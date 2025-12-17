import { Eye, Search, Filter, CheckCircle, Clock, Package, Ban, AlertCircle, ChevronDown, User, Book, MessageSquare, X } from 'lucide-react';
import React, { useState } from 'react';

const ReturnOrderManagement = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Dữ liệu mẫu
    const returnOrders = [
        {
            orderId: "RET_001",
            userId: "USER_001",
            userName: "Nguyễn Văn A",
            userEmail: "nguyenvana@email.com",
            userPhone: "0123456789",
            requestDate: "2025-02-10",
            status: "pending",
            noteFromUser: "Tôi muốn trả sớm tất cả sách đã đọc.",
            noteFromAdmin: "",
            processedDate: null,
            items: [
                {
                    bookId: "BOOK_001",
                    bookTitle: "Đắc Nhân Tâm",
                    bookImage: "https://example.com/book/dnt.jpg",
                    rentDate: "2025-02-01",
                    dueDate: "2025-02-15",
                    fee: 0,
                    itemStatus: "waiting"
                },
                {
                    bookId: "BOOK_005",
                    bookTitle: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
                    bookImage: "https://example.com/book/ttdgbn.jpg",
                    rentDate: "2025-01-20",
                    dueDate: "2025-02-20",
                    fee: 0,
                    itemStatus: "waiting"
                }
            ]
        },
        {
            orderId: "RET_002",
            userId: "USER_002",
            userName: "Trần Thị B",
            userEmail: "tranthib@email.com",
            userPhone: "0987654321",
            requestDate: "2025-01-28",
            status: "processing",
            noteFromUser: "Tôi đã gửi sách qua bưu điện.",
            noteFromAdmin: "Kho đã nhận 1 phần.",
            processedDate: null,
            items: [
                {
                    bookId: "BOOK_004",
                    bookTitle: "7 Thói Quen Hiệu Quả",
                    rentDate: "2025-01-10",
                    dueDate: "2025-01-20",
                    fee: 30000,
                    itemStatus: "received"
                },
                {
                    bookId: "BOOK_006",
                    bookTitle: "Hai Số Phận",
                    rentDate: "2025-01-08",
                    dueDate: "2025-01-25",
                    fee: 0,
                    itemStatus: "waiting"
                }
            ]
        },
        {
            orderId: "RET_003",
            userId: "USER_003",
            userName: "Lê Văn C",
            userEmail: "levanc@email.com",
            userPhone: "0912345678",
            requestDate: "2025-01-05",
            status: "completed",
            noteFromUser: "",
            noteFromAdmin: "Đã kiểm tra đầy đủ",
            processedDate: "2025-01-08",
            items: [
                {
                    bookId: "BOOK_002",
                    bookTitle: "Tắt Đèn",
                    rentDate: "2024-12-20",
                    dueDate: "2025-01-10",
                    fee: 0,
                    itemStatus: "received"
                },
                {
                    bookId: "BOOK_003",
                    bookTitle: "Harry Potter 1",
                    rentDate: "2024-12-20",
                    dueDate: "2025-01-10",
                    fee: 0,
                    itemStatus: "received"
                }
            ]
        },
        {
            orderId: "RET_004",
            userId: "USER_004",
            userName: "Phạm Thị D",
            userEmail: "phamthid@email.com",
            userPhone: "0934567890",
            requestDate: "2025-02-05",
            status: "rejected",
            noteFromUser: "Tôi muốn trả sách sớm",
            noteFromAdmin: "Sách bị hư hỏng nặng, không thể chấp nhận",
            processedDate: "2025-02-06",
            items: [
                {
                    bookId: "BOOK_007",
                    bookTitle: "Nhà Giả Kim",
                    rentDate: "2025-01-15",
                    dueDate: "2025-02-05",
                    fee: 50000,
                    itemStatus: "rejected"
                }
            ]
        }
    ];

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                color: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
                icon: <Clock className="w-4 h-4" />,
                text: 'Chờ xử lý',
                bgColor: 'bg-yellow-50'
            },
            processing: {
                color: 'bg-blue-100 text-blue-800 border border-blue-200',
                icon: <Package className="w-4 h-4" />,
                text: 'Đang xử lý',
                bgColor: 'bg-blue-50'
            },
            completed: {
                color: 'bg-green-100 text-green-800 border border-green-200',
                icon: <CheckCircle className="w-4 h-4" />,
                text: 'Hoàn thành',
                bgColor: 'bg-green-50'
            },
            rejected: {
                color: 'bg-red-100 text-red-800 border border-red-200',
                icon: <Ban className="w-4 h-4" />,
                text: 'Từ chối',
                bgColor: 'bg-red-50'
            }
        };
        return configs[status] || configs.pending;
    };

    const getItemStatusConfig = (status) => {
        const configs = {
            waiting: {
                color: 'bg-gray-100 text-gray-700',
                text: 'Chờ nhận',
                icon: <Clock className="w-4 h-4" />
            },
            received: {
                color: 'bg-green-100 text-green-700',
                text: 'Đã nhận',
                icon: <CheckCircle className="w-4 h-4" />
            },
            rejected: {
                color: 'bg-red-100 text-red-700',
                text: 'Đã từ chối',
                icon: <Ban className="w-4 h-4" />
            }
        };
        return configs[status] || configs.waiting;
    };

    // Tính toán thống kê
    const stats = {
        total: returnOrders.length,
        pending: returnOrders.filter(o => o.status === 'pending').length,
        processing: returnOrders.filter(o => o.status === 'processing').length,
        completed: returnOrders.filter(o => o.status === 'completed').length,
        rejected: returnOrders.filter(o => o.status === 'rejected').length,
    };

    // Lọc dữ liệu
    const filteredOrders = returnOrders.filter(order => {
        const matchesSearch = searchTerm === '' ||
            order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userEmail.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const handleSelectOrder = (orderId) => {
        setSelectedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    const handleSelectAll = () => {
        if (selectedOrders.length === currentOrders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(currentOrders.map(order => order.orderId));
        }
    };

    const handleUpdateStatus = (orderId, newStatus) => {
        // Trong thực tế, gọi API ở đây
        console.log(`Cập nhật order ${orderId} thành trạng thái: ${newStatus}`);
        setShowModal(false);
    };

    const handleUpdateItemStatus = (orderId, bookId, newStatus) => {
        // Trong thực tế, gọi API ở đây
        console.log(`Cập nhật sách ${bookId} trong order ${orderId} thành: ${newStatus}`);
    };

    const handleBulkAction = (action) => {
        if (selectedOrders.length === 0) return;
        console.log(`Thực hiện ${action} cho các order:`, selectedOrders);
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Yêu Cầu Trả Sách</h1>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo mã yêu cầu, tên người dùng, email..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <select
                                    className="appearance-none bg-white border border-gray-300 rounded-lg py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="pending">Chờ xử lý</option>
                                    <option value="processing">Đang xử lý</option>
                                    <option value="completed">Hoàn thành</option>
                                    <option value="rejected">Từ chối</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>

                            <button className="flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <Filter className="w-4 h-4 mr-2" />
                                Lọc
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedOrders.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                            <span className="text-blue-700 font-medium">
                                Đã chọn {selectedOrders.length} yêu cầu
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handleBulkAction('approve')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                                Duyệt
                            </button>
                            <button
                                onClick={() => handleBulkAction('reject')}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                                Từ chối
                            </button>
                            <button
                                onClick={() => setSelectedOrders([])}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                            >
                                Bỏ chọn
                            </button>
                        </div>
                    </div>
                )}

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã yêu cầu</th>
                                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày yêu cầu</th>
                                    <th className="py-4 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Số sách</th>
                                    <th className="py-4 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th className="py-4 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Phí tổng</th>
                                    <th className="py-4 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentOrders.map((order) => {
                                    const statusConfig = getStatusConfig(order.status);
                                    const totalFee = order.items.reduce((sum, item) => sum + item.fee, 0);

                                    return (
                                        <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">

                                            <td className="py-4 px-6">
                                                <div>
                                                    <div className="font-medium text-gray-900">{order.orderId}</div>
                                                    <div className="text-sm text-gray-500">User: {order.userId}</div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm text-gray-900">{order.requestDate}</div>
                                                {order.processedDate && (
                                                    <div className="text-xs text-gray-500">Xử lý: {order.processedDate}</div>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex items-center justify-center">
                                                    <span className="font-medium">{order.items.length}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex items-center justify-center">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                                        {statusConfig.icon}
                                                        <span className="ml-1.5">{statusConfig.text}</span>
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex items-center justify-center">
                                                    <span className={`font-medium ${totalFee > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                        {formatCurrency(totalFee)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => handleViewDetails(order)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredOrders.length)} trên {filteredOrders.length} yêu cầu
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Trước
                                </button>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-1.5 rounded-lg ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy yêu cầu nào</h3>
                        <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                    </div>
                )}
            </div>

            {/* Detail Modal - Admin View */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-gray-600/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Chi tiết yêu cầu trả sách</h3>
                                <p className="text-sm text-gray-500">{selectedOrder.orderId}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                                    <CheckCircle className="w-4 h-4 inline mr-2" />
                                    Duyệt yêu cầu
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Order Info */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* User Info Card */}
                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                        <h4 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                                            <User className="w-4 h-4 mr-2" />
                                            Thông tin người dùng
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Họ tên</label>
                                                <p className="font-medium">{selectedOrder.userName}</p>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Email</label>
                                                <p className="font-medium">{selectedOrder.userEmail}</p>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Số điện thoại</label>
                                                <p className="font-medium">{selectedOrder.userPhone}</p>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Mã người dùng</label>
                                                <p className="font-medium">{selectedOrder.userId}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Books List */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Danh sách sách cần trả</h4>
                                        <div className="space-y-4">
                                            {selectedOrder.items.map((item, index) => {
                                                const itemStatus = getItemStatusConfig(item.itemStatus);
                                                const isOverdue = new Date(item.dueDate) < new Date();

                                                return (
                                                    <div key={index} className="border border-gray-200 rounded-xl p-4">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div className="flex items-start space-x-4">
                                                                <div className="w-16 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                    <Book className="w-8 h-8 text-gray-400" />
                                                                </div>
                                                                <div>
                                                                    <h5 className="font-semibold text-gray-900">{item.bookTitle}</h5>
                                                                    <p className="text-sm text-gray-500">Mã sách: {item.bookId}</p>
                                                                    <div className="flex items-center space-x-4 mt-2 text-sm">
                                                                        <span className="text-gray-600">Mượn: {item.rentDate}</span>
                                                                        <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                                                                            Hạn: {item.dueDate}
                                                                        </span>
                                                                    </div>
                                                                    {isOverdue && (
                                                                        <div className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 rounded text-xs mt-2">
                                                                            <AlertCircle className="w-3 h-3 mr-1" />
                                                                            Quá hạn trả
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="text-right">
                                                                <div className="mb-2">
                                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${itemStatus.color}`}>
                                                                        {itemStatus.icon}
                                                                        <span className="ml-1.5">{itemStatus.text}</span>
                                                                    </span>
                                                                </div>
                                                                <div className="text-lg font-semibold text-gray-900">
                                                                    {formatCurrency(item.fee)}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-sm text-gray-600">Cập nhật trạng thái:</span>
                                                                <select
                                                                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                                                                    value={item.itemStatus}
                                                                    onChange={(e) => handleUpdateItemStatus(selectedOrder.orderId, item.bookId, e.target.value)}
                                                                >
                                                                    <option value="waiting">Chờ nhận</option>
                                                                    <option value="received">Đã nhận</option>
                                                                    <option value="rejected">Từ chối</option>
                                                                </select>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-sm text-gray-600">Cập nhật phí:</span>
                                                                <input
                                                                    type="number"
                                                                    className="w-32 border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                                                                    placeholder="Phí (VNĐ)"
                                                                    value={item.fee}
                                                                    onChange={(e) => console.log('Update fee:', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Panel */}
                                <div className="space-y-6">
                                    {/* Order Status */}
                                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                                        <h4 className="text-sm font-medium text-gray-500 mb-4">Trạng thái yêu cầu</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-2">Trạng thái hiện tại</label>
                                                <div className={`inline-flex items-center px-4 py-2 rounded-lg ${getStatusConfig(selectedOrder.status).color}`}>
                                                    {getStatusConfig(selectedOrder.status).icon}
                                                    <span className="ml-2 font-medium">{getStatusConfig(selectedOrder.status).text}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs text-gray-500 mb-2">Cập nhật trạng thái</label>
                                                <select
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                                                    value={selectedOrder.status}
                                                    onChange={(e) => console.log('Update order status:', e.target.value)}
                                                >
                                                    <option value="pending">Chờ xử lý</option>
                                                    <option value="processing">Đang xử lý</option>
                                                    <option value="completed">Hoàn thành</option>
                                                    <option value="rejected">Từ chối</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs text-gray-500 mb-2">Ngày xử lý</label>
                                                <input
                                                    type="date"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                                                    value={selectedOrder.processedDate || ''}
                                                    onChange={(e) => console.log('Update processed date:', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                                        <h4 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            Ghi chú
                                        </h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-2">Ghi chú từ người dùng</label>
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-gray-700 text-sm">{selectedOrder.noteFromUser || 'Không có ghi chú'}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs text-gray-500 mb-2">Ghi chú của quản lý</label>
                                                <textarea
                                                    className="w-full h-32 border border-gray-300 rounded-lg p-3 text-sm"
                                                    placeholder="Thêm ghi chú..."
                                                    defaultValue={selectedOrder.noteFromAdmin}
                                                    onChange={(e) => console.log('Update admin note:', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                                        <h4 className="text-sm font-medium text-gray-500 mb-4">Tổng kết</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Tổng số sách:</span>
                                                <span className="font-medium">{selectedOrder.items.length}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Số sách đã nhận:</span>
                                                <span className="font-medium text-green-600">
                                                    {selectedOrder.items.filter(item => item.itemStatus === 'received').length}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Tổng phí:</span>
                                                <span className="font-semibold text-lg text-red-600">
                                                    {formatCurrency(selectedOrder.items.reduce((sum, item) => sum + item.fee, 0))}
                                                </span>
                                            </div>
                                            <div className="pt-3 border-t border-blue-200">
                                                <button
                                                    onClick={() => handleUpdateStatus(selectedOrder.orderId, 'completed')}
                                                    className="w-full py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                                >
                                                    Hoàn tất xử lý
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnOrderManagement;