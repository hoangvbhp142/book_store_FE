// PaymentSuccess.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Mail, Package, Phone } from 'lucide-react';

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        // Lấy thông tin đơn hàng từ localStorage hoặc API
        const storedOrder = localStorage.getItem('lastOrder');
        if (storedOrder) {
            setOrderDetails(JSON.parse(storedOrder));
        }

        // Tự động chuyển hướng sau 5 giây
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Xóa localStorage nếu cần
        // localStorage.removeItem('lastOrder');

        return () => clearInterval(timer);
    }, [navigate]);

    const handleReturnHome = () => {
        navigate('/');
    };

    const handleViewOrder = () => {
        navigate('/orders');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Card thông báo */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-white p-3 rounded-full">
                                <CheckCircle className="w-16 h-16 text-blue-500" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Thanh toán thành công!
                        </h1>
                        <p className="text-green-100 text-lg">
                            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
                        </p>
                    </div>

                    {/* Nội dung */}
                    <div className="p-8">
                        {orderDetails && (
                            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Thông tin đơn hàng
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-600">Mã đơn hàng</p>
                                        <p className="font-mono font-bold text-lg">
                                            #{orderDetails.orderId || 'DH' + Date.now()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Ngày đặt hàng</p>
                                        <p className="font-semibold">
                                            {new Date().toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Tổng tiền</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(orderDetails.amount || 0)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Phương thức thanh toán</p>
                                        <p className="font-semibold">
                                            {orderDetails.paymentMethod || 'Thẻ ngân hàng'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Thông báo chuyển hướng */}
                        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-blue-800 text-center">
                                Bạn sẽ được tự động chuyển về trang chủ sau{' '}
                                <span className="font-bold text-xl">{countdown}</span> giây...
                            </p>
                        </div>

                        {/* Nút hành động */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleReturnHome}
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:-translate-y-1"
                            >
                                <Home className="w-5 h-5" />
                                Quay về trang chủ
                            </button>

                            <button
                                onClick={handleViewOrder}
                                className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-lg border border-gray-300 transition duration-300"
                            >
                                <Package className="w-5 h-5" />
                                Xem đơn hàng của tôi
                            </button>
                        </div>

                        {/* Thông tin hỗ trợ */}
                        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                            <p className="text-gray-600 mb-2">
                                Cần hỗ trợ? Liên hệ với chúng tôi
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
                                <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-800">
                                    <div className='flex items-center gap-1'>
                                        <Mail className='w-4 h-4' />
                                        <span>support@example.com</span>
                                    </div>
                                </a>
                                <a href="tel:+84987654321" className="text-blue-600 hover:text-blue-800">
                                    <div className='flex items-center gap-1'>
                                        <Phone className='w-4 h-4' />
                                        <span>+84 987 654 321</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;