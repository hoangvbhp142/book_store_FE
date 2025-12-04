import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
    Search,
    Eye,
    Edit,
    Ban,
    UserCheck,
    Users,
    ShoppingBag,
    BookOpen,
    X
} from 'lucide-react';
import PagingBar from '../../components/PagingBar';
import users from '../../data/users.js';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getAll } from '../../stores/userSlice.js';
import { useCallback, useEffect, useState } from 'react';
import AdvancedPagingBar from '../../components/AdvancedPagingBar.jsx';

const AdminUsersPage = () => {

    //============== HOOKS & PARAMS ===============
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //============= SELECTORS =================
    const { userList, loading, error, meta } = useSelector(state => state.user);

    // ========== STATE =========
    const [searchParams, setSearchParams] = useSearchParams();
    const [params, setParams] = useState({
        sort: searchParams.get("sort") || "",
        q: searchParams.get("q") || "",
        limit: Number(searchParams.get("limit") || 10),
        page: Number(searchParams.get("page") || 1),
        filter: {
            role: searchParams.get("role") || "",
            isActive: searchParams.get("isActive") !== null ? searchParams.get("isActive") === "true" : undefined
        }
    });

    // ==========EVENT HANDLER ==========
    const updateParams = (patch) => {
        const next = {
            ...params,
            ...patch,
            filter: {
                ...params.filter,
                ...(patch.filter || {})
            }
        };
        setParams(next);

        // Đồng bộ lên URL
        const toSet = {
            ...(next.sort ? { sort: next.sort } : {}),
            ...(next.q ? { q: next.q } : {}),
            ...(next.page !== 1 ? { page: next.page } : {}),
            ...(next.limit !== 10 ? { limit: next.limit } : {}),
            ...(next.filter.isActive !== undefined ? { isActive: next.filter.isActive } : {}),
            ...(next.filter.role ? { role: next.filter.role } : {}),
        };

        console.log(toSet);

        setSearchParams(toSet);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }

    const getSortLabel = (sortValue) => {
        const sortOptions = {
            "fullName:asc": "Tên A-Z",
            "fullName:desc": "Tên Z-A",
            "email:asc": "Email A-Z",
            "email:desc": "Email Z-A",
            "createdAt:desc": "Mới nhất",
            "createdAt:asc": "Cũ nhất"
        };
        return sortOptions[sortValue] || sortValue;
    };

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    // ========== API FUNCTIONS ==========
    const fetchUserList = useCallback(() => {

        const finalParams = {
            ...params,
            filter: JSON.stringify(params.filter || {})
        }

        dispatch(getAll(finalParams));
    }, [dispatch, params]);


    // ========== EFFECT ==========
    useEffect(() => {
        fetchUserList();
    }, [params]);

    console.log(params);


    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 bg-gray-50/30">
                <div className="container mx-auto">

                    {/* Filters and Search */}
                    <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden mb-6">
                        <div className="p-3">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <input
                                        value={params.q || ""}
                                        onChange={(e) => updateParams({ q: e.target.value, page: 1 })}
                                        placeholder="Search by name or email..."
                                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <select
                                    value={params.filter?.role || ""}
                                    onChange={(e) => {
                                        const role = e.target.value;
                                        updateParams({
                                            filter: {
                                                role: role === "all" ? "" : role
                                            }
                                        })
                                    }}
                                    className="w-full md:w-[180px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">Vai trò</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="USER">Khách hàng</option>
                                </select>
                                <select
                                    value={params.filter?.isActive === undefined ? "all" : params.filter.isActive ? "active" : "inactive"}
                                    onChange={(e) => {
                                        const status = e.target.value;
                                        updateParams({
                                            filter: {
                                                isActive: status === "all" ? undefined : status === "active"
                                            }
                                        })
                                    }}
                                    className="w-full md:w-[180px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">Trạng thái</option>
                                    <option value="active">Đang hoạt động</option>
                                    <option value="inactive">Ngừng hoạt động</option>
                                </select>
                                <select
                                    value={params.sort}
                                    onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
                                    className="w-full md:w-[180px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Sắp xếp</option>
                                    <option value="fullName:asc">Tên A-Z</option>
                                    <option value="fullName:desc">Tên Z-A</option>
                                    <option value="email:asc">Email A-Z</option>
                                    <option value="email:desc">Email Z-A</option>
                                    <option value="createdAt:desc">Mới nhất</option>
                                    <option value="createdAt:asc">Cũ nhất</option>
                                </select>
                            </div>

                            {/* Active Filters Display */}
                            {(params.q || params.filter?.role || params.filter?.isActive !== undefined) && (
                                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200 items-center">
                                    <span className="text-sm text-gray-600">Lọc theo:</span>

                                    {params.q && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            Từ khóa: "{params.q}"
                                            <button
                                                onClick={() => setParams(prev => ({ ...prev, q: "", page: 1 }))}
                                                className="hover:text-blue-900"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}

                                    {params.filter?.role && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                            Vai trò: {params.filter.role === "USER" ? "Khách hàng" : params.filter.role}
                                            <button
                                                onClick={() => setParams(prev => ({
                                                    ...prev,
                                                    filter: { ...prev.filter, role: undefined },
                                                    page: 1
                                                }))}
                                                className="hover:text-green-900"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}

                                    {params.filter?.isActive !== undefined && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                            Trạng thái: {params.filter.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                                            <button
                                                onClick={() => setParams(prev => ({
                                                    ...prev,
                                                    filter: { ...prev.filter, isActive: undefined },
                                                    page: 1
                                                }))}
                                                className="hover:text-purple-900"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}

                                    {params.sort && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                            Sắp xếp: {getSortLabel(params.sort)}
                                            <button
                                                onClick={() => updateParams({ sort: "" })}
                                                className="hover:text-orange-900"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}

                                    <button
                                        onClick={() => setParams({
                                            sort: "",
                                            q: "",
                                            filter: {},
                                            limit: 10,
                                            page: 1
                                        })}
                                        className="text-sm text-gray-600 hover:text-gray-900 ml-2"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
                        <div className="p-0">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {userList.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                            {user.photoPath ? (
                                                                <img
                                                                    src={user.photoPath}
                                                                    alt={user.fullName}
                                                                    className="w-10 h-10 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <span className="text-sm font-medium text-gray-600">
                                                                    {getInitials(user.fullName)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{user.fullName}</p>
                                                            <p className="text-sm text-gray-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : user.role === 'MODERATOR'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {user.role === "USER" ? "Khách hàng" : user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${user.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {user.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                                    {user.phone || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="p-1 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                                                            onClick={() => navigate(`/admin/users/${user.id}/edit`)}>
                                                            <Edit className="h-4 w-4" />
                                                            <span className="sr-only">Edit User</span>
                                                        </button>
                                                        {user.isActive && (
                                                            <button className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors">
                                                                <Ban className="h-4 w-4" />
                                                                <span className="sr-only">Deactivate User</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                                <p className="text-sm text-gray-600">Showing 1-{userList.length} of {userList.length} users</p>
                                <AdvancedPagingBar
                                    meta={meta}
                                    onPageChange={(page) => updateParams({ page: page })}
                                    onLimitChange={(limit) => updateParams({ limit: limit, page: 1 })} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminUsersPage;