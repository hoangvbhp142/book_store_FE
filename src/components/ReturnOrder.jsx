import { Eye, Clock, Package, CheckCircle, Ban, Calendar, MessageSquare } from 'lucide-react';
import React, { useState } from 'react';
import { formatCurrency, formatDate, formatDateOnly } from '../app/utils';
import rentalReturnApi from '../api/rentalReturnApi';

const ReturnOrder = ({ returnOrders }) => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                color: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
                icon: <Clock className="w-4 h-4" />,
                text: 'Chờ xử lý',
                description: 'Yêu cầu đã được gửi và đang chờ xử lý'
            },
            processing: {
                color: 'bg-blue-50 text-blue-700 border border-blue-200',
                icon: <Package className="w-4 h-4" />,
                text: 'Đang xử lý',
                description: 'Thư viện đang kiểm tra sách'
            },
            completed: {
                color: 'bg-green-50 text-green-700 border border-green-200',
                icon: <CheckCircle className="w-4 h-4" />,
                text: 'Hoàn thành',
                description: 'Yêu cầu đã được xử lý xong'
            },
            rejected: {
                color: 'bg-red-50 text-red-700 border border-red-200',
                icon: <Ban className="w-4 h-4" />,
                text: 'Từ chối',
                description: 'Yêu cầu đã bị từ chối'
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
                text: 'Từ chối',
                icon: <Ban className="w-4 h-4" />
            }
        };
        return configs[status] || configs.waiting;
    };

    const getRentalFee = (order, item) => {
        switch (order.rentalType) {
            case 'DAILY':
                return item.book.rentPricePerDay;
            case 'WEEKLY':
                return item.book.rentPricePerWeek;
            case 'MONTHLY':
                return item.book.rentPricePerMonth;
            default:
                return 0;
        }
    }

    const getRentalType = (order) => {
        switch (order.rentalType) {
            case 'DAILY':
                return 'Theo ngày';
            case 'WEEKLY':
                return 'Theo tuần';
            case 'MONTHLY':
                return 'Theo tháng';
            default:
                return '';
        }
    }

    const handleViewDetails = async (order) => {
        try {
            const response = await rentalReturnApi.getById(order.id);
            setSelectedOrder(response);
            setShowModal(true);
            console.log(response);

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Đã có lỗi xảy ra khi tải dữ liệu");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Orders List */}
                <div className="space-y-6">
                    {returnOrders.map((order) => {
                        const statusConfig = getStatusConfig(order.status);

                        return (
                            <div
                                key={order.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                            >
                                {/* Header */}
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Yêu cầu trả sách #{order.id.slice(0, 8)}
                                                </h3>

                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}
                                                >
                                                    {statusConfig.icon}
                                                    <span className="ml-1.5">{statusConfig.text}</span>
                                                </span>
                                            </div>

                                            <div className="flex items-center text-sm text-gray-500 flex-wrap gap-2">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    <span>Gửi ngày: {formatDate(order.createdAt)}</span>
                                                </div>

                                                {order.receivedAt && (
                                                    <div className="flex items-center">
                                                        <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                                                        <span>Shop đã nhận: {formatDate(order.receivedAt)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleViewDetails(order)}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Books */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-3">
                                                Thông tin sách
                                            </h4>

                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Hình thức:</span>
                                                    <span className="font-medium">
                                                        {order.shippingMethod === 'SHOP_DELIVERY'
                                                            ? 'Gửi về thư viện'
                                                            : 'Khác'}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Hoàn tiền:</span>
                                                    <span
                                                        className={`font-semibold ${Number(order.refundAmount) > 0
                                                            ? 'text-green-600'
                                                            : 'text-gray-400'
                                                            }`}
                                                    >
                                                        {isNaN(Number(order.refundAmount))
                                                            ? 'Đang xử lý'
                                                            : formatCurrency(order.refundAmount)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Customer note */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-3">
                                                Ghi chú của bạn
                                            </h4>
                                            <div className="bg-gray-50 p-3 rounded-lg min-h-[80px]">
                                                {order.customerNote ? (
                                                    <p className="text-gray-700">{order.customerNote}</p>
                                                ) : (
                                                    <p className="text-gray-400 italic">
                                                        Không có ghi chú
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Admin note */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-3">
                                                Phản hồi từ thư viện
                                            </h4>
                                            <div className="bg-blue-50 p-3 rounded-lg min-h-[80px]">
                                                {order.adminNote ? (
                                                    <div className="flex items-start">
                                                        <MessageSquare className="w-4 h-4 text-blue-500 mt-0.5 mr-2" />
                                                        <p className="text-blue-700">{order.adminNote}</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-blue-400 italic">
                                                        Chưa có phản hồi
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        );
                    })}
                </div>

                {/* Empty State */}
                {returnOrders.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có yêu cầu trả sách nào</h3>
                        <p className="text-gray-500">Bạn chưa gửi yêu cầu trả sách nào</p>
                    </div>
                )}
            </div>

            {/* Detail Modal - User View */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-gray-600/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Chi tiết yêu cầu trả sách</h3>
                                <p className="text-sm text-gray-500">{selectedOrder.orderId}</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Order Info Card */}
                            <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-3">Thông tin yêu cầu</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Mã yêu cầu:</span>
                                                <span className="font-medium">{selectedOrder.id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Ngày yêu cầu:</span>
                                                <span className="font-medium">{formatDate(selectedOrder.createdAt)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Loại thuê:</span>
                                                <span className="font-medium">{getRentalType(selectedOrder.order)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Trạng thái:</span>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusConfig(selectedOrder.status).color}`}>
                                                    {getStatusConfig(selectedOrder.status).icon}
                                                    <span className="ml-1.5">{getStatusConfig(selectedOrder.status).text}</span>
                                                </span>
                                            </div>
                                            {selectedOrder.processedDate && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Ngày xử lý:</span>
                                                    <span className="font-medium">{selectedOrder.processedDate}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-3">Thông tin liên hệ</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Ghi chú của bạn:</p>
                                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                    <p className="text-gray-700">{selectedOrder.customerNote || 'Không có ghi chú'}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Phản hồi từ thư viện:</p>
                                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                                    <p className="text-blue-700">
                                                        {selectedOrder.adminNote || 'Chưa có phản hồi'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Books List */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Danh sách sách</h4>
                                <div className="space-y-4">
                                    {selectedOrder.rentalItems.map((item, index) => {
                                        const itemStatus = getItemStatusConfig(item.itemStatus);
                                        const isOverdue = new Date(item.dueDate) < new Date() && item.itemStatus === 'waiting';

                                        return (
                                            <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-16 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                            <img
                                                                src={item.book.photoUrl.replace("minio:9000", "localhost:9000")}
                                                                alt={item.book.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h5 className="font-semibold text-gray-900 text-lg">{item.book.title}</h5>
                                                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                                                <div className="flex items-center">
                                                                    <Calendar className="w-4 h-4 mr-1" />
                                                                    <span>Mượn: {formatDateOnly(selectedOrder.order.rentStart)}</span>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <Calendar className="w-4 h-4 mr-1" />
                                                                    <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                                                                        Hạn trả: {formatDateOnly(selectedOrder.order.rentDue)}
                                                                    </span>
                                                                </div>

                                                            </div>

                                                            {isOverdue && (
                                                                <div className="mt-2 inline-flex items-center px-2 py-1 bg-red-50 text-red-700 rounded text-sm">
                                                                    <Clock className="w-3 h-3 mr-1" />
                                                                    Quá hạn trả
                                                                </div>
                                                            )}

                                                            <div className='mt-2 flex flex-wrap gap-4 text-sm text-gray-600'>
                                                                <div className="flex items-center">
                                                                    <span className="flex gap-1 font-medium items-center">
                                                                        Phí: <span className='text-green-600'>{formatCurrency(getRentalFee(selectedOrder.order, item))}</span>
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <span className="flex gap-1 font-medium items-center">
                                                                        Tiền cọc: <span className='text-amber-600'>{formatCurrency(item.book.rentDeposit)}</span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${itemStatus.color}`}>
                                                            {itemStatus.icon}
                                                            <span className="ml-1.5">{itemStatus.text}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnOrder;