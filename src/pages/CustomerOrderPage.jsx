import { useState } from 'react';
import {
    Package,
    Truck,
    CheckCircle,
    XCircle
} from 'lucide-react';
import PagingBar from '../components/PagingBar';
import { useNavigate, Link } from 'react-router-dom';

const CustomerOrderPage = () => {

    const navigate = useNavigate();

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
                return "bg-gray-200 text-gray-800";
        }
    };

    const [orders, setOrders] = useState([
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
        }
    ]);

    return (
        <div className="min-h-screen bg-gray-50 py-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-5 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Đơn hàng của tôi</h1>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Bạn chưa có đơn hàng nào.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto shadow-lg rounded-lg">
                        <table className="min-w-full bg-white divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID Đơn hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày đặt
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tổng tiền (VND)
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {order.total} đ
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex gap-0.5 px-2 py-1 text-xs font-semibold rounded-full ${getStatusVariant(order.status)}`}
                                            >
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link
                                                to={`/customer/orders/${order.id}`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Xem chi tiết
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {orders.length > 0 && (
                    <div className="mt-6 flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                            Hiển thị {orders.length} đơn hàng
                        </span>
                        <PagingBar totalPages={10} pageSize={5} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerOrderPage;