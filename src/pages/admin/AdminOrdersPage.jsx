import { Link } from 'react-router-dom';
import {
    Search,
    Eye,
    Download,
    Package,
    Truck,
    CheckCircle,
    XCircle
} from 'lucide-react';
import PagingBar from '../../components/PagingBar';

const AdminOrdersPage = () => {
    const orders = [
        {
            id: "ORD-1234",
            customer: "John Doe",
            email: "john.doe@example.com",
            items: 2,
            total: 49.98,
            status: "Processing",
            date: "Jan 25, 2025",
            time: "10:30 AM",
            payment: "Paid",
            shipping: "Standard",
        },
        {
            id: "ORD-1233",
            customer: "Jane Smith",
            email: "jane.smith@example.com",
            items: 1,
            total: 24.99,
            status: "Shipped",
            date: "Jan 24, 2025",
            time: "2:15 PM",
            payment: "Paid",
            shipping: "Express",
        },
        {
            id: "ORD-1232",
            customer: "Bob Johnson",
            email: "bob.johnson@example.com",
            items: 3,
            total: 74.97,
            status: "Delivered",
            date: "Jan 23, 2025",
            time: "9:45 AM",
            payment: "Paid",
            shipping: "Standard",
        },
        {
            id: "ORD-1231",
            customer: "Alice Brown",
            email: "alice.brown@example.com",
            items: 1,
            total: 19.99,
            status: "Pending",
            date: "Jan 23, 2025",
            time: "4:20 PM",
            payment: "Pending",
            shipping: "Standard",
        },
        {
            id: "ORD-1230",
            customer: "Charlie Wilson",
            email: "charlie.w@example.com",
            items: 4,
            total: 99.96,
            status: "Processing",
            date: "Jan 22, 2025",
            time: "11:00 AM",
            payment: "Paid",
            shipping: "Express",
        },
        {
            id: "ORD-1229",
            customer: "Diana Martinez",
            email: "diana.m@example.com",
            items: 2,
            total: 44.98,
            status: "Cancelled",
            date: "Jan 22, 2025",
            time: "3:30 PM",
            payment: "Refunded",
            shipping: "Standard",
        },
        {
            id: "ORD-1228",
            customer: "Edward Lee",
            email: "edward.lee@example.com",
            items: 1,
            total: 29.99,
            status: "Shipped",
            date: "Jan 21, 2025",
            time: "1:45 PM",
            payment: "Paid",
            shipping: "Standard",
        },
        {
            id: "ORD-1227",
            customer: "Fiona Taylor",
            email: "fiona.t@example.com",
            items: 5,
            total: 124.95,
            status: "Delivered",
            date: "Jan 20, 2025",
            time: "10:15 AM",
            payment: "Paid",
            shipping: "Express",
        },
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case "Processing":
                return <Package className="h-4 w-4" />;
            case "Shipped":
                return <Truck className="h-4 w-4" />;
            case "Delivered":
                return <CheckCircle className="h-4 w-4" />;
            case "Cancelled":
                return <XCircle className="h-4 w-4" />;
            default:
                return null;
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-blue-100 text-blue-800";
            case "Shipped":
                return "bg-green-100 text-green-800";
            case "Processing":
                return "bg-yellow-100 text-yellow-800";
            case "Cancelled":
                return "bg-red-100 text-red-800";
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
                                    <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                                    <p className="text-2xl font-bold">1,234</p>
                                </div>
                                <Package className="h-8 w-8 text-gray-500" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Processing</p>
                                    <p className="text-2xl font-bold">45</p>
                                </div>
                                <Package className="h-8 w-8 text-orange-500" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Shipped</p>
                                    <p className="text-2xl font-bold">89</p>
                                </div>
                                <Truck className="h-8 w-8 text-blue-500" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Delivered</p>
                                    <p className="text-2xl font-bold">1,100</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden mb-6">
                        <div className="p-3">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <input
                                        placeholder="Search by order ID, customer name, or email..."
                                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <select defaultValue="all" className="w-full md:w-[180px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <select defaultValue="all" className="w-full md:w-[180px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="all">All Payments</option>
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                                <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-transparent">
                                    <Download className="h-4 w-4" />
                                    Export
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
                        <div className="p-0">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="px-6 py-4 whitespace-nowrap font-mono font-semibold text-gray-900">{order.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{order.customer}</p>
                                                        <p className="text-sm text-gray-500">{order.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{order.items} items</td>
                                                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">${order.total.toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusVariant(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${order.payment === "Paid"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : order.payment === "Refunded"
                                                            ? "bg-gray-100 text-gray-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                        }`}>
                                                        {order.payment}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{order.date}</p>
                                                        <p className="text-sm text-gray-500">{order.time}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="p-1 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                                                            <Eye className="h-4 w-4" />
                                                            <span className="sr-only">View Details</span>
                                                        </button>
                                                        <button className="p-1 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                                                            <Download className="h-4 w-4" />
                                                            <span className="sr-only">Download Invoice</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                                <p className="text-sm text-gray-600">Showing 1-8 of 1,234 orders</p>
                                <PagingBar pageSize={5} totalPages={2} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
export default AdminOrdersPage;