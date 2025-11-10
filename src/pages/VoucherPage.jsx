import React, { useState } from 'react';
import {
    Gift
} from 'lucide-react';
import VoucherCard from '../components/VoucherCard';

const VoucherPage = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const vouchers = [
        {
            id: 1,
            code: 'WELCOME10',
            title: 'Giảm 10% cho khách hàng mới',
            description: 'Áp dụng cho tất cả đơn hàng mua sách lần đầu',
            discount: '10%',
            type: 'buy',
            minOrder: 0,
            expiredAt: '2024-12-31',
            isExpiring: false,
            isNew: true,
            usage: 'Chưa sử dụng'
        },
        {
            id: 2,
            code: 'RENTFREE7',
            title: 'Miễn phí thuê 7 ngày',
            description: 'Miễn phí 7 ngày đầu tiên cho đơn thuê sách bất kỳ',
            discount: 'Miễn phí 7 ngày',
            type: 'rent',
            minOrder: 0,
            expiredAt: '2024-06-30',
            isExpiring: false,
            isNew: false,
            usage: 'Chưa sử dụng'
        },
        {
            id: 3,
            code: 'BOOKLOVER15',
            title: 'Giảm 15% đơn từ 300K',
            description: 'Giảm 15% cho đơn mua sách từ 300.000đ',
            discount: '15%',
            type: 'buy',
            minOrder: 300000,
            expiredAt: '2024-05-15',
            isExpiring: true,
            isNew: false,
            usage: 'Chưa sử dụng'
        },
        {
            id: 4,
            code: 'STUDENT20',
            title: 'Giảm 20% cho sinh viên',
            description: 'Áp dụng cho tất cả sách giáo trình và tham khảo',
            discount: '20%',
            type: 'both',
            minOrder: 150000,
            expiredAt: '2024-08-31',
            isExpiring: false,
            isNew: true,
            usage: 'Chưa sử dụng'
        },
        {
            id: 5,
            code: 'FREESHIP50',
            title: 'Miễn phí vận chuyển',
            description: 'Miễn phí vận chuyển cho đơn hàng từ 50.000đ',
            discount: 'Freeship',
            type: 'both',
            minOrder: 50000,
            expiredAt: '2024-04-20',
            isExpiring: true,
            isNew: false,
            usage: 'Đã sử dụng'
        },
        {
            id: 6,
            code: 'RENTMONTH30',
            title: 'Giảm 30% thuê tháng',
            description: 'Giảm 30% cho gói thuê sách theo tháng',
            discount: '30%',
            type: 'rent',
            minOrder: 0,
            expiredAt: '2024-07-15',
            isExpiring: false,
            isNew: false,
            usage: 'Chưa sử dụng'
        }
    ];

    const filterVouchers = () => {
        let filtered = vouchers;

        if (activeTab !== 'all') {
            filtered = filtered.filter(voucher =>
                activeTab === 'used'
                    ? voucher.usage === 'Đã sử dụng'
                    : voucher.type === activeTab || voucher.type === 'both'
            );
        }

        if (searchTerm) {
            filtered = filtered.filter(voucher =>
                voucher.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                voucher.code.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredVouchers = filterVouchers();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
            <div className="p-2">
                <h1 className="text-2xl font-bold text-gray-600">
                    Ví voucher
                </h1>
            </div>
            <div className="max-w-4xl mx-auto px-2 py-2">
                {filteredVouchers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredVouchers.map((voucher, index) => (
                            <div
                                key={voucher.id}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <VoucherCard voucher={voucher} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-white/20 p-12 text-center max-w-lg mx-auto">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100">
                                <Gift className="h-12 w-12 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy voucher</h3>
                            <p className="text-gray-600 mb-8 text-lg">
                                {searchTerm
                                    ? `Không tìm thấy kết quả cho "${searchTerm}"`
                                    : 'Chưa có voucher nào phù hợp'}
                            </p>
                            {(searchTerm || activeTab !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setActiveTab('all');
                                    }}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                                >
                                    Hiển thị tất cả voucher
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoucherPage;