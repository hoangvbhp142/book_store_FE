import React, { useState, useEffect } from "react";
import { Search, Filter, Plus, FileText, Calendar, User, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import policiesData from "../../data/Policies";

const PolicyPage = () => {
    const [policies, setPolicies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Mock data - thay thế bằng API call thực tế
    useEffect(() => {
        setTimeout(() => {
            setPolicies(policiesData);
            setLoading(false);
        }, 500);
    }, []);

    const filteredPolicies = policies.filter(policy => {
        const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            policy.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || policy.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "active": return "bg-green-100 text-green-800 border-green-200";
            case "draft": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "inactive": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "active": return "Đang hoạt động";
            case "draft": return "Bản nháp";
            case "inactive": return "Ngừng hoạt động";
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4">
            <div className="max-w-7xl mx-auto space-y-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Chính sách</h1>
                    {filteredPolicies.length > 0 && (
                        <button
                            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            onClick={() => navigate(`/admin/policies/add`)}
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Thêm chính sách mới
                        </button>
                    )}
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3 bg-white border border-gray-300 rounded-lg p-3 shadow-sm">
                    {/* Filter */}
                    <div className="sm:w-52 relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="draft">Bản nháp</option>
                            <option value="inactive">Ngừng hoạt động</option>
                        </select>
                    </div>

                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm chính sách..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Policies Table */}
                {filteredPolicies.length > 0 ? (
                    <div className="overflow-hidden bg-white border border-gray-300 rounded-xl shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Tên chính sách</th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Tác giả</th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Cập nhật</th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Trạng thái</th>
                                    <th className="px-6 py-4 text-center font-semibold text-gray-700">Hành động</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredPolicies.map((policy) => (
                                    <tr
                                        key={policy.id}
                                        className="hover:bg-blue-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-start space-x-3">
                                                <FileText className="w-4 h-4 text-blue-500 mt-1" />
                                                <div>
                                                    <p className="font-medium text-gray-900 group-hover:text-blue-700">
                                                        {policy.name}
                                                    </p>
                                                    <p className="text-gray-600 line-clamp-1">{policy.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{policy.author}</td>
                                        <td className="px-6 py-4 text-gray-500 font-medium">
                                            {new Date(policy.lastUpdated).toLocaleDateString("vi-VN")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                    policy.status
                                                )}`}
                                            >
                                                {getStatusText(policy.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center space-x-1">
                                                <button
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                    onClick={() => navigate(`/admin/policy/${policy.id}`)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                    onClick={() => navigate(`/admin/policy/${policy.id}/edit`)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-12 bg-white border border-gray-300 rounded-xl shadow-sm">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy chính sách</h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm || filterStatus !== "all"
                                ? "Thử thay đổi điều kiện tìm kiếm hoặc bộ lọc"
                                : "Chưa có chính sách nào được tạo"}
                        </p>
                        <button
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            onClick={() => navigate(`/admin/policies/add`)}
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Thêm chính sách đầu tiên
                        </button>
                    </div>
                )}
            </div>
        </div>

    );
};

export default PolicyPage;