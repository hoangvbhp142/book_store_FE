import React, { useState, useEffect } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import rentalOptions from '../data/rentalOption'
import { useDispatch } from 'react-redux'
import { removeItems, updateItems } from '../stores/cartSlice'
import { toast } from 'react-toastify';
import utils from '../app/utils';

const CartItem = ({ item }) => {

    const dispatch = useDispatch();

    const [quantity, setQuantity] = useState(item.quantity);
    const [rentalDays, setRentalDays] = useState(
        item.rentalDays && item.rentalDays > 0 ? item.rentalDays : rentalOptions[0].days
    );

    const calculateReturnDate = (days) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + days);
        return currentDate.toLocaleDateString();
    }

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) return;
        setQuantity(newQuantity);
        dispatch(updateItems({ id: item.id, quantity: newQuantity }));
    }

    const [isPurchase, setIsPurchase] = useState(item.type === 'buy');

    const handleTypeChange = (type) => {
        setIsPurchase(type === 'buy');

        if (type === 'rent') {

            const defaultOption = rentalOptions.find(opt => opt.days === rentalDays) || rentalOptions[0];

            setRentalDays(defaultOption.days);

            dispatch(updateItems({
                id: item.id,
                type: 'rent',
                price: defaultOption.price,
                deposit: item.book.deposit || 0,
                rentalDays: defaultOption.days
            }));
        } else {
            dispatch(updateItems({
                id: item.id,
                type: 'buy',
                price: item.book.discountPrice || item.book.salePrice || 0,
                deposit: 0,
            }));
        }
    }


    const handleRentalPeriodChange = (days) => {
        setRentalDays(days);
        const defaultOption = rentalOptions.find(opt => opt.days === days);
        dispatch(updateItems(
            {
                id: item.id,
                rentalDays: days,
                price: defaultOption.price
            }));
    }

    const removeItemFromCart = () => {
        dispatch(removeItems(item.id));
        toast.success('Đã xóa khỏi giỏ hàng');
    }


    useEffect(() => {
        setIsPurchase(item.type === 'buy');
        if (item.rentalDays && item.rentalDays > 0) {
            setRentalDays(item.rentalDays);
        }
        setQuantity(item.quantity || 1);
    }, [item.type, item.quantity, item.rentalDays]);

    console.log(item);


    return (
        <div key={item.id} className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
            <div className="p-6">
                <div className="flex items-center gap-4">
                    <input
                        type="checkbox"
                        onChange={(e) => dispatch(updateItems({
                            id: item.id,
                            isChecked: e.target.checked
                        }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />

                    <div className="w-24 h-32 bg-gray-100 rounded flex-shrink-0">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover rounded"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1 min-w-0">
                                {/* Type Toggle Button */}
                                <div className="flex items-center gap-2 mb-3">
                                    <button
                                        onClick={() => handleTypeChange('buy')}
                                        className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${isPurchase
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        Mua
                                    </button>
                                    <button
                                        onClick={() => handleTypeChange('rent')}
                                        className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${!isPurchase
                                            ? "bg-green-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        Thuê
                                    </button>
                                </div>

                                <h3 className="font-semibold text-lg mb-1 line-clamp-2">{item.title}</h3>

                                {!isPurchase && (
                                    <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                                        <label className="block text-xs font-medium text-gray-700 mb-2">
                                            Chọn thời gian thuê
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {rentalOptions.map((period) => (
                                                <button
                                                    key={period.days}
                                                    onClick={() => handleRentalPeriodChange(period.days)}
                                                    className={`px-3 py-2 text-xs rounded border transition-colors ${rentalDays === period.days
                                                        ? "bg-green-100 border-green-500 text-green-700"
                                                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <div className="font-medium">{period.label}</div>
                                                    <div className="text-gray-600">{utils.formatCurrency(period.price)}</div>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Thông tin thuê */}
                                        {item.rentalDays && (
                                            <div className="mt-3 text-xs text-gray-600 space-y-1 border-t border-gray-200 pt-3">
                                                <p>• Thời gian thuê: {item.rentalDays} ngày</p>
                                                <p>• Ngày trả dự kiến: {calculateReturnDate(item.rentalDays)}</p>
                                                <div className="bg-yellow-50 border border-yellow-200 p-2 rounded-lg text-yellow-800 mt-2">
                                                    <p className="font-medium">Tiền cọc: {utils.formatCurrency(item.deposit)}</p>
                                                    <p className="text-[11px]">Cọc sẽ được hoàn lại khi bạn trả sách đúng hạn.</p>
                                                </div>
                                                <p className="text-green-600 font-semibold mt-2">
                                                    Tổng tiền thanh toán: {utils.formatCurrency(item.price + item.deposit)}
                                                </p>
                                            </div>

                                        )}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={removeItemFromCart}
                                className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleQuantityChange(item.quantity - 1)}
                                    className="w-8 h-8 border border-gray-300 rounded-full bg-transparent flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-12 text-center font-medium">{item.quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(item.quantity + 1)}
                                    className="w-8 h-8 border border-gray-300 rounded-full bg-transparent flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <Plus className="h-3 w-3" />
                                </button>
                            </div>

                            <div className="text-right">
                                {
                                    isPurchase ? (
                                        <>
                                            <p className="font-bold text-lg">
                                                {utils.formatCurrency(item.quantity * item.price)}
                                            </p>
                                            {item.quantity > 1 && (
                                                <p className="text-xs text-gray-600">{utils.formatCurrency(item.price)} {item.type === 'buy' ? 'mỗi cuốn' : 'mỗi cuốn/ngày'}</p>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-bold text-lg">
                                                {utils.formatCurrency(item.price * item.quantity + item.deposit)}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                Bao gồm cọc: {utils.formatCurrency(item.deposit)}
                                            </p>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItem
