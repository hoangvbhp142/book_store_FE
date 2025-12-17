import { Calendar, CheckCircle, MapPin, Truck, User, X } from 'lucide-react'
import React, { useState } from 'react'
import { formatCurrency, formatDateOnly, formatDate } from '../app/utils';
import { toast } from 'react-toastify';

const OrderDetailModal = ({
    selectedOrder,
    onCloseModal,
    onMarkAsPaid,
    getStatusIcon,
    getStatusVariant,
    getStatusText,
    handleCancelOrder,
    handleShipping,
    handleShippingUpdate
}) => {

    const [isEditShipping, setIsEditShipping] = useState(false);
    const [shippingForm, setShippingForm] = useState({
        orderId: selectedOrder.id || "",
        trackingNumber: "",
        shippingMethod: "SHOP_DELIVERY",
        carrier: "",
        status: "WAIT_CONFIRM",
        shippingFee: 0,
        estimatedDeliveryDate: "",
        mediaUrls: []
    });

    const updateShipping = () => {
        if (selectedOrder && selectedOrder.shipping && selectedOrder.shipping.status === "SHIPPING") {
            handleShippingUpdate(selectedOrder.shippingId, {
                status: "DELIVERED"
            });
            onCloseModal();
        }
    }

    const handleShippingFormChange = (e) => {
        const { name, value } = e.target;
        setShippingForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const createShipping = () => {
        if (shippingForm.carrier === "") {
            toast.error('Vui lòng nhập đơn vị vận chuyển!');
            return;
        }
        if (shippingForm.shippingFee === "") {
            toast.error('Vui lòng nhập phí vận chuyển!');
            return;
        }
        if (shippingForm.estimatedDeliveryDate === "") {
            toast.error('Vui lòng nhập ngày giao hàng dự kiến!');
            return;
        }
        handleShipping(shippingForm);
        onCloseModal();
    }

    return (
        <div className="fixed inset-0 bg-gray-600/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Chi tiết đơn hàng</h3>
                        <p className="text-sm text-gray-500">ID: {selectedOrder.id}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => onMarkAsPaid(selectedOrder.id)}
                            disabled={selectedOrder.payment.status === 'PAID'}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedOrder.payment.status === 'PAID'
                                ? 'bg-green-100 text-green-800 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                        >
                            <CheckCircle className="w-4 h-4 inline mr-2" />
                            {selectedOrder.payment.status === 'PAID' ? 'Đã thanh toán' : 'Đánh dấu đã thanh toán'}
                        </button>
                        <button
                            onClick={onCloseModal}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left column - 2/3 width */}
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
                                        <p className="font-medium">{selectedOrder.user.id}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                <h4 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Địa chỉ giao hàng
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Người nhận</label>
                                        <p className="font-medium">{selectedOrder.address.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Số điện thoại</label>
                                        <p className="font-medium">{selectedOrder.address.phone}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Địa chỉ</label>
                                        <p className="font-medium">{selectedOrder.address.street}</p>
                                        <p className="text-sm text-gray-600">
                                            {selectedOrder.address.ward}, {selectedOrder.address.district}, {selectedOrder.address.province}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sản phẩm mua */}
                            {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm mua</h4>
                                    <div className="space-y-4">
                                        {selectedOrder.orderItems.map((item, index) => (
                                            <div key={index} className="border border-gray-200 rounded-xl p-4">
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
                                                            <p className="text-sm text-gray-500">ISBN: {item.book.isbn}</p>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="mb-2">
                                                            <span className="text-sm text-gray-600">Số lượng: {item.quantity}</span>
                                                        </div>
                                                        <div className="text-lg font-semibold text-gray-900">
                                                            {formatCurrency(item.subtotal)}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {formatCurrency(item.unitPrice)}/sản phẩm
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Sản phẩm thuê */}
                            {selectedOrder.rentalItems && selectedOrder.rentalItems.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm thuê</h4>
                                    <div className="space-y-4">
                                        {selectedOrder.rentalItems.map((item, index) => (
                                            <div key={index} className="border border-gray-200 rounded-xl p-4">
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
                                                            <p className="text-sm text-gray-500">ISBN: {item.book.isbn}</p>
                                                            <div className="mt-2 space-y-1">
                                                                <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                                                                    Loại thuê: {selectedOrder.rentalType === 'MONTHLY' ? 'Theo tháng' :
                                                                        selectedOrder.rentalType === 'WEEKLY' ? 'Theo tuần' : 'Theo ngày'}
                                                                </span>
                                                                <p className="text-xs text-gray-600">
                                                                    Bắt đầu: {formatDateOnly(selectedOrder.rentStart)}
                                                                </p>
                                                                <p className="text-xs text-gray-600">
                                                                    Hạn trả: {formatDateOnly(selectedOrder.rentDue)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="mb-2">
                                                            <span className="text-sm text-gray-600">Số lượng: {item.quantity}</span>
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Tiền thuê: {formatCurrency(selectedOrder.totalRentAmount)}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Đặt cọc: {formatCurrency(selectedOrder.depositAmount)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Thông tin thuê */}
                            {selectedOrder.rentalItems && selectedOrder.rentalItems.length > 0 && (
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Thông tin thuê
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Loại thuê</label>
                                            <p className="font-medium">
                                                {selectedOrder.rentalType === 'MONTHLY' ? 'Thuê theo tháng' :
                                                    selectedOrder.rentalType === 'WEEKLY' ? 'Thuê theo tuần' : 'Thuê theo ngày'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Ngày bắt đầu</label>
                                            <p className="font-medium">{formatDateOnly(selectedOrder.rentStart)}</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Hạn trả</label>
                                            <p className="font-medium">{formatDateOnly(selectedOrder.rentDue)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Shipping Info - Hiển thị nếu có */}
                            {selectedOrder.shipping && (
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-500 mb-4 flex items-center justify-between">
                                        <span className="flex items-center">
                                            <Truck className="w-4 h-4 mr-2" />
                                            Thông tin vận chuyển
                                        </span>


                                        {
                                            selectedOrder.shipping && !isEditShipping && selectedOrder.shipping.status === "SHIPPING" && (
                                                <button
                                                    onClick={() => updateShipping()}
                                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
                                                >
                                                    Cập nhật trạng thái giao hàng
                                                </button>
                                            )
                                        }
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedOrder.shipping.status && (
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Trạng thái giao hàng</label>
                                                <p className="font-medium">{selectedOrder.shipping.status}</p>
                                            </div>
                                        )}
                                        {selectedOrder.shipping.shippingMethod && (
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Phương thức giao hàng</label>
                                                <p className="font-medium">{selectedOrder.shipping.shippingMethod}</p>
                                            </div>
                                        )}
                                        {selectedOrder.shipping.carrier && (
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Nhà vận chuyển</label>
                                                <p className="font-medium">{selectedOrder.shipping.carrier}</p>
                                            </div>
                                        )}
                                        {selectedOrder.shipping.shippingFee && (
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Phí vận chuyển</label>
                                                <p className="font-medium">{formatCurrency(selectedOrder.shipping.shippingFee)}</p>
                                            </div>
                                        )}
                                        {selectedOrder.shipping.estimatedDeliveryDate && (
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Dự kiến giao hàng</label>
                                                <p className="font-medium">{formatDateOnly(selectedOrder.shipping.estimatedDeliveryDate)}</p>
                                            </div>
                                        )}
                                        {selectedOrder.shipping.trackingNumber && (
                                            <div className="md:col-span-2">
                                                <label className="block text-xs text-gray-500 mb-1">Mã vận đơn</label>
                                                <p className="font-medium font-mono">{selectedOrder.shipping.trackingNumber}</p>
                                            </div>
                                        )}
                                        {selectedOrder.shipping.deliveredAt && (
                                            <div className="md:col-span-2">
                                                <label className="block text-xs text-gray-500 mb-1">Ngày giao hàng</label>
                                                <p className="font-medium">{formatDate(selectedOrder.shipping.deliveredAt)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {
                                isEditShipping && (
                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                        <h4 className="text-sm font-medium text-gray-500 mb-4 flex items-center justify-between">
                                            <span className="flex items-center">
                                                <Truck className="w-4 h-4 mr-2" />
                                                Thông tin vận chuyển
                                            </span>

                                            {isEditShipping && (
                                                <button
                                                    onClick={() => setIsEditShipping(false)}
                                                    className="text-xs text-gray-500 hover:text-gray-700"
                                                >
                                                    Hủy
                                                </button>
                                            )}
                                        </h4>

                                        {/* ===== VIEW MODE ===== */}
                                        {!isEditShipping && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {selectedOrder.shipping?.estimatedDelivery && (
                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1">
                                                            Dự kiến giao hàng
                                                        </label>
                                                        <p className="font-medium">
                                                            {formatDateOnly(selectedOrder.shipping.estimatedDelivery)}
                                                        </p>
                                                    </div>
                                                )}

                                                {selectedOrder.shipping?.trackingNumber && (
                                                    <div className="md:col-span-2">
                                                        <label className="block text-xs text-gray-500 mb-1">
                                                            Mã vận đơn
                                                        </label>
                                                        <p className="font-medium font-mono">
                                                            {selectedOrder.shipping.trackingNumber}
                                                        </p>
                                                    </div>
                                                )}

                                                {selectedOrder.shipping?.deliveredAt && (
                                                    <div className="md:col-span-2">
                                                        <label className="block text-xs text-gray-500 mb-1">
                                                            Ngày giao hàng
                                                        </label>
                                                        <p className="font-medium">
                                                            {formatDate(selectedOrder.shipping.deliveredAt)}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* ===== EDIT MODE ===== */}
                                        {isEditShipping && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">
                                                        Đơn vị vận chuyển *
                                                    </label>
                                                    <input
                                                        name='carrier'
                                                        value={shippingForm.carrier}
                                                        onChange={(e) => handleShippingFormChange(e)}
                                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                                        placeholder="VD: GHTK, GHN"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">
                                                        Phương thức giao *
                                                    </label>
                                                    <select
                                                        name='shippingMethod'
                                                        value={shippingForm.shippingMethod}
                                                        onChange={(e) => handleShippingFormChange(e)}
                                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                                                        <option value="SHOP_DELIVERY">Shop tự giao</option>
                                                        <option value="THIRD_PARTY">Đơn vị vận chuyển</option>
                                                    </select>
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="block text-xs text-gray-500 mb-1">
                                                        Mã vận đơn
                                                    </label>
                                                    <input
                                                        name='trackingNumber'
                                                        onChange={(e) => handleShippingFormChange(e)}
                                                        value={shippingForm.trackingNumber}
                                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                                        placeholder="Không bắt buộc"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">
                                                        Phí giao hàng *
                                                    </label>
                                                    <input
                                                        name='shippingFee'
                                                        onChange={(e) => handleShippingFormChange(e)}
                                                        value={shippingForm.shippingFee}
                                                        type="number"
                                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                                        placeholder="VD: 30000"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">
                                                        Ngày giao dự kiến
                                                    </label>
                                                    <input
                                                        name='estimatedDeliveryDate'
                                                        onChange={(e) => handleShippingFormChange(e)}
                                                        value={shippingForm.estimatedDeliveryDate}
                                                        type="date"
                                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                                    />
                                                </div>

                                                <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                                                    <button
                                                        onClick={() => setIsEditShipping(false)}
                                                        className="rounded-md border border-gray-300 px-4 py-2 text-sm"
                                                    >
                                                        Hủy
                                                    </button>
                                                    <button
                                                        onClick={() => createShipping()}
                                                        className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
                                                    >
                                                        Xác nhận tạo vận đơn
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            }
                        </div>

                        {/* Right column - 1/3 width */}
                        <div className="space-y-6">
                            {/* Order Status */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5">
                                <h4 className="text-sm font-medium text-gray-500 mb-4">Trạng thái đơn hàng</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-2">Trạng thái hiện tại</label>
                                        <div className={`inline-flex items-center px-4 py-2 rounded-lg ${getStatusVariant(selectedOrder.status)}`}>
                                            {getStatusIcon(selectedOrder.status)}
                                            <span className="ml-2 font-medium">{getStatusText(selectedOrder.status)}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-500 mb-2">Cập nhật trạng thái</label>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
                                            value={selectedOrder.status}
                                            onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                                        >
                                            <option value="PROCESSING">Đang xử lý</option>
                                            <option value="WAIT_FOR_DELIVERY">Chờ giao hàng</option>
                                            <option value="SHIPPING">Đang giao hàng</option>
                                            <option value="PAYMENT_ERROR">Lỗi thanh toán</option>
                                            <option value="REFUNDING">Đang hoàn tiền</option>
                                            <option value="REFUND_ERROR">Lỗi hoàn tiền</option>
                                            <option value="REFUNDED">Đã hoàn tiền</option>
                                            <option value="CANCEL">Đã hủy</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Status */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5">
                                <h4 className="text-sm font-medium text-gray-500 mb-4">Thanh toán</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Phương thức</span>
                                        <span className="font-medium">
                                            {selectedOrder.payment.paymentMethod === 'VN_PAY' ? 'VNPay' :
                                                selectedOrder.payment.paymentMethod === 'COD' ? 'COD' : 'Khác'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Trạng thái</span>
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${selectedOrder.payment.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                            selectedOrder.payment.status === 'PAYING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                            {selectedOrder.payment.status === 'PAID' ? 'Đã thanh toán' :
                                                selectedOrder.payment.status === 'PAYING' ? 'Đang thanh toán' : 'Chưa thanh toán'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Số tiền</span>
                                        <span className="font-medium">{formatCurrency(selectedOrder.payment.amount)}</span>
                                    </div>
                                    {selectedOrder.payment.transactionNo && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Mã giao dịch</span>
                                            <span className="font-medium text-sm">{selectedOrder.payment.transactionNo}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Ngày tạo</span>
                                        <span className="font-medium text-sm">{formatDateOnly(selectedOrder.payment.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                                <h4 className="text-sm font-medium text-gray-500 mb-4">Tổng kết đơn hàng</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tiền mua sách:</span>
                                        <span className="font-medium">{formatCurrency(selectedOrder.totalPurchaseAmount)}</span>
                                    </div>
                                    {selectedOrder.totalRentAmount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tiền thuê sách:</span>
                                            <span className="font-medium">{formatCurrency(selectedOrder.totalRentAmount)}</span>
                                        </div>
                                    )}
                                    {selectedOrder.depositAmount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tiền đặt cọc:</span>
                                            <span className="font-medium">{formatCurrency(selectedOrder.depositAmount)}</span>
                                        </div>
                                    )}
                                    {selectedOrder.discount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Giảm giá:</span>
                                            <span className="font-medium text-green-600">-{formatCurrency(selectedOrder.discount)}</span>
                                        </div>
                                    )}
                                    <div className="pt-3 border-t border-blue-200">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-semibold">Tổng cộng:</span>
                                            <span className="font-semibold text-lg text-red-600">
                                                {formatCurrency(selectedOrder.totalAmount)}
                                            </span>
                                        </div>
                                    </div>
                                    {selectedOrder.rentDue && (
                                        <div className="pt-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">Hạn trả sách:</span>
                                                <span className="font-medium text-red-600">
                                                    {formatDateOnly(selectedOrder.rentDue)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5">
                                <h4 className="text-sm font-medium text-gray-500 mb-4">Hành động</h4>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleCancelOrder(selectedOrder.id)}
                                        disabled={selectedOrder.status !== 'PROCESSING' && selectedOrder.status !== 'WAIT_FOR_DELIVERY'}
                                        className={`w-full py-2.5 rounded-lg font-medium transition-colors ${selectedOrder.status !== 'PROCESSING' && selectedOrder.status !== 'WAIT_FOR_DELIVERY'
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-300'
                                            : 'bg-red-50 border border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700'
                                            }`}
                                    >
                                        {selectedOrder.status === 'CANCEL' ? 'Đã hủy' : 'Hủy đơn hàng'}
                                    </button>
                                    {
                                        !isEditShipping && (
                                            <button
                                                onClick={() => setIsEditShipping(true)}
                                                disabled={selectedOrder.status !== 'PROCESSING' && selectedOrder.status !== 'WAIT_FOR_DELIVERY'}
                                                className={`w-full py-2.5 rounded-lg font-medium transition-colors ${selectedOrder.status !== 'PROCESSING' && selectedOrder.status !== 'WAIT_FOR_DELIVERY'
                                                    ? 'bg-green-100 text-green-800 cursor-not-allowed'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                                    }`}
                                            >
                                                Chuyển cho đơn vị vận chuyển
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Timestamps */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Ngày đặt hàng</label>
                                <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                            </div>
                            {selectedOrder.updatedAt && (
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Cập nhật lần cuối</label>
                                    <p className="font-medium">{formatDate(selectedOrder.updatedAt)}</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">ID đơn hàng</label>
                                <p className="font-medium font-mono text-sm">{selectedOrder.id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetailModal
