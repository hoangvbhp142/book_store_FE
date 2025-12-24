import { Eye, Search, Filter, CheckCircle, Clock, Package, Ban, AlertCircle, ChevronDown, User, Book, MessageSquare, X, ShieldCheck, Truck, PackageCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import adminRentalApi from '../../api/adminRentalApi';
import { formatCurrency, formatDate, shortenId } from '../../app/utils';
import RentailReturnModal from '../../modal/RentailReturnModal';
import PagingBar from '../../components/PagingBar';
import AdvancedPagingBar from '../../components/AdvancedPagingBar';
import { useSearchParams } from 'react-router-dom';

const ReturnOrderManagement = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [returnOrders, setReturnOrders] = useState([]);
    const [meta, setMeta] = useState({});

    const [searchParams, setSearchParams] = useSearchParams();
    const [params, setParams] = useState({
        sort: searchParams.get('sort') || 'createdAt: desc',
        q: searchParams.get('q') || '',
        page: Number(searchParams.get('page')) || 1,
        limit: Number(searchParams.get('limit')) || 10,
        filter: {
            status: searchParams.get('status') || '',
        }
    })

    const updateParams = (newParams) => {
        const next = {
            ...params,
            ...newParams
        };

        setParams(next);

        const toSet = {
            ...(next.sort ? { sort: next.sort } : {}),
            ...(next.q ? { q: next.q } : {}),
            ...(next.page ? { page: next.page } : {}),
            ...(next.limit ? { limit: next.limit } : {}),
            ...(next.filter.status ? { status: next.filter.status } : {}),
        };

        setSearchParams(toSet);
    }

    const getStatusConfig = (status) => {
        const configs = {
            PENDING: {
                color: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
                icon: <Clock className="w-4 h-4" />,
                text: 'Chờ gửi sách',
                bgColor: 'bg-yellow-50'
            },
            APPROVAL: {
                color: 'bg-purple-100 text-purple-800 border border-purple-200',
                icon: <ShieldCheck className="w-4 h-4" />,
                text: 'Đã duyệt',
                bgColor: 'bg-purple-50'
            },
            IN_TRANSIT: {
                color: 'bg-blue-100 text-blue-800 border border-blue-200',
                icon: <Truck className="w-4 h-4" />,
                text: 'Đang vận chuyển',
                bgColor: 'bg-blue-50'
            },
            RECEIVED: {
                color: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
                icon: <PackageCheck className="w-4 h-4" />,
                text: 'Kho đã nhận',
                bgColor: 'bg-indigo-50'
            },
            COMPLETED: {
                color: 'bg-green-100 text-green-800 border border-green-200',
                icon: <CheckCircle className="w-4 h-4" />,
                text: 'Hoàn tất',
                bgColor: 'bg-green-50'
            },
            CANCELLED: {
                color: 'bg-red-100 text-red-800 border border-red-200',
                icon: <Ban className="w-4 h-4" />,
                text: 'Đã hủy',
                bgColor: 'bg-red-50'
            }
        };

        return configs[status] || configs.PENDING;
    };

    const acceptReturnRequest = async (requestId) => {
        try {
            const response = await adminRentalApi.approveReturn(requestId, {
                status: 'APPROVAL'
            });
            toast.success('Yêu cầu trả sách đã được chấp nhận thành công.');
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Đã có lỗi xảy ra khi chấp nhận yêu cầu trả sách.');
            return;
        }
    }

    const completeReturnRequest = async (requestId, data) => {
        try {
            const response = await adminRentalApi.approveReturn(requestId, data);
            toast.success('Yêu cầu trả sách đã được hoàn tất thành công.');
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Đã có lỗi xảy ra khi hoàn tất yêu cầu trả sách.');
            return;
        }
    }

    const handleViewDetail = async (request) => {
        try {
            const response = await adminRentalApi.getReturnById(request.id);
            setSelectedOrder(response);
            setShowModal(true);
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Đã có lỗi xảy ra khi tải dữ liệu yêu cầu trả sách.');
            return;
        }

    };

    const fetchRentalReturns = async () => {
        try {
            const finalParams = {
                ...params,
                filter: JSON.stringify(params.filter)
            }
            const response = await adminRentalApi.getAllReturns(finalParams);
            setReturnOrders(response.data);
            setMeta(response.meta);
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Đã có lỗi xảy ra khi tải dữ liệu yêu cầu trả sách.');
        }
    }

    useEffect(() => {
        fetchRentalReturns();
    }, [params]);


    return (
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-5">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Yêu Cầu Trả Sách</h1>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Search */}
                        <div className="flex-1 relative h-10">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo mã yêu cầu, tên người dùng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-full pl-10 pr-4 bg-gray-100 text-sm border border-gray-300 rounded-sm"
                            />
                        </div>

                        {/* Status filter */}
                        <div className="relative h-10 w-full md:w-48">
                            <select
                                value={params.filter.status}
                                onChange={(e) => updateParams({ filter: { ...params.filter, status: e.target.value } })}
                                className="w-full h-full bg-gray-100 text-sm pl-4 pr-10 appearance-none border border-gray-300 rounded-sm"
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="PENDING">Chờ xử lý</option>
                                <option value="APPROVAL">Đã duyệt</option>
                                <option value="IN_TRANSIT">Đang vận chuyển</option>
                                <option value="RECEIVED">Đã nhận</option>
                                <option value="COMPLETED">Hoàn thành</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                                        Mã yêu cầu
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                                        Người dùng
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                                        Ngày yêu cầu
                                    </th>
                                    <th className="py-4 px-6 text-center text-xs font-medium text-gray-500 uppercase">
                                        Trạng thái
                                    </th>
                                    <th className="py-4 px-6 text-center text-xs font-medium text-gray-500 uppercase">
                                        Hoàn tiền
                                    </th>
                                    <th className="py-4 px-6 text-center text-xs font-medium text-gray-500 uppercase">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {returnOrders.map((request) => {
                                    const statusConfig = getStatusConfig(request.status);

                                    const refundAmount =
                                        isNaN(Number(request.refundAmount))
                                            ? 0
                                            : Number(request.refundAmount);

                                    return (
                                        <tr
                                            key={request.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            {/* Mã yêu cầu */}
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900">
                                                    {shortenId(request.id)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Đơn thuê: {shortenId(request.order?.id)}
                                                </div>
                                            </td>

                                            {/* User */}
                                            <td className="py-4 px-6">
                                                <div className="text-sm text-gray-900">
                                                    {request.user.fullName}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {request.shippingMethod === 'SHOP_DELIVERY'
                                                        ? 'Gửi về shop'
                                                        : 'Khác'}
                                                </div>
                                            </td>

                                            {/* Ngày */}
                                            <td className="py-4 px-6">
                                                <div className="text-sm text-gray-900">
                                                    {formatDate(request.createdAt)}
                                                </div>
                                                {request.receivedAt && (
                                                    <div className="text-xs text-gray-500">
                                                        Nhận sách: {formatDate(request.receivedAt)}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Trạng thái */}
                                            <td className="py-4 px-6 text-center">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                                                >
                                                    {statusConfig.icon}
                                                    <span className="ml-1.5">
                                                        {statusConfig.text}
                                                    </span>
                                                </span>
                                            </td>

                                            {/* Hoàn tiền */}
                                            <td className="py-4 px-6 text-center">
                                                <span
                                                    className={`font-medium ${refundAmount > 0
                                                        ? 'text-green-600'
                                                        : 'text-gray-400'
                                                        }`}
                                                >
                                                    {formatCurrency(refundAmount)}
                                                </span>
                                            </td>

                                            {/* Action */}
                                            <td className="py-4 px-6 text-center">
                                                <button
                                                    onClick={() => handleViewDetail(request)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    title="Xem chi tiết yêu cầu"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col md:flex-row items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                        <p className="text-sm text-gray-600 mb-4 md:mb-0">
                            Hiển thị {meta.total} trên tổng số {meta.limit} đơn hàng
                        </p>
                        <AdvancedPagingBar
                            meta={meta}
                            onPageChange={(page) => updateParams({ page: page })}
                            onLimitChange={(limit) => updateParams({ limit: limit, page: 1 })} />
                    </div>
                </div>

                {/* Empty State */}
                {returnOrders.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy yêu cầu nào</h3>
                        <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                    </div>
                )}

                {showModal && selectedOrder && (
                    <RentailReturnModal
                        selectedOrder={selectedOrder}
                        onClose={() => setShowModal(false)}
                        getStatusConfig={getStatusConfig}
                        acceptReturnRequest={acceptReturnRequest}
                        completeReturnRequest={completeReturnRequest}
                    />
                )}
            </div>
        </div>
    );
};

export default ReturnOrderManagement;