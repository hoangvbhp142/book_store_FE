import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, CreditCard, MapPin, ChevronDown, Landmark, HandCoins, QrCode, BookOpenIcon, ShoppingCartIcon, ChevronLeft, ChevronUp, Zap, Truck, Package, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../app/utils';
import { toast } from 'react-toastify';
import addressApi from '../api/addressApi';
import { fetchCart } from '../stores/cartSlice';
import orderApi from '../api/orderApi';

const paymentOptions = [
    { id: 'vnpay', label: 'VNPay', description: 'Thanh toán qua ví điện tử VNPay', icon: <QrCode />, isHide: false },
    { id: 'card', label: 'Thẻ tín dụng/Ghi nợ', description: 'Visa, Mastercard, JCB, American Express', icon: <CreditCard />, isHide: true },
    { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)', description: 'Thanh toán bằng tiền mặt khi nhận hàng', icon: <HandCoins />, isHide: true },
    { id: 'bank', label: 'Chuyển khoản ngân hàng', description: 'Chuyển khoản qua Internet Banking', icon: <Landmark />, isHide: true },
];

const CheckoutForm = () => {

    // =========== HOOKS ===========
    const dispatch = useDispatch();

    // ========== STATE DECLARATIONS ==========
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [showNewAddress, setShowNewAddress] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('vnpay');
    const [shipmentMethod, setShipmentMethod] = useState('normal');
    const [code, setCode] = useState('');
    const [isOrderSummaryVisible, setIsOpenSummaryVisible] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        label: '',
        province: '',
        district: '',
        ward: '',
        street: '',
        postalCode: '',
        isDefault: false,
    });

    const [orderRequest, setOrderRequest] = useState({
        items: [],
        addressId: null,
        rentalType: "DAILY"
    });

    // ========== REDUX SELECTOR ==========
    const { items, loading } = useSelector(state => state.cart);

    // ========== EFFECTS ==========
    useEffect(() => {
        fetchAddresses();
        fetchCartData();
    }, []);

    useEffect(() => {
        const selected = items.filter(item => item.isSelected);
        setSelectedItems(selected);
    }, [items]);

    // ========== CALCULATIONS ==========
    const { subtotal, purchaseItems, rentalItems } = React.useMemo(() => {
        let subtotalCalc = 0;
        const purchaseItems = [];
        const rentalItems = [];

        selectedItems.forEach(item => {
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
        });

        return {
            subtotal: subtotalCalc,
            purchaseItems,
            rentalItems
        };
    }, [selectedItems]);

    const shipping = shipmentMethod === 'normal' ? 0 : 30000;
    const total = subtotal + shipping;

    // ========== HELPER FUNCTIONS ==========
    const formatAddress = (addr) => {
        if (addr.label !== '')
            return `${addr.label} - ${addr.street}, ${addr.ward}, ${addr.district}, ${addr.province}`;
        return `${addr.street}, ${addr.ward}, ${addr.district}, ${addr.province}`;
    }

    const calculateItemPrice = (item) => {
        const { book, quantity, type, rentalType } = item;
        if (!book) return 0;

        let price = 0;
        if (type === 'PURCHASE') {
            price = parseFloat(book.sellerPrice || 0);
        } else if (type === 'RENTAL') {
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
            price += deposit;
        }
        return price;
    };

    const getRentalTypeText = (type) => {
        switch (type) {
            case 'DAILY': return 'Thuê ngày';
            case 'WEEKLY': return 'Thuê tuần';
            case 'MONTHLY': return 'Thuê tháng';
            default: return 'Thuê';
        }
    };

    // ========== API FUNCTIONS ==========
    const fetchAddresses = async () => {
        try {
            const response = await addressApi.getAll();
            setAddresses(response.data || []);
        } catch (error) {
            console.log(error);
            toast.error('Lỗi khi tải địa chỉ!');
        }
    }

    const fetchCartData = async () => {
        try {
            await dispatch(fetchCart()).unwrap();
        } catch (error) {
            console.log(error);
            toast.error('Lỗi khi tải giỏ hàng!');
        }
    }

    const createOrder = async (addressId) => {
        // Logic tạo đơn hàng sẽ được thêm ở đây
        console.log(addressId);

        try {
            const response = await orderApi.createOrder({
                addressId: addressId
            });

            if (response?.paymentUrl) {
                window.location.href = response.paymentUrl;
                return;
            }
            console.log(response);

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Lỗi khi tạo đơn hàng!');
        }
    }

    // ========== EVENT HANDLERS ==========
    const handleAddressChange = (addressId) => {
        setSelectedAddress(addressId);

        if (addressId === 'new') {
            setShowNewAddress(true);
            setFormData({
                name: '',
                phone: '',
                label: '',
                province: '',
                district: '',
                ward: '',
                street: '',
                postalCode: '',
                isDefault: false,
            });
        } else {
            setShowNewAddress(false);
            const selected = addresses.find(addr => addr.id === addressId);
            if (selected) {
                setFormData({
                    name: selected.name,
                    phone: selected.phone,
                    label: '',
                    province: selected.province,
                    district: selected.district,
                    ward: selected.ward,
                    street: selected.street,
                    isDefault: false,
                    postalCode: '',
                });
            }
        }
    };

    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    const addNewAddress = async () => {

        if (!formData.name || !formData.phone || !formData.province || !formData.district || !formData.ward || !formData.street) {
            toast.error('Vui lòng điền đầy đủ thông tin địa chỉ!');
            return null;
        }

        try {
            const response = await addressApi.create(formData);
            return response.id;
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Lỗi khi thêm địa chỉ mới!');
            return null;
        }
    }

    const handleApply = () => {
        console.log('Áp dụng mã:', code);
    };

    const handlePlaceOrder = async () => {
        if (isSubmitting) {
            return;
        }
        setIsSubmitting(true);
        try {
            console.log('Đặt hàng với phương thức thanh toán:', paymentMethod);
            let addressId = selectedAddress;
            if (selectedAddress === 'new') {
                let newAddressId = await addNewAddress();
                if (!newAddressId) {
                    return;
                }
                addressId = newAddressId;
            }

            if (!addressId) {
                toast.error('Vui lòng chọn hoặc thêm địa chỉ giao hàng!');
                return;
            }

            await createOrder(addressId);
        } finally {
            setIsSubmitting(false);

        }
    }

    // ========== RENDER LOGIC ==========
    // Hiển thị loading (giữ nguyên từ code của bạn)
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-500 border-t-transparent mx-auto"></div>
                    <p className="mt-6 text-gray-700 font-medium text-lg">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }
    console.log(formData);


    return (
        <div className="max-w-7xl mx-auto p-3 lg:p-8 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 gap-5">
                <div className="lg:hidden block">
                    <Link
                        to="/"
                        className="flex items-center gap-2 flex-shrink-0"
                    >
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                            <BookOpenIcon className="h-5 w-5 text-white" />
                        </div>

                        <span className="text-xl font-bold text-gray-900 tracking-wide">
                            BookHaven
                        </span>
                    </Link>
                </div>

                <button className='lg:hidden flex items-center justify-between w-full'
                    onClick={() => setIsOpenSummaryVisible(!isOrderSummaryVisible)}>
                    <div className='flex gap-0.25 items-center text-blue-700 text-sm'>
                        <ShoppingCartIcon className='h-5 w-5' />
                        <span>{!isOrderSummaryVisible ? "Hiển thị" : "Ẩn"} thông tin đơn hàng</span>
                        {
                            !isOrderSummaryVisible ? <ChevronDown className='h-4 w-4' /> : <ChevronUp className='h-4 w-4' />
                        }
                    </div>

                    <span className="font-medium text-lg">{formatCurrency(total)}</span>
                </button>

                <div className={`lg:hidden ${isOrderSummaryVisible ? 'hidden' : ''} block`}>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Mã giảm giá"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                        />
                        <button
                            onClick={handleApply}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                        >
                            Áp dụng
                        </button>
                    </div>
                </div>

                {/* Tóm tắt đơn hàng */}
                <div className={`lg:col-span-1 lg:order-2 bg-white lg:border border-gray-200 lg:sticky top-6 lg:p-8 h-fit
                    ${isOrderSummaryVisible ? '' : 'hidden'}`}>
                    <div className="space-y-4 mb-6">
                        {/* Sách mua */}
                        {purchaseItems.length > 0 && (
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Package className="h-4 w-4 text-blue-600" />
                                    <span className="font-semibold text-gray-900">Sách mua</span>
                                </div>
                                {purchaseItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                                        <div className="w-16 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex-shrink-0 overflow-hidden">
                                            {item.book?.photoUrl ? (
                                                <img
                                                    src={item.book.photoUrl.replace('http://minio:9000', 'http://localhost:9000')}
                                                    alt={item.book.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/64x80?text=No+Image';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-2xl">📚</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 bg-blue-100 text-blue-800">
                                                MUA
                                            </span>
                                            <h3 className="font-semibold text-sm line-clamp-2 mb-1 text-gray-900">{item.book?.title || 'Không có tên'}</h3>
                                            <p className="text-xs text-gray-500 mb-2">SKU: {item.book?.sku || 'N/A'}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-500">Số lượng: {item.quantity}</span>
                                                <span className="font-semibold text-sm text-gray-900">
                                                    {formatCurrency(calculateItemPrice(item) * item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Sách thuê */}
                        {rentalItems.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Calendar className="h-4 w-4 text-green-600" />
                                    <span className="font-semibold text-gray-900">Sách thuê</span>
                                </div>
                                {rentalItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                                        <div className="w-16 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex-shrink-0 overflow-hidden">
                                            {item.book?.photoUrl ? (
                                                <img
                                                    src={item.book.photoUrl.replace('http://minio:9000', 'http://localhost:9000')}
                                                    alt={item.book.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/64x80?text=No+Image';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-2xl">📚</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 bg-green-100 text-green-800">
                                                {getRentalTypeText(item.rentalType)}
                                            </span>
                                            <h3 className="font-semibold text-sm line-clamp-2 mb-1 text-gray-900">{item.book?.title || 'Không có tên'}</h3>
                                            <p className="text-xs text-gray-500 mb-2">SKU: {item.book?.sku || 'N/A'}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-500">Số lượng: {item.quantity}</span>
                                                <span className="font-semibold text-sm text-gray-900">
                                                    {formatCurrency(calculateItemPrice(item) * item.quantity)}
                                                </span>
                                            </div>
                                            {item.book?.rentDeposit && parseFloat(item.book.rentDeposit) > 0 && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    (Trong đó cọc: {formatCurrency(parseFloat(item.book.rentDeposit) * item.quantity)})
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {items.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Không có sản phẩm trong giỏ hàng</p>
                                <Link
                                    to="/store"
                                    className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
                                >
                                    Quay lại mua sắm
                                </Link>
                            </div>
                        )}
                    </div>

                    <hr className="border-gray-200 my-6" />

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Mã giảm giá"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                        />
                        <button
                            onClick={handleApply}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                        >
                            Áp dụng
                        </button>
                    </div>

                    <hr className="border-gray-200 my-6" />

                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tạm tính ({items.length} sản phẩm)</span>
                            <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Phí vận chuyển</span>
                            <span className="font-medium text-green-600">
                                {shipping === 0 ? "MIỄN PHÍ" : `${formatCurrency(shipping)}`}
                            </span>
                        </div>

                        <hr className="border-gray-200 my-4" />

                        <div className="flex justify-between items-center">
                            <span className="font-bold text-lg text-gray-900">Tổng cộng</span>
                            <span className="font-bold text-2xl text-blue-600">{formatCurrency(total)}</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 lg:order-1 space-y-6 bg-white border border-gray-200">
                    {/* Thông tin giao hàng */}
                    <div className="overflow-hidden lg:p-8 p-3">
                        <div className='lg:block hidden'>
                            <Link
                                to="/"
                                className="flex items-center gap-2 flex-shrink-0 mb-6">
                                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                                    <BookOpenIcon className="h-5 w-5 text-white" />
                                </div>

                                <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-wide">
                                    BookHaven
                                </span>
                            </Link>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin giao hàng</h2>

                        {/* Chọn địa chỉ đã lưu */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                <MapPin className="inline h-4 w-4 mr-1" />
                                Chọn địa chỉ giao hàng
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedAddress}
                                    onChange={(e) => handleAddressChange(e.target.value)}
                                    className="w-full border border-gray-300 rounded-sm px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white pr-10"
                                >
                                    <option value="" className="text-xs sm:text-sm py-1 sm:py-2">-- Chọn địa chỉ --</option>
                                    {addresses.map((addr) => (
                                        <option key={addr.id} value={addr.id} className="text-xs sm:text-sm py-1 sm:py-2">
                                            {formatAddress(addr)}
                                        </option>
                                    ))}
                                    <option value="new" className="text-xs sm:text-sm py-1 sm:py-2">+ Thêm địa chỉ mới</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Hiển thị thông tin địa chỉ đã chọn hoặc form nhập mới */}
                        {selectedAddress && (
                            <>
                                {!showNewAddress && selectedAddress !== 'new' && (
                                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                        <p className="text-sm font-medium text-gray-900 mb-2">Địa chỉ đã chọn:</p>
                                        <p className="text-sm text-gray-700">
                                            <strong>{formData.name}</strong><br />
                                            {formData.street}, {formData.ward}<br />
                                            {formData.district}, {formData.province}<br />
                                            SĐT: {formData.phone}
                                        </p>
                                    </div>
                                )}

                                {(showNewAddress || selectedAddress === 'new') && (
                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-3">
                                                Họ và tên <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Nguyễn Văn A"
                                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-3">
                                                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    id="province"
                                                    value={formData.province}
                                                    onChange={handleInputChange}
                                                    placeholder="Hà Nội"
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-3">
                                                    Quận/Huyện <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    id="district"
                                                    value={formData.district}
                                                    onChange={handleInputChange}
                                                    placeholder="Quận 1"
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-3">
                                                    Xã/Phường <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    id="ward"
                                                    value={formData.ward}
                                                    onChange={handleInputChange}
                                                    placeholder="Phường A"
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-3">
                                                Địa chỉ <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="street"
                                                value={formData.street}
                                                onChange={handleInputChange}
                                                placeholder="123 Đường ABC"
                                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-3">
                                                Số điện thoại <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="+84 123 456 789"
                                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-3">
                                                Ghi chú
                                            </label>
                                            <input
                                                id="label"
                                                type="text"
                                                value={formData.label}
                                                onChange={handleInputChange}
                                                placeholder="Cơ quan, Nhà riêng, ..."
                                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="overflow-hidden lg:p-8 p-3">
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Phương thức vận chuyển</h2>
                        </div>
                        <div className='space-y-3'>
                            <div
                                onClick={() => setShipmentMethod('normal')}
                                className={`border rounded-md p-4 cursor-pointer transition-all ${shipmentMethod === 'normal'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        id="normal"
                                        name="shipment"
                                        checked={shipmentMethod === 'normal'}
                                        onChange={() => setShipmentMethod('normal')}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <label htmlFor="normal" className="flex-1 cursor-pointer">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-sm text-gray-900">Giao hàng thường</p>
                                                <p className="text-xs text-gray-600 mt-0.5">Thời gian giao hàng từ 3-5 ngày</p>
                                            </div>
                                            <Truck className="h-6 w-6 text-gray-500" />
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div
                                onClick={() => setShipmentMethod('express')}
                                className={`border rounded-md p-4 cursor-pointer transition-all ${shipmentMethod === 'express'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        id="express"
                                        name="shipment"
                                        checked={shipmentMethod === 'express'}
                                        onChange={() => setShipmentMethod('express')}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <label htmlFor="express" className="flex-1 cursor-pointer">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-sm text-gray-900">Giao hàng nhanh</p>
                                                <p className="text-xs text-gray-600 mt-0.5">Thời gian giao hàng từ 1-2 ngày</p>
                                            </div>
                                            <Zap className="h-6 w-6 text-gray-500" />
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Phương thức thanh toán */}
                    <div className="overflow-hidden lg:p-8 p-3">
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Phương thức thanh toán</h2>
                        </div>

                        <div className="space-y-3">
                            {
                                paymentOptions.map(option => (
                                    <div
                                        key={option.id}
                                        onClick={() => setPaymentMethod(option.id)}
                                        className={`${option.isHide ? 'hidden' : ''} border rounded-md p-4 cursor-pointer transition-all ${paymentMethod === option.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                id={option.id}
                                                name="payment"
                                                checked={paymentMethod === option.id}
                                                onChange={() => setPaymentMethod(option.id)}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <label htmlFor={option.id} className="flex-1 cursor-pointer">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-semibold text-sm text-gray-900">{option.label}</p>
                                                        <p className="text-xs text-gray-600 mt-0.5">{option.description}</p>
                                                    </div>
                                                    <div className="h-6 w-6 text-gray-500">
                                                        {option.icon}
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        {/* Form nhập thông tin thẻ khi chọn Credit Card */}
                        {paymentMethod === 'card' && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                            Số thẻ
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="cardNumber"
                                                placeholder="1234 5678 9012 3456"
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-2">
                                            Tên trên thẻ
                                        </label>
                                        <input
                                            id="cardName"
                                            placeholder="NGUYEN VAN A"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-2">
                                                Ngày hết hạn
                                            </label>
                                            <input
                                                id="expiry"
                                                placeholder="MM / YY"
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                                                CVV
                                            </label>
                                            <input
                                                id="cvv"
                                                placeholder="123"
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            id="saveCard"
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="saveCard" className="text-sm text-gray-700 cursor-pointer">
                                            Lưu thẻ cho lần mua sau
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Thông tin chuyển khoản khi chọn Bank Transfer */}
                        {paymentMethod === 'bank' && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="bg-gray-50 rounded-md p-4">
                                    <p className="text-sm font-bold text-gray-900 mb-2">Thông tin chuyển khoản:</p>
                                    <div className="space-y-1 text-sm text-gray-700">
                                        <p><strong>Ngân hàng:</strong> Vietcombank - Chi nhánh Hà Nội</p>
                                        <p><strong>Số tài khoản:</strong> 0123456789</p>
                                        <p><strong>Chủ tài khoản:</strong> CÔNG TY TNHH SÁCH ABC</p>
                                        <p><strong>Nội dung:</strong> [Mã đơn hàng] + Số điện thoại</p>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-3">
                                        💡 Đơn hàng sẽ được xử lý sau khi chúng tôi nhận được thanh toán
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 px-4 py-6">
                        <button
                            onClick={handlePlaceOrder}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold
               hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-200 hover:scale-105
               focus:outline-none focus:ring-2 focus:ring-blue-500 md:order-2"
                            disabled={selectedItems.length === 0 || isSubmitting}
                        >
                            {selectedItems.length === 0 ? 'Giỏ hàng trống' : 'Đặt hàng'}
                        </button>

                        <Link
                            to="/cart"
                            className="w-full inline-flex justify-center items-center bg-gray-200 text-gray-900 py-3 rounded-xl text-lg font-semibold
               hover:bg-gray-300 transition-all duration-300 shadow-md hover:shadow-gray-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 md:order-1"
                        >
                            Quay lại giỏ hàng
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutForm;