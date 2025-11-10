import React from 'react'
import { Link } from 'react-router-dom'
import { Lock, CreditCard } from "lucide-react"

import sach1 from '../assets/sach1.jpg'

const Checkout = () => {
    const cartItems = [
        {
            id: 1,
            title: "The Great Novel",
            author: "John Doe",
            type: "buy",
            format: "Hardcover",
            price: 24.99,
            quantity: 1,
        },
        {
            id: 2,
            title: "Mystery Thriller",
            author: "Jane Smith",
            type: "rent",
            period: "1 Month",
            price: 4.99,
            quantity: 1,
        },
    ]

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = 5.99
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="max-w-3xl mx-auto mb-12">
                        <div className="flex items-center justify-center gap-4">
                            {[
                                { number: 1, label: "Thông tin giao hàng", active: true },
                                { number: 2, label: "Thanh toán", active: false },
                                { number: 3, label: "Xác nhận", active: false }
                            ].map((step, index) => (
                                <div key={step.number} className="flex items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${step.active
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                            : "bg-gray-100 text-gray-400"
                                            }`}>
                                            {step.number}
                                        </div>
                                        <span className={`text-sm font-medium hidden sm:block ${step.active ? "text-blue-600" : "text-gray-500"
                                            }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                    {index < 2 && (
                                        <div className="w-16 h-0.5 bg-gray-200" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">

                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Địa chỉ giao hàng</h2>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-3">
                                                    Họ
                                                </label>
                                                <input
                                                    id="firstName"
                                                    placeholder="Nguyễn"
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-3">
                                                    Tên
                                                </label>
                                                <input
                                                    id="lastName"
                                                    placeholder="Văn A"
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-3">
                                                    Thành phố
                                                </label>
                                                <input
                                                    id="city"
                                                    placeholder="Hà Nội"
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-3">
                                                    Quận/Huyện
                                                </label>
                                                <input
                                                    id="state"
                                                    placeholder="Quận 1"
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-3">
                                                    Mã bưu điện
                                                </label>
                                                <input
                                                    id="zip"
                                                    placeholder="100000"
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-3">
                                                    Quốc gia
                                                </label>
                                                <select
                                                    id="country"
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                >
                                                    <option value="VN">Việt Nam</option>
                                                    <option value="US">United States</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-3">
                                                Địa chỉ
                                            </label>
                                            <input
                                                id="address"
                                                placeholder="123 Đường ABC"
                                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-3">
                                                Căn hộ, tòa nhà, ... (tùy chọn)
                                            </label>
                                            <input
                                                id="apartment"
                                                placeholder="Căn hộ 4B"
                                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                        </div>



                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-3">
                                                Số điện thoại
                                            </label>
                                            <input
                                                id="phone"
                                                type="tel"
                                                placeholder="+84 123 456 789"
                                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <input
                                                id="saveAddress"
                                                type="checkbox"
                                                className="w-5 h-5 text-blue-600 border-gray-300 rounded-lg focus:ring-blue-500"
                                            />
                                            <label htmlFor="saveAddress" className="text-sm text-gray-700 cursor-pointer">
                                                Lưu địa chỉ này cho lần sau
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Phương thức thanh toán</h2>
                                        <Lock className="h-5 w-5 text-blue-500" />
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-3">
                                                Số thẻ
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="cardNumber"
                                                    placeholder="1234 5678 9012 3456"
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                />
                                                <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-3">
                                                Tên trên thẻ
                                            </label>
                                            <input
                                                id="cardName"
                                                placeholder="NGUYEN VAN A"
                                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-3">
                                                    Ngày hết hạn
                                                </label>
                                                <input
                                                    id="expiry"
                                                    placeholder="MM / YY"
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-3">
                                                    CVV
                                                </label>
                                                <input
                                                    id="cvv"
                                                    placeholder="123"
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <input
                                                id="saveCard"
                                                type="checkbox"
                                                className="w-5 h-5 text-blue-600 border-gray-300 rounded-lg focus:ring-blue-500"
                                            />
                                            <label htmlFor="saveCard" className="text-sm text-gray-700 cursor-pointer">
                                                Lưu thẻ cho lần mua sau
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-200 hover:scale-105">
                                Đặt hàng
                            </button>

                            <p className="text-sm text-center text-gray-600">
                                Bằng cách đặt hàng, bạn đồng ý với{" "}
                                <a href="/terms" className="text-blue-600 hover:text-blue-700 underline">
                                    Điều khoản dịch vụ
                                </a>{" "}
                                và{" "}
                                <a href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                                    Chính sách bảo mật
                                </a>{" "}
                                của chúng tôi
                            </p>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg sticky top-6">
                                <div className="p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

                                    <div className="space-y-4 mb-6">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                                                <div className="w-16 h-20 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                                                    <img
                                                        src={mockingbird}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${item.type === "rent"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-green-100 text-green-800"
                                                        }`}>
                                                        {item.type === "rent" ? "THUÊ" : "MUA"}
                                                    </span>
                                                    <h3 className="font-semibold text-sm line-clamp-2 mb-1 text-gray-900">{item.title}</h3>
                                                    <p className="text-xs text-gray-600 mb-2">Tác giả: {item.author}</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-500">Số lượng: {item.quantity}</span>
                                                        <span className="font-semibold text-sm text-gray-900">${item.price.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <hr className="border-gray-200 my-6" />

                                    {/* Price Breakdown */}
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tạm tính</span>
                                            <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Phí vận chuyển</span>
                                            <span className="font-medium text-green-600">
                                                {shipping === 0 ? "MIỄN PHÍ" : `$${shipping.toFixed(2)}`}
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Thuế</span>
                                            <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                                        </div>

                                        <hr className="border-gray-200 my-4" />

                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-lg text-gray-900">Tổng cộng</span>
                                            <span className="font-bold text-2xl text-blue-600">${total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                                        <p className="text-sm text-blue-700 leading-relaxed flex items-start gap-2">
                                            <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                            Thông tin thanh toán của bạn được bảo mật và mã hóa
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Checkout
