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
            rentDate: "Jan 20, 2025",
            dueDate: "Feb 3, 2025",
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
            rentDate: "Jan 18, 2025",
            dueDate: "Feb 1, 2025",
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
            rentDate: "Jan 15, 2025",
            dueDate: "Jan 29, 2025",
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
            rentDate: "Jan 10, 2025",
            dueDate: "Jan 24, 2025",
            returnDate: "Jan 23, 2025",
            status: "Returned",
            daysLeft: 0,
            fee: 3.49,
        },
        {
            id: "RNT-5674",
            customer: "Lisa Anderson",
            email: "lisa.a@example.com",
            book: "Harry Potter and the Sorcerer's Stone",
            rentDate: "Jan 22, 2025",
            dueDate: "Feb 5, 2025",
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
            rentDate: "Jan 12, 2025",
            dueDate: "Jan 26, 2025",
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
            rentDate: "Jan 8, 2025",
            dueDate: "Jan 22, 2025",
            returnDate: "Jan 21, 2025",
            status: "Returned",
            daysLeft: 0,
            fee: 4.19,
        },
        {
            id: "RNT-5671",
            customer: "Robert Brown",
            email: "robert.b@example.com",
            book: "The Catcher in the Rye",
            rentDate: "Jan 19, 2025",
            dueDate: "Feb 2, 2025",
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
                return "bg-gray-100 text-gray-800";
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
                                    <p className="text-sm text-gray-600 mb-1">Active Rentals</p>
                                    <p className="text-2xl font-bold">156</p>
                                </div>
                                <Clock className="h-8 w-8 text-blue-500" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Overdue</p>
                                    <p className="text-2xl font-bold text-red-600">23</p>
                                </div>
                                <AlertCircle className="h-8 w-8 text-red-500" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Returned</p>
                                    <p className="text-2xl font-bold">892</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-500" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Revenue</p>
                                    <p className="text-2xl font-bold">$4,567</p>
                                </div>
                                <Calendar className="h-8 w-8 text-gray-500" />
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
                                        placeholder="Search by rental ID, customer, or book title..."
                                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <select defaultValue="all" className="w-full md:w-[180px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="overdue">Overdue</option>
                                    <option value="returned">Returned</option>
                                </select>
                                <select defaultValue="all" className="w-full md:w-[180px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="week">This Week</option>
                                    <option value="month">This Month</option>
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rental ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Left</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {rentals.map((rental) => (
                                            <tr key={rental.id}>
                                                <td className="px-6 py-4 whitespace-nowrap font-mono font-semibold text-gray-900">{rental.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{rental.customer}</p>
                                                        <p className="text-sm text-gray-500">{rental.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{rental.book}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{rental.rentDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{rental.dueDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusVariant(rental.status)}`}>
                                                        {getStatusIcon(rental.status)}
                                                        {rental.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {rental.status === "Returned" ? (
                                                        <span className="text-gray-500">-</span>
                                                    ) : rental.daysLeft < 0 ? (
                                                        <span className="text-red-600 font-semibold">
                                                            {Math.abs(rental.daysLeft)} days overdue
                                                        </span>
                                                    ) : rental.daysLeft <= 3 ? (
                                                        <span className="text-orange-600 font-semibold">{rental.daysLeft} days</span>
                                                    ) : (
                                                        <span className="text-gray-900">{rental.daysLeft} days</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">${rental.fee.toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="p-1 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                                                            <Eye className="h-4 w-4" />
                                                            <span className="sr-only">View Details</span>
                                                        </button>
                                                        {rental.status !== "Returned" && (
                                                            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-transparent">
                                                                Mark Returned
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
                                <p className="text-sm text-gray-600">Showing 1-8 of 1,071 rentals</p>
                                <PagingBar  pageSize={5} totalPages={2} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminRentalsPage;