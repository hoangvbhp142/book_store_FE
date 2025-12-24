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
    X,
    Badge
} from 'lucide-react';
import PagingBar from '../../components/PagingBar';
import users from '../../data/users.js';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getAll } from '../../stores/userSlice.js';
import { useCallback, useEffect, useState } from 'react';
import AdvancedPagingBar from '../../components/AdvancedPagingBar.jsx';
import { formatDateOnly } from '../../app/utils.js';

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
        <div className="min-h-screen bg-gray-50/30 flex flex-col p-6">
            <main className="flex-1 container mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Quản Lý Người Dùng
                    </h1>
                </div>

                {/* Filters */}
                <div className="bg-white">

                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                                value={params.q || ""}
                                onChange={(e) =>
                                    updateParams({ q: e.target.value, page: 1 })
                                }
                                placeholder="Search by name or email..."
                                className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Role */}
                        <select
                            value={params.filter?.role || "all"}
                            onChange={(e) =>
                                updateParams({
                                    filter: {
                                        ...params.filter,
                                        role:
                                            e.target.value === "all"
                                                ? undefined
                                                : e.target.value,
                                    },
                                    page: 1,
                                })
                            }
                            className="h-10 w-full md:w-44 border border-gray-300 rounded-sm px-3 text-sm focus:ring-2 focus:ring-blue-500">
                            <option value="all">Vai trò</option>
                            <option value="ADMIN">Admin</option>
                            <option value="USER">Khách hàng</option>
                        </select>

                        {/* Status */}
                        <select
                            value={
                                params.filter?.isActive === undefined
                                    ? "all"
                                    : params.filter.isActive
                                        ? "active"
                                        : "inactive"
                            }
                            onChange={(e) =>
                                updateParams({
                                    filter: {
                                        ...params.filter,
                                        isActive:
                                            e.target.value === "all"
                                                ? undefined
                                                : e.target.value === "active",
                                    },
                                    page: 1,
                                })
                            }
                            className="h-10 w-full md:w-44 border border-gray-300 rounded-sm px-3 text-sm focus:ring-2 focus:ring-blue-500">
                            <option value="all">Trạng thái</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="inactive">Ngừng hoạt động</option>
                        </select>

                        {/* Sort */}
                        <select
                            value={params.sort || ""}
                            onChange={(e) =>
                                updateParams({ sort: e.target.value, page: 1 })
                            }
                            className="h-10 w-full md:w-44 border border-gray-300 rounded-sm px-3 text-sm focus:ring-2 focus:ring-blue-500"
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

                    {/* Active filters */}
                    {/* {(params.q ||
                            params.filter?.role ||
                            params.filter?.isActive !== undefined ||
                            params.sort) && (
                                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-200 text-sm">
                                    <span className="text-gray-500">Lọc theo:</span>

                                    {params.q && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs">
                                            Từ khóa: "{params.q}"
                                            <button
                                                onClick={() => updateParams({ q: "", page: 1 })}
                                                className="hover:text-blue-900"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}


                                    {params.filter?.role && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs">
                                            Vai trò: {params.filter.role}
                                            <button
                                                onClick={() =>
                                                    updateParams({
                                                        filter: { ...params.filter, role: undefined },
                                                        page: 1,
                                                    })
                                                }
                                                className="hover:text-green-900"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}


                                    {params.filter?.isActive !== undefined && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-800">
                                            Trạng thái:{" "}
                                            {params.filter.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                                            <button
                                                onClick={() =>
                                                    updateParams({
                                                        filter: {
                                                            ...params.filter,
                                                            isActive: undefined,
                                                        },
                                                        page: 1,
                                                    })
                                                }
                                                className="hover:text-purple-900"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}

                                    {params.sort && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-orange-100 text-orange-800">
                                            Sắp xếp: {getSortLabel(params.sort)}
                                            <button
                                                onClick={() => updateParams({ sort: "", page: 1 })}
                                                className="hover:text-orange-900"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}

                                    <button
                                        onClick={() =>
                                            setParams({
                                                q: "",
                                                sort: "",
                                                filter: {},
                                                limit: 10,
                                                page: 1,
                                            })
                                        }
                                        className="ml-2 text-gray-500 hover:text-gray-900"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            )} */}
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-300 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {["Người dùng", "Vai trò", "Trạng thái", "Số điện thoại", "Ngày tham gia", ""].map(
                                        (h) => (
                                            <th
                                                key={h}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                            >
                                                {h}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {userList.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        {/* User */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                    {user.photoPath ? (
                                                        <img
                                                            src={user.photoPath}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-medium text-gray-600">
                                                            {getInitials(user.fullName)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        {user.fullName}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-block px-2 py-1 text-xs font-medium
                                                    ${user.role === "ADMIN"
                                                        ? "bg-red-100 text-red-800"
                                                        : user.role === "USER"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-gray-100 text-gray-800"}`}>
                                                {user.role === "USER"
                                                    ? "Khách hàng"
                                                    : user.role === "MODERATOR"
                                                        ? "Moderator"
                                                        : "Admin"}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-block px-2 py-1 text-xs font-medium
                                                    ${user.isActive
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"}`}>
                                                {user.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                                            </span>
                                        </td>


                                        <td className="px-6 py-4">
                                            {user.phone || "N/A"}
                                        </td>

                                        <td className="px-6 py-4">
                                            {formatDateOnly(user.createdAt)}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/users/${user.id}/edit`
                                                    )
                                                }
                                                className="p-1 text-gray-500 hover:text-gray-900"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between p-4 bg-gray-50">
                        <p className="text-sm text-gray-600">
                            Showing {userList.length} users
                        </p>
                        <AdvancedPagingBar
                            meta={meta}
                            onPageChange={(page) => updateParams({ page })}
                            onLimitChange={(limit) =>
                                updateParams({ limit, page: 1 })
                            }
                        />
                    </div>
                </div>
            </main>
        </div>

    );
}

export default AdminUsersPage;