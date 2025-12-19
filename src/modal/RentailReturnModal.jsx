import { AlertCircle, Ban, Book, CheckCircle, Clock, MessageSquare, Package, User, X } from 'lucide-react';
import React, { useState } from 'react'
import { formatCurrency, formatDate, formatDateOnly } from '../app/utils';
import { toast } from 'react-toastify';

const RentailReturnModal = ({
    selectedOrder,
    onClose,
    getStatusConfig,
    acceptReturnRequest,
    completeReturnRequest,
}) => {

    const [formData, setFormData] = useState({
        status: "COMPLETED",
        adminNote: "",
        receivedAt: new Date().toISOString(),
        rentalItems: []
    })

    const [rentalItems, setRentalItems] = useState(selectedOrder.rentalItems.map(item => ({
        id: item.id,
        returnQuantity: item.returnQuantity || 0,
        penalty: item.penalty || 0
    })));

    const completeRequest = () => {
        if (rentalItems.some(ri => ri.returnQuantity === 0)) {
            toast.error('Vui lòng nhập số lượng trả cho tất cả các mục thuê.');
            return;
        }
        formData.rentalItems = rentalItems;
        console.log(formData);
        completeReturnRequest(selectedOrder.id, { status: 'COMPLETED' });
    }

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

    return (
        <div className="fixed inset-0 bg-gray-600/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Chi tiết yêu cầu trả sách</h3>
                        <p className="text-sm text-gray-500">{selectedOrder.orderId}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => acceptReturnRequest(selectedOrder.id)}
                            className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm ${selectedOrder.status === 'PENDING' ? '' : 'hidden'}`}>
                            <CheckCircle className="w-4 h-4 inline mr-2" />
                            Duyệt yêu cầu
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Order Details */}
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
                                        <p className="font-medium">{selectedOrder.user.fullName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Email</label>
                                        <p className="font-medium">{selectedOrder.user.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Số điện thoại</label>
                                        <p className="font-medium">{selectedOrder.user.phone}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Mã người dùng</label>
                                        <p className="font-medium">{selectedOrder.userId}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Original Order Info */}
                            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                                <h4 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                                    <Package className="w-4 h-4 mr-2" />
                                    Thông tin đơn thuê gốc
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Mã đơn thuê</label>
                                        <p className="font-medium">{selectedOrder.orderId}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Ngày thuê</label>
                                        <p className="font-medium">{formatDateOnly(selectedOrder.order.rentStart)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Hạn trả</label>
                                        <p className="font-medium">{formatDateOnly(selectedOrder.order.rentDue)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Loại thuê</label>
                                        <p className="font-medium">
                                            {selectedOrder.order.rentalType === 'MONTHLY' ? 'Theo tháng' :
                                                selectedOrder.order.rentalType === 'WEEKLY' ? 'Theo tuần' : 'Theo ngày'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Tổng tiền thuê</label>
                                        <p className="font-medium text-green-600">
                                            {formatCurrency(selectedOrder.order.totalRentAmount)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Tiền đặt cọc</label>
                                        <p className="font-medium text-amber-600">
                                            {formatCurrency(selectedOrder.order.depositAmount)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Books to Return */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Danh sách sách cần trả</h4>
                                <div className="space-y-4">
                                    {selectedOrder.rentalItems.map((item) => {
                                        const today = new Date();
                                        const dueDate = new Date(selectedOrder.order.rentDue);
                                        const isOverdue = today > dueDate;
                                        const overdueDays = isOverdue ?
                                            Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24)) : 0;

                                        const penaltyFee = overdueDays * parseFloat(item.book.rentPenaltyPerDay);
                                        const itemStatus = getItemStatusConfig(item.state);

                                        return (
                                            <div key={item.id} className="border border-gray-200 rounded-xl p-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-start space-x-4">
                                                        <div className="w-16 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                            <img
                                                                src={item.book.photoUrl.replace("minio:9000", "localhost:9000")}
                                                                alt={item.book.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h5 className="font-semibold text-gray-900">{item.book.title}</h5>
                                                            <p className="text-sm text-gray-500">SKU: {item.book.sku}</p>
                                                            <p className="text-sm text-gray-500">Mã sách: {item.bookId}</p>
                                                            <div className="flex items-center space-x-4 mt-2 text-sm">
                                                                <span className="text-gray-600">
                                                                    Thuê: {formatDateOnly(selectedOrder.order.rentStart)}
                                                                </span>
                                                                <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                                                                    Hạn: {formatDateOnly(selectedOrder.order.rentDue)}
                                                                </span>
                                                            </div>
                                                            {isOverdue && (
                                                                <div className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 rounded text-xs mt-2">
                                                                    <AlertCircle className="w-3 h-3 mr-1" />
                                                                    Quá hạn {overdueDays} ngày
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="mb-2">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${itemStatus?.color || 'bg-gray-100 text-gray-800'}`}>
                                                                {itemStatus?.icon || <Clock className="w-3 h-3" />}
                                                                <span className="ml-1.5">{itemStatus?.text || 'Chờ xử lý'}</span>
                                                            </span>
                                                        </div>
                                                        <div className="space-y-1">
                                                            {penaltyFee > 0 && (
                                                                <div className="text-sm">
                                                                    <span className="text-gray-600">Phí phạt: </span>
                                                                    <span className="font-semibold text-red-600">
                                                                        {formatCurrency(penaltyFee)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div className="text-sm">
                                                                <span className="text-gray-600">Đặt cọc: </span>
                                                                <span className="font-semibold text-amber-600">
                                                                    {formatCurrency(item.book.rentDeposit)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 items-center justify-between pt-4 border-t border-gray-200">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-gray-600">Trạng thái trả:</span>
                                                        <select
                                                            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                                                            value={item.state || 'waiting'}
                                                        >
                                                            <option value="waiting">Chờ nhận</option>
                                                            <option value="received">Đã nhận</option>
                                                            <option value="damaged">Hư hỏng</option>
                                                            <option value="lost">Mất sách</option>
                                                        </select>
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-gray-600">Số lượng trả:</span>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={item.quantity}
                                                            name='returnQuantity'
                                                            defaultValue={0}
                                                            className="w-20 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-center"
                                                            placeholder="0"
                                                            onChange={(e) => {
                                                                const returnedQty = parseInt(e.target.value) || 0;
                                                                setRentalItems(prevItems => prevItems.map(ri => {
                                                                    if (ri.id === item.id) {
                                                                        return { ...ri, returnQuantity: returnedQty };
                                                                    }
                                                                }))
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-gray-600">Ngày trả thực tế:</span>
                                                        <input
                                                            type="date"
                                                            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                                                            defaultValue={item.actualReturnDate ? formatDateOnly(item.actualReturnDate) : ''}
                                                        />
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-gray-600">Phí phạt:</span>
                                                        <input
                                                            type="number"
                                                            className="w-32 border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                                                            placeholder="Phí (VNĐ)"
                                                            defaultValue={penaltyFee}
                                                            onChange={(e) => {
                                                                const penalty = parseInt(e.target.value) || 0;
                                                                setRentalItems(prevItems => prevItems.map(ri => {
                                                                    if (ri.id === item.id) {
                                                                        return { ...ri, penalty: penalty };
                                                                    }
                                                                }))
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Actions */}
                        <div className="space-y-6">
                            {/* Return Request Status */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5">
                                <h4 className="text-sm font-medium text-gray-500 mb-4">Trạng thái yêu cầu trả</h4>
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
                                            onChange={(e) => console.log('Update return status:', e.target.value)}
                                        >
                                            <option value="PENDING">Chờ xử lý</option>
                                            <option value="RECEIVED">Đã nhận</option>
                                            <option value="COMPLETED">Hoàn thành</option>
                                            <option value="CANCELLED">Đã hủy</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-500 mb-2">Ngày nhận sách</label>
                                        <input
                                            type="date"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                                            value={selectedOrder.receivedAt ? formatDateOnly(selectedOrder.receivedAt) : ''}
                                            onChange={(e) => console.log('Update received date:', e.target.value)}
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
                                            <p className="text-gray-700 text-sm">{selectedOrder.customerNote || 'Không có ghi chú'}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-500 mb-2">Ghi chú của quản lý</label>
                                        <textarea
                                            className="w-full h-32 border border-gray-300 rounded-lg p-3 text-sm"
                                            placeholder="Thêm ghi chú..."
                                            defaultValue={selectedOrder.adminNote || ''}
                                            name='adminNote'
                                            onChange={(e) => setFormData({ ...formData, adminNote: e.target.value })}
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
                                        <span className="font-medium">{selectedOrder.rentalItems.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Số sách đã nhận:</span>
                                        <span className="font-medium text-green-600">
                                            {selectedOrder.rentalItems.filter(item => item.state === 'received').length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tổng phí phạt:</span>
                                        <span className="font-semibold text-red-600">
                                            {formatCurrency(
                                                selectedOrder.rentalItems.reduce((sum, item) => {
                                                    const dueDate = new Date(selectedOrder.order.rentDue);
                                                    const today = new Date();
                                                    const overdueDays = today > dueDate ?
                                                        Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24)) : 0;
                                                    return sum + (overdueDays * parseFloat(item.book.rentPenaltyPerDay));
                                                }, 0)
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tổng tiền hoàn:</span>
                                        <span className="font-semibold text-green-600">
                                            {formatCurrency(
                                                parseFloat(selectedOrder.order.depositAmount) -
                                                selectedOrder.rentalItems.reduce((sum, item) => {
                                                    const dueDate = new Date(selectedOrder.order.rentDue);
                                                    const today = new Date();
                                                    const overdueDays = today > dueDate ?
                                                        Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24)) : 0;
                                                    return sum + (overdueDays * parseFloat(item.book.rentPenaltyPerDay));
                                                }, 0)
                                            )}
                                        </span>
                                    </div>
                                    <div className="pt-3 border-t border-blue-200">
                                        <button
                                            onClick={() => completeRequest()}
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
    )
}

export default RentailReturnModal
