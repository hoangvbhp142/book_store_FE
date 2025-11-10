import { Link } from 'react-router-dom';
import {
    Search,
    Eye,
    Edit,
    Ban,
    UserCheck,
    Users,
    ShoppingBag,
    BookOpen
} from 'lucide-react';
import PagingBar from '../../components/PagingBar';
import users from '../../data/users.js';

const AdminUsersPage = () => {


    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-800";
            case "Inactive":
                return "bg-gray-100 text-gray-800";
            case "Suspended":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getRoleBadgeVariant = (role) => {
        switch (role) {
            case "Admin":
                return "bg-blue-100 text-blue-800";
            case "Moderator":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 bg-gray-50/30">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Users</p>
                                    <p className="text-2xl font-bold">{users.length}</p>
                                </div>
                                <Users className="h-8 w-8 text-gray-500" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Active Users</p>
                                    <p className="text-2xl font-bold">{users.filter(user => user.status == 'Active').length}</p>
                                </div>
                                <UserCheck className="h-8 w-8 text-green-500" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">New This Month</p>
                                    <p className="text-2xl font-bold">145</p>
                                </div>
                                <Users className="h-8 w-8 text-blue-500" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Suspended</p>
                                    <p className="text-2xl font-bold">{users.filter(user => user.status == 'Suspended').length}</p>
                                </div>
                                <Ban className="h-8 w-8 text-red-500" />
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden mb-6">
                        <div className="p-3">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <input
                                        placeholder="Search by name or email..."
                                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <select defaultValue="all" className="w-full md:w-[180px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="all">All Roles</option>
                                    <option value="customer">Customer</option>
                                    <option value="admin">Admin</option>
                                    <option value="moderator">Moderator</option>
                                </select>
                                <select defaultValue="all" className="w-full md:w-[180px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rentals</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                            <span className="text-sm font-medium text-gray-600">{getInitials(user.name)}</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{user.name}</p>
                                                            <p className="text-sm text-gray-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeVariant(user.role)}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusVariant(user.status)}`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1">
                                                        <ShoppingBag className="h-4 w-4 text-gray-500" />
                                                        <span className="text-gray-900">{user.orders}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1">
                                                        <BookOpen className="h-4 w-4 text-gray-500" />
                                                        <span className="text-gray-900">{user.rentals}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{formatCurrency(user.totalSpent)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="p-1 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                                                            <Eye className="h-4 w-4" />
                                                            <span className="sr-only">View Profile</span>
                                                        </button>
                                                        <button className="p-1 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                                                            <Edit className="h-4 w-4" />
                                                            <span className="sr-only">Edit User</span>
                                                        </button>
                                                        {user.status !== "Suspended" && user.role === "Customer" && (
                                                            <button className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors">
                                                                <Ban className="h-4 w-4" />
                                                                <span className="sr-only">Suspend User</span>
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
                                <p className="text-sm text-gray-600">Showing 1-8 of 2,456 users</p>
                                <PagingBar pageSize={5} totalPages={2} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}

export default AdminUsersPage;