import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, X, Calendar, Package, Book } from 'lucide-react'

const CartItem = ({ item, onRemove, onUpdateQuantity, onToggleSelection }) => {
  const { book, quantity, type, rentalType, isChecked } = item

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      onUpdateQuantity(newQuantity)
    }
  }

  const getRentalTypeText = (type) => {
    switch (type) {
      case 'DAILY': return 'Thuê ngày'
      case 'WEEKLY': return 'Thuê tuần'
      case 'MONTHLY': return 'Thuê tháng'
      default: return 'Thuê'
    }
  }

  // Tính toán giá dựa trên loại giao dịch
  const { unitPrice, deposit, itemTotal, displayType } = useMemo(() => {
    if (type === 'PURCHASE') {
      const price = parseFloat(book?.sellerPrice || 0)
      return {
        unitPrice: price,
        deposit: 0,
        itemTotal: price * quantity,
        displayType: 'Mua'
      }
    } else if (type === 'RENTAL') {
      let price = 0
      let rentalText = ''

      switch (rentalType) {
        case 'DAILY':
          price = parseFloat(book?.rentPricePerDay || 0)
          rentalText = 'Thuê ngày'
          break
        case 'WEEKLY':
          price = parseFloat(book?.rentPricePerWeek || 0)
          rentalText = 'Thuê tuần'
          break
        case 'MONTHLY':
          price = parseFloat(book?.rentPricePerMonth || 0)
          rentalText = 'Thuê tháng'
          break
        default:
          price = 0
          rentalText = 'Thuê'
      }

      const depositAmount = parseFloat(book?.rentDeposit || 0)
      return {
        unitPrice: price,
        deposit: depositAmount,
        itemTotal: (price + depositAmount) * quantity,
        displayType: rentalText
      }
    }

    return {
      unitPrice: 0,
      deposit: 0,
      itemTotal: 0,
      displayType: 'Không xác định'
    }
  }, [type, rentalType, book, quantity])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (!book) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-center text-gray-400">
          <Package className="h-6 w-6 mr-2" />
          <span>Sách không tồn tại</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Checkbox */}
        <div className="flex items-start pt-1">
          <input
            type="checkbox"
            checked={isChecked || false}
            onChange={onToggleSelection}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
        </div>

        {/* Book Image */}
        <Link
          to={`/book/${book.id}`}
          className="flex-shrink-0 w-24 h-32 bg-gray-100 rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
        >
          {book.photoUrl ? (
            <img
              src={book.photoUrl.replace('http://minio:9000', 'http://localhost:9000')}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = 'https://via.placeholder.com/96x128?text=No+Image'
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
              <Book className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </Link>

        {/* Book Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <Link
              to={`/book/${book.id}`}
              className="hover:text-blue-600 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-2">
                {book.title}
              </h3>
            </Link>
            <button
              onClick={onRemove}
              className="text-gray-400 hover:text-red-600 transition-colors ml-2 p-1 rounded-full hover:bg-red-50"
              title="Xóa khỏi giỏ hàng"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Book info */}
          <div className="space-y-1 mb-3">
            <p className="text-sm text-gray-500">
              SKU: <span className="font-mono">{book.sku}</span>
            </p>
            {book.language && (
              <p className="text-sm text-gray-500">
                Ngôn ngữ: {book.language}
              </p>
            )}
          </div>

          {/* Transaction Type */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${type === 'PURCHASE'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
              }`}>
              {type === 'PURCHASE' ? (
                <Package className="h-3 w-3" />
              ) : (
                <Calendar className="h-3 w-3" />
              )}
              {displayType}
            </span>

            {type === 'RENTAL' && rentalType && (
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {getRentalTypeText(rentalType)}
              </span>
            )}
          </div>

          {/* Price and Quantity */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Giảm số lượng"
              >
                <Minus className="h-3 w-3" />
              </button>
              <div className="w-12 text-center">
                <span className="font-semibold text-gray-900 text-base">{quantity}</span>
              </div>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= (book.stockQty || 99)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Tăng số lượng"
              >
                <Plus className="h-3 w-3" />
              </button>

              {book.stockQty !== undefined && (
                <span className="text-xs text-gray-500 ml-2">
                  Còn {book.stockQty} sản phẩm
                </span>
              )}
            </div>

            {/* Price Details */}
            <div className="text-right">
              {/* Unit Price */}
              <div className="mb-1">
                <span className="text-sm text-gray-500">Đơn giá: </span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(unitPrice)}đ
                </span>
                {type === 'RENTAL' && deposit > 0 && (
                  <span className="text-sm text-gray-500 ml-1">
                    (+{formatCurrency(deposit)}đ cọc)
                  </span>
                )}
              </div>

              {/* Total Price */}
              <div>
                <span className="text-sm text-gray-500">Thành tiền: </span>
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(itemTotal)}đ
                </span>
                {quantity > 1 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {formatCurrency(unitPrice + deposit)}đ × {quantity}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info for Rental */}
          {type === 'RENTAL' && book.rentPenaltyPerDay && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Phí phạt trễ: {formatCurrency(parseFloat(book.rentPenaltyPerDay))}đ/ngày
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartItem