import React, { useState } from 'react'

import { Link } from "react-router-dom"
import { ArrowLeft, ShieldCheck, ShoppingBag } from "lucide-react"
import CartItem from '../components/CartItem'
import { useDispatch, useSelector } from 'react-redux'

const Cart = () => {

  const dispatch = useDispatch();
  const { items, total: cartTotal, loading, error } = useSelector(state => state.cart);


  const subtotal = cartTotal;
  const tax = subtotal * 0.08;
  const [selectedShippingMethod, setSelectedShippingMethod] = useState('standard');

  const shipping = selectedShippingMethod === 'standard' ? 0 :
    selectedShippingMethod === 'express' ? 30000 : 50000;

  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">GIỎ HÀNG</h1>
          <p className="text-gray-600 text-lg">({items.length} sản phẩm)</p>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-4">
              {/* Select All */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">
                    Chọn tất cả ({items.length})
                  </span>
                </label>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                <Link
                  to="/store"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>

            {/* Order Summary - Sticky on desktop */}
            <div className="lg:col-span-1 space-y-6">
              {/* Shipping Method */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Phương thức vận chuyển</h3>

                  <div className="space-y-3">
                    {[
                      {
                        id: 'standard',
                        name: 'Giao hàng tiêu chuẩn',
                        price: 0,
                        time: '3-5 ngày',
                        description: 'Miễn phí',
                        icon: '🚚'
                      },
                      {
                        id: 'express',
                        name: 'Giao hàng nhanh',
                        price: 30000,
                        time: '1-2 ngày',
                        description: '30.000đ',
                        icon: '⚡'
                      },
                      {
                        id: 'instant',
                        name: 'Giao hàng tức thì',
                        price: 50000,
                        time: 'Trong ngày',
                        description: '50.000đ',
                        icon: '🚀'
                      }
                    ].map((shipping) => (
                      <label
                        key={shipping.id}
                        className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${selectedShippingMethod === shipping.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={shipping.id}
                          checked={selectedShippingMethod === shipping.id}
                          onChange={(e) => setSelectedShippingMethod(e.target.value)}
                          className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{shipping.icon}</span>
                            <span className="font-medium text-gray-900 text-sm">{shipping.name}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-600">{shipping.time}</p>
                            <span className={`text-sm font-medium ${shipping.price > 0 ? "text-orange-600" : "text-green-600"
                              }`}>
                              {shipping.description}
                            </span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm lg:sticky lg:top-6">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tạm tính ({items.length} sản phẩm)</span>
                      <span className="font-medium text-gray-900">
                        {subtotal.toLocaleString('vi-VN')}đ
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phí vận chuyển</span>
                      <span className={`font-medium ${shipping === 0 ? "text-green-600" : "text-gray-900"}`}>
                        {shipping === 0 ? "MIỄN PHÍ" : `${shipping.toLocaleString('vi-VN')}đ`}
                      </span>
                    </div>

                    {shipping > 0 && (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700">
                          Thêm {(350000 - subtotal).toLocaleString('vi-VN')}đ để được miễn phí vận chuyển!
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Thuế (8%)</span>
                      <span className="font-medium text-gray-900">{tax.toLocaleString('vi-VN')}đ</span>
                    </div>

                    <hr className="border-gray-200 my-4" />

                    <div className="flex justify-between items-center pt-2">
                      <span className="font-semibold text-lg text-gray-900">Tổng cộng</span>
                      <span className="font-bold text-2xl text-blue-600">
                        {total.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Mã giảm giá"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap">
                        Áp dụng
                      </button>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    to="/checkout"
                    className="block w-full bg-blue-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-blue-700 transition-colors mb-4"
                  >
                    Tiến hành thanh toán
                  </Link>

                  {/* Security Badge */}
                  <div className="text-center">
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      Thanh toán an toàn
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart State */
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-blue-500" />
              </div>
              <h2 className="font-bold text-xl text-gray-900 mb-3">Giỏ hàng trống</h2>
              <p className="text-gray-600 mb-6 text-sm">
                Có vẻ như bạn chưa thêm sách nào vào giỏ hàng.
              </p>
              <Link
                to="/store"
                className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Khám phá sách ngay
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
