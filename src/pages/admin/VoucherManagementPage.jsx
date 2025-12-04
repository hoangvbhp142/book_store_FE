import React, { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Copy,
    Calendar,
    Tag,
    Percent,
    DollarSign,
    Filter,
    Download,
    Upload
} from 'lucide-react';
import VoucherFormModal from '../../modal/VoucherFormModal';

const VoucherManagementPage = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [meta, setMeta] = useState(null);

    // Dữ liệu mẫu
    const sampleVouchers = [
        {
            id: '1',
            code: 'SUMMER2024',
            name: 'Giảm giá mùa hè',
            description: 'Giảm giá đặc biệt cho mùa hè 2024',
            type: 'percentage',
            value: 15,
            minOrder: 200000,
            maxDiscount: 50000,
            startDate: '2024-06-01',
            endDate: '2024-08-31',
            usageLimit: 1000,
            usedCount: 245,
            status: 'active',
            createdAt: '2024-05-15'
        },
        {
            id: '2',
            code: 'FREESHIP',
            name: 'Miễn phí vận chuyển',
            description: 'Miễn phí vận chuyển cho đơn hàng từ 300K',
            type: 'shipping',
            value: 0,
            minOrder: 300000,
            maxDiscount: null,
            startDate: '2024-06-01',
            endDate: '2024-12-31',
            usageLimit: null,
            usedCount: 189,
            status: 'active',
            createdAt: '2024-05-10'
        },
        {
            id: '3',
            code: 'WELCOME50',
            name: 'Giảm 50K cho thành viên mới',
            description: 'Chào mừng thành viên mới',
            type: 'fixed',
            value: 50000,
            minOrder: 150000,
            maxDiscount: 50000,
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            usageLimit: 5000,
            usedCount: 3120,
            status: 'active',
            createdAt: '2024-01-01'
        },
        {
            id: '4',
            code: 'EXPIRED2023',
            name: 'Voucher hết hạn',
            description: 'Voucher đã hết hạn',
            type: 'percentage',
            value: 10,
            minOrder: 100000,
            maxDiscount: 20000,
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            usageLimit: 100,
            usedCount: 45,
            status: 'expired',
            createdAt: '2023-01-01'
        }
    ];

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        setLoading(true);
        // Giả lập API call
        setTimeout(() => {
            setVouchers(sampleVouchers);
            setMeta({
                total: sampleVouchers.length,
                page: 1,
                limit: 10,
                pageCount: 1,
                hasNext: false,
                hasPrev: false
            });
            setLoading(false);
        }, 500);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Xử lý tìm kiếm
        console.log('Searching for:', searchTerm);
    };

    const handleCreate = () => {
        setEditingVoucher(null);
        setIsModalOpen(true);
    };

    const handleEdit = (voucher) => {
        setEditingVoucher(voucher);
        setIsModalOpen(true);
    };

    const handleDelete = (voucher) => {
        if (window.confirm(`Bạn có chắc muốn xóa voucher ${voucher.code}?`)) {
            // Xử lý xóa
            console.log('Deleting voucher:', voucher.id);
        }
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        alert('Đã sao chép mã voucher: ' + code);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { color: 'bg-green-100 text-green-800', label: 'Đang hoạt động' },
            inactive: { color: 'bg-gray-100 text-gray-800', label: 'Không hoạt động' },
            expired: { color: 'bg-red-100 text-red-800', label: 'Đã hết hạn' },
            upcoming: { color: 'bg-blue-100 text-blue-800', label: 'Sắp diễn ra' }
        };

        const config = statusConfig[status] || statusConfig.inactive;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {config.label}
            </span>
        );
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'percentage': return <Percent size={16} />;
            case 'fixed': return <DollarSign size={16} />;
            case 'shipping': return <Tag size={16} />;
            default: return <Tag size={16} />;
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'percentage': return 'Giảm %';
            case 'fixed': return 'Giảm tiền';
            case 'shipping': return 'Miễn phí ship';
            default: return type;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const filteredVouchers = vouchers.filter(voucher => {
        const matchesSearch = voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            voucher.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || voucher.status === statusFilter;
        const matchesType = typeFilter === 'all' || voucher.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Voucher</h1>
                    <p className="text-gray-600 mt-1">Tạo và quản lý mã giảm giá cho khách hàng</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        title="Tổng số voucher"
                        value={vouchers.length}
                        icon={<Tag className="text-blue-600" size={20} />}
                        color="blue"
                    />
                    <StatCard
                        title="Đang hoạt động"
                        value={vouchers.filter(v => v.status === 'active').length}
                        icon={<Tag className="text-green-600" size={20} />}
                        color="green"
                    />
                    <StatCard
                        title="Đã sử dụng"
                        value={vouchers.reduce((sum, v) => sum + v.usedCount, 0)}
                        icon={<DollarSign className="text-purple-600" size={20} />}
                        color="purple"
                    />
                    <StatCard
                        title="Sắp hết hạn"
                        value={vouchers.filter(v => v.status === 'expired').length}
                        icon={<Calendar className="text-red-600" size={20} />}
                        color="red"
                    />
                </div>

                {/* Toolbar */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Search and Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm theo mã hoặc tên voucher..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </form>

                            <div className="flex gap-2">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="active">Đang hoạt động</option>
                                    <option value="inactive">Không hoạt động</option>
                                    <option value="expired">Đã hết hạn</option>
                                    <option value="upcoming">Sắp diễn ra</option>
                                </select>

                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">Tất cả loại</option>
                                    <option value="percentage">Giảm %</option>
                                    <option value="fixed">Giảm tiền</option>
                                    <option value="shipping">Miễn phí ship</option>
                                </select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                                <Filter size={16} className="mr-2" />
                                Lọc
                            </button>
                            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                                <Download size={16} className="mr-2" />
                                Export
                            </button>
                            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                                <Upload size={16} className="mr-2" />
                                Import
                            </button>
                            <button
                                onClick={handleCreate}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                <Plus size={16} className="mr-2" />
                                Thêm Voucher
                            </button>
                        </div>
                    </div>
                </div>

                {/* Voucher Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Mã Voucher
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Thông tin
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Giá trị
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Thời gian
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Sử dụng
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Trạng thái
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredVouchers.map((voucher) => (
                                            <tr key={voucher.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0">
                                                            {getTypeIcon(voucher.type)}
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium text-gray-900 font-mono">
                                                                    {voucher.code}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleCopyCode(voucher.code)}
                                                                    className="text-gray-400 hover:text-gray-600 transition"
                                                                >
                                                                    <Copy size={14} />
                                                                </button>
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {getTypeLabel(voucher.type)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {voucher.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {voucher.description}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {voucher.type === 'percentage' && `${voucher.value}%`}
                                                        {voucher.type === 'fixed' && formatCurrency(voucher.value)}
                                                        {voucher.type === 'shipping' && 'Miễn phí ship'}
                                                    </div>
                                                    {voucher.minOrder > 0 && (
                                                        <div className="text-xs text-gray-500">
                                                            Đơn tối thiểu: {formatCurrency(voucher.minOrder)}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {new Date(voucher.startDate).toLocaleDateString('vi-VN')}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(voucher.endDate).toLocaleDateString('vi-VN')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {voucher.usedCount} / {voucher.usageLimit || '∞'}
                                                    </div>
                                                    {voucher.usageLimit && (
                                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                                            <div
                                                                className="bg-blue-600 h-1.5 rounded-full"
                                                                style={{ width: `${(voucher.usedCount / voucher.usageLimit) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(voucher.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(voucher)}
                                                            className="text-blue-600 hover:text-blue-900 transition"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(voucher)}
                                                            className="text-red-600 hover:text-red-900 transition"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Empty State */}
                            {filteredVouchers.length === 0 && (
                                <div className="text-center py-12">
                                    <Tag className="mx-auto text-gray-400" size={48} />
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">Không tìm thấy voucher</h3>
                                    <p className="mt-2 text-gray-500">
                                        {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                                            ? 'Thử thay đổi điều kiện tìm kiếm hoặc bộ lọc'
                                            : 'Bắt đầu bằng cách tạo voucher đầu tiên'
                                        }
                                    </p>
                                    {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
                                        <button
                                            onClick={handleCreate}
                                            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            <Plus size={16} className="mr-2" />
                                            Thêm Voucher
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Pagination - Sử dụng PagingBar component của bạn */}
                {meta && filteredVouchers.length > 0 && (
                    <div className="mt-6">
                        {/* <PagingBar 
              meta={meta}
              onPageChange={(page) => console.log('Change to page:', page)}
            /> */}
                    </div>
                )}
            </div>

            {/* Voucher Form Modal */}
            {isModalOpen && (
                <VoucherFormModal
                    voucher={editingVoucher}
                    onClose={() => setIsModalOpen(false)}
                    onSave={(voucherData) => {
                        console.log('Saving voucher:', voucherData);
                        setIsModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};

// Component Stat Card
const StatCard = ({ title, value, icon, color }) => {
    const colorClasses = {
        blue: 'bg-blue-50 border-blue-200',
        green: 'bg-green-50 border-green-200',
        purple: 'bg-purple-50 border-purple-200',
        red: 'bg-red-50 border-red-200'
    };

    return (
        <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`p-2 rounded-lg ${colorClasses[color]} bg-opacity-50`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default VoucherManagementPage;