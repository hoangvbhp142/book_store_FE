import { Link } from 'react-router-dom';
import {
    Search,
    Eye,
    Calendar,
    AlertCircle,
    CheckCircle,
    Clock
} from 'lucide-react';
import PagingBar from '../../components/PagingBar';

const AdminRentalsPage = () => {
    const rentals = [
        {
            id: "RNT-5678",
            customer: "Sarah Johnson",
            email: "sarah.j@example.com",
            book: "The Great Gatsby",
            rentDate: "20/01/2025",
            dueDate: "03/02/2025",
            returnDate: null,
            status: "Active",
            daysLeft: 9,
            fee: 4.99,
        },
        {
            id: "RNT-5677",
            customer: "Michael Chen",
            email: "michael.c@example.com",
            book: "To Kill a Mockingbird",
            rentDate: "18/01/2025",
            dueDate: "01/02/2025",
            returnDate: null,
            status: "Active",
            daysLeft: 7,
            fee: 3.99,
        },
        {
            id: "RNT-5676",
            customer: "Emily Davis",
            email: "emily.d@example.com",
            book: "1984",
            rentDate: "15/01/2025",
            dueDate: "29/01/2025",
            returnDate: null,
            status: "Overdue",
            daysLeft: -4,
            fee: 4.49,
        },
        {
            id: "RNT-5675",
            customer: "David Wilson",
            email: "david.w@example.com",
            book: "Pride and Prejudice",
            rentDate: "10/01/2025",
            dueDate: "24/01/2025",
            returnDate: "23/01/2025",
            status: "Returned",
            daysLeft: 0,
            fee: 3.49,
        },
        {
            id: "RNT-5674",
            customer: "Lisa Anderson",
            email: "lisa.a@example.com",
            book: "Harry Potter and the Sorcerer's Stone",
            rentDate: "22/01/2025",
            dueDate: "05/02/2025",
            returnDate: null,
            status: "Active",
            daysLeft: 11,
            fee: 5.99,
        },
        {
            id: "RNT-5673",
            customer: "James Taylor",
            email: "james.t@example.com",
            book: "The Hobbit",
            rentDate: "12/01/2025",
            dueDate: "26/01/2025",
            returnDate: null,
            status: "Overdue",
            daysLeft: -2,
            fee: 5.49,
        },
        {
            id: "RNT-5672",
            customer: "Maria Garcia",
            email: "maria.g@example.com",
            book: "Brave New World",
            rentDate: "08/01/2025",
            dueDate: "22/01/2025",
            returnDate: "21/01/2025",
            status: "Returned",
            daysLeft: 0,
            fee: 4.19,
        },
        {
            id: "RNT-5671",
            customer: "Robert Brown",
            email: "robert.b@example.com",
            book: "The Catcher in the Rye",
            rentDate: "19/01/2025",
            dueDate: "02/02/2025",
            returnDate: null,
            status: "Active",
            daysLeft: 8,
            fee: 4.29,
        },
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case "Active":
                return <Clock className="h-4 w-4" />;
            case "Overdue":
                return <AlertCircle className="h-4 w-4" />;
            case "Returned":
                return <CheckCircle className="h-4 w-4" />;
            default:
                return null;
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case "Active":
                return "bg-blue-100 text-blue-800";
            case "Overdue":
                return "bg-red-100 text-red-800";
            case "Returned":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 bg-gray-50/30 p-5">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Sách Thuê</h1>
                        <p className="text-gray-600 mt-1">Quản lý và xử lý tất cả yêu cầu trả sách từ người dùng</p>
                    </div>
                </div>
                <div className="container mx-auto">
                    {/* Filters and Search */}
                    <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden mb-6">
                        <div className="p-3">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <input
                                        placeholder="Tìm kiếm theo mã đơn, tên sách"
                                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <select defaultValue="all" className="w-full md:w-[180px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="all">Trạng thái</option>
                                    <option value="active">Đang thuê</option>
                                    <option value="overdue">Quá hạn</option>
                                    <option value="returned">Đã trả</option>
                                </select>
                                <select defaultValue="all" className="w-full md:w-[180px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="all">Tất cả thời gian</option>
                                    <option value="today">Hôm nay</option>
                                    <option value="week">Tuần này</option>
                                    <option value="month">Tháng này</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Rentals Table */}
                    <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
                        <div className="p-0">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn hàng</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sách</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày thuê</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày trả</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phí</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {rentals.map((rental) => (
                                            <tr key={rental.id}>
                                                <td className="px-6 py-4 whitespace-nowrap font-mono font-semibold text-gray-900">{rental.id}</td>

                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{rental.book}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{rental.rentDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{rental.dueDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusVariant(rental.status)}`}>
                                                        {getStatusIcon(rental.status)}
                                                        {rental.status}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">${rental.fee.toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="p-1 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                                                            <Eye className="h-4 w-4" />
                                                            <span className="sr-only">View Details</span>
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
                                <p className="text-sm text-gray-600">Showing 1-8 of 1,071 rentals</p>
                                <PagingBar pageSize={5} totalPages={2} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminRentalsPage;