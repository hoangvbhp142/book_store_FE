import React from 'react';
import { ArrowLeft, Download, MessageSquare, RotateCcw } from "lucide-react";
import { Link, useParams } from 'react-router-dom';
import sach1 from '../assets/sach1.jpg'

const mockOrder = {
    id: "ORD-2025-001234",
    date: "October 25, 2025",
    status: "shipped",
    items: [
        {
            id: "1",
            title: "The Midnight Library",
            author: "Matt Haig",
            cover: sach1,
            type: "purchase",
            price: 18.99,
            quantity: 1,
        },
        {
            id: "2",
            title: "Educated",
            author: "Tara Westover",
            cover: sach1,
            type: "rental",
            price: 4.99,
            rentalDays: 14,
            rentalStartDate: "October 26, 2025",
            rentalEndDate: "November 9, 2025",
            quantity: 1,
        },
    ],
    subtotal: 23.98,
    tax: 1.92,
    shipping: 5.0,
    total: 30.9,
    shippingAddress: {
        name: "Sarah Johnson",
        address: "123 Oak Street",
        city: "Portland",
        state: "OR",
        zip: "97201",
    },
};

const statusConfig = {
    pending: { label: "Pending", color: "bg-amber-100 text-amber-800" },
    processing: { label: "Processing", color: "bg-blue-100 text-blue-800" },
    shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800" },
    delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
    returned: { label: "Returned", color: "bg-gray-100 text-gray-800" },
};

const OrderDetailPage = () => {
    const order = mockOrder; // Thay thế bằng dữ liệu thực tế từ API nếu cần
    const statusInfo = statusConfig[order.status];

    const { id } = useParams();

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900">
            {/* Header */}
            <div className="border-b border-gray-100 bg-white shadow-sm shadow-gray-100">
                <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
                    <Link
                        to="/customer/orders"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-3"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại
                    </Link>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Đơn hàng {id}</h1>
                            <p className="mt-1 text-sm text-gray-500">Đặt hàng vào ngày {order.date}</p>
                        </div>
                        <div
                            className={`px-4 py-1.5 rounded-full text-sm font-medium ${statusInfo.color || "bg-blue-100 text-blue-700"
                                }`}
                        >
                            {statusInfo.label}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-5xl px-4 py-4 sm:px-4 lg:px-6">
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Order Items */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Items Section */}
                        <div className="rounded-xl border border-gray-100 bg-white shadow-sm shadow-gray-100 p-4">
                            <h2 className="text-lg font-semibold mb-4">Chi tiết đơn hàng</h2>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                                    >
                                        <img
                                            src={item.cover || "/placeholder.svg"}
                                            alt={item.title}
                                            className="h-24 w-16 rounded-md object-cover ring-1 ring-gray-100"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold">{item.title}</h3>
                                                    <p className="text-sm text-gray-500">{item.author}</p>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <span
                                                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${item.type === "purchase"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-blue-100 text-blue-700"
                                                                }`}
                                                        >
                                                            {item.type === "purchase" ? "Purchase" : "Rental"}
                                                        </span>
                                                        {item.type === "rental" && (
                                                            <span className="text-xs text-gray-500">
                                                                {item.rentalDays} days
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-base font-semibold">${item.price.toFixed(2)}</p>
                                                    <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                                                </div>
                                            </div>
                                            {item.type === "rental" && (
                                                <div className="mt-3 text-xs text-gray-500">
                                                    Rental Period: {item.rentalStartDate} to {item.rentalEndDate}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="rounded-xl border border-gray-100 bg-white shadow-sm shadow-gray-100 p-4">
                            <h2 className="text-lg font-semibold mb-3">Địa chỉ nhận hàng</h2>
                            <div className="text-sm space-y-1">
                                <p className="font-medium">{order.shippingAddress.name}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>
                                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                                    {order.shippingAddress.zip}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 rounded-xl border border-gray-100 bg-white shadow-sm shadow-gray-100 p-4">
                            <h2 className="text-lg font-semibold mb-4">Số tiền thanh toán</h2>

                            <div className="space-y-2 mb-4 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tổng tiền</span>
                                    <span>${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Thuế</span>
                                    <span>${order.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Phí vận chuyển</span>
                                    <span>${order.shipping.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-3 mb-4">
                                <div className="flex justify-between font-semibold text-gray-900">
                                    <span>Thành tiền</span>
                                    <span className="text-lg font-bold">${order.total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <button className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 py-2 text-sm font-medium transition">
                                    <RotateCcw className="h-4 w-4" />
                                    Reorder
                                </button>
                                <button className="w-full flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 py-2 text-sm font-medium transition">
                                    View Similar Books
                                </button>
                            </div>

                            {/* Order Status Timeline */}
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <h3 className="text-sm font-semibold mb-3">Trạng thái</h3>
                                <div className="space-y-2 text-xs text-gray-600">
                                    <div className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            <div className="h-6 w-0.5 bg-gray-200"></div>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">Đặt hàng</p>
                                            <p className="text-gray-500">Oct 25, 2025</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            <div className="h-6 w-0.5 bg-gray-200"></div>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">Đang xử lý</p>
                                            <p className="text-gray-500">Oct 26, 2025</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">Đã giao hàng</p>
                                            <p className="text-gray-500">Oct 27, 2025</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default OrderDetailPage;