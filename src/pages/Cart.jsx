import React, { useState, useEffect, useMemo } from 'react'
import { Link } from "react-router-dom"
import { ArrowLeft, ShieldCheck, ShoppingBag, Trash2, Book, Calendar, Package } from "lucide-react"
import CartItem from '../components/CartItem'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCart,
  removeCartItem,
  updateCartItem,
  clearCart,
  toggleItemSelection
} from '../stores/cartSlice'
import { toast } from 'react-toastify'

const Cart = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.cart);

  const [selectedShippingMethod, setSelectedShippingMethod] = useState('standard');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Tính toán các giá trị dựa trên items
  const { subtotal, purchaseItems, rentalItems, selectedItems } = useMemo(() => {
    let subtotalCalc = 0;
    const purchaseItems = [];
    const rentalItems = [];
    const selectedItems = [];

    items.forEach(item => {
      const { book, quantity, type, rentalType } = item;

      if (!book) return;

      if (type === 'PURCHASE') {
        const price = parseFloat(book.sellerPrice || 0);
        subtotalCalc += price * quantity;
        purchaseItems.push(item);
      } else if (type === 'RENTAL') {
        let price = 0;
        switch (rentalType) {
          case 'DAILY':
            price = parseFloat(book.rentPricePerDay || 0);
            break;
          case 'WEEKLY':
            price = parseFloat(book.rentPricePerWeek || 0);
            break;
          case 'MONTHLY':
            price = parseFloat(book.rentPricePerMonth || 0);
            break;
          default:
            price = 0;
        }
        const deposit = parseFloat(book.rentDeposit || 0);
        subtotalCalc += (price + deposit) * quantity;
        rentalItems.push(item);
      }

      if (item.isChecked) {
        selectedItems.push(item);
      }
    });

    return {
      subtotal: subtotalCalc,
      purchaseItems,
      rentalItems,
      selectedItems
    };
  }, [items]);

  const tax = subtotal * 0.08;
  const shipping = selectedShippingMethod === 'standard' ? 0 :
    selectedShippingMethod === 'express' ? 30000 : 50000;
  const total = subtotal;

  // Kiểm tra xem tất cả items có được chọn không
  const areAllItemsSelected = items.length > 0 && items.every(item => item.isChecked);

  // Fetch cart khi component mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Xử lý lỗi
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Xử lý chọn/bỏ chọn tất cả
  const handleSelectAll = () => {
    items.forEach(item => {
      if (item.isChecked !== !areAllItemsSelected) {
        dispatch(toggleItemSelection({
          id: item.id,
          cartItemId: item.id,
          type: item.type
        }));
      }
    });
  };

  // Xử lý xóa item
  const handleRemoveItem = async (itemId) => {
    try {
      await dispatch(removeCartItem(itemId)).unwrap();
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      toast.error(error.message || 'Lỗi khi xóa sản phẩm');
    }
  };

  // Xử lý xóa tất cả
  const handleClearCart = async () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
      try {
        await dispatch(clearCart()).unwrap();
        toast.success('Đã xóa tất cả sản phẩm khỏi giỏ hàng');
      } catch (error) {
        toast.error(error.message || 'Lỗi khi xóa giỏ hàng');
      }
    }
  };

  // Xử lý cập nhật số lượng
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await dispatch(updateCartItem({
        itemId,
        data: { quantity: newQuantity }
      })).unwrap();
    } catch (error) {
      toast.error(error.message || 'Lỗi khi cập nhật số lượng');
    }
  };

  // Xử lý áp dụng mã giảm giá
  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    const promoDiscounts = {
      'SALE10': subtotal * 0.1,
      'SALE20': subtotal * 0.2,
      'SALE50': 50000,
    };

    if (promoDiscounts[promoCode.toUpperCase()]) {
      setDiscount(promoDiscounts[promoCode.toUpperCase()]);
      toast.success('Áp dụng mã giảm giá thành công!');
    } else {
      toast.error('Mã giảm giá không hợp lệ');
    }
  };

  // Xử lý toggle selection
  const handleToggleSelection = (itemId, type) => {
    console.log("clicked");
    
    dispatch(toggleItemSelection({ id: itemId, cartItemId: itemId, type }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Hiển thị loading
  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">GIỎ HÀNG</h1>
            <p className="text-gray-600 text-lg">({items.length} sản phẩm)</p>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
            >
              <Trash2 className="h-4 w-4" />
              Xóa tất cả
            </button>
          )}
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-4">
              {/* Select All và thông tin */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={areAllItemsSelected}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700 font-medium">
                      Chọn tất cả ({items.length})
                    </span>
                  </label>

                  <div className="flex items-center gap-4 text-sm">
                    {purchaseItems.length > 0 && (
                      <span className="flex items-center gap-1 text-blue-600">
                        <Package className="h-4 w-4" />
                        {purchaseItems.length} sách mua
                      </span>
                    )}
                    {rentalItems.length > 0 && (
                      <span className="flex items-center gap-1 text-green-600">
                        <Calendar className="h-4 w-4" />
                        {rentalItems.length} sách thuê
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Phân loại sách mua */}
              {purchaseItems.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Sách mua</h3>
                  </div>
                  {purchaseItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={() => handleRemoveItem(item.id)}
                      onUpdateQuantity={(newQuantity) =>
                        handleUpdateQuantity(item.id, newQuantity)
                      }
                      onToggleSelection={() =>
                        handleToggleSelection(item.id, item.type)
                      }
                    />
                  ))}
                </div>
              )}

              {/* Phân loại sách thuê */}
              {rentalItems.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Sách thuê</h3>
                  </div>
                  {rentalItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={() => handleRemoveItem(item.id)}
                      onUpdateQuantity={(newQuantity) =>
                        handleUpdateQuantity(item.id, newQuantity)
                      }
                      onToggleSelection={() =>
                        handleToggleSelection(item.id, item.type)
                      }
                    />
                  ))}
                </div>
              )}

              {/* Continue Shopping */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                <Link
                  to="/store"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>

            {/* Order Summary - Sticky on desktop */}
            <div className="lg:col-span-1 space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm lg:top-6">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin đơn hàng</h2>

                  {/* Tóm tắt sản phẩm đã chọn */}
                  {selectedItems.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">
                        Đã chọn {selectedItems.length} sản phẩm
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        {selectedItems.filter(item => item.type === 'PURCHASE').length} mua,
                        {selectedItems.filter(item => item.type === 'RENTAL').length} thuê
                      </p>
                    </div>
                  )}

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tạm tính ({items.length} sản phẩm)</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(subtotal)}đ
                      </span>
                    </div>

                    <hr className="border-gray-200 my-4" />

                    <div className="flex justify-between items-center pt-2">
                      <span className="font-semibold text-lg text-gray-900">Tổng cộng</span>
                      <span className="font-bold text-2xl text-blue-600">
                        {formatCurrency(total)}đ
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    to="/checkout"
                    className="block w-full bg-blue-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-blue-700 transition-colors mb-4 shadow-md hover:shadow-lg"
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

              {/* Thông tin bổ sung */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Thông tin bổ sung</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <Book className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>Kiểm tra sách trước khi thanh toán</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>Thời gian thuê tính từ ngày nhận sách</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>Hoàn tiền trong 7 ngày nếu không hài lòng</span>
                  </li>
                </ul>
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
                className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
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