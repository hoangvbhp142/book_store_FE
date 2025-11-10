import { Link } from 'react-router-dom';
import {
    User,
    Package,
    Clock,
    Heart,
    Settings,
    MapPin,
    CreditCard
} from 'lucide-react';
import { useState } from 'react';

const Account = () => {

    const [currentTab, setCurrentPage] = useState('overview')

    const recentOrders = [
        {
            id: "ORD-001",
            date: "Jan 15, 2025",
            status: "Delivered",
            total: 44.97,
            items: 2,
        },
        {
            id: "ORD-002",
            date: "Jan 10, 2025",
            status: "Shipped",
            total: 24.99,
            items: 1,
        },
        {
            id: "ORD-003",
            date: "Dec 28, 2024",
            status: "Delivered",
            total: 59.98,
            items: 3,
        },
    ];

    const activeRentals = [
        {
            id: 1,
            title: "Mystery Thriller",
            author: "Jane Smith",
            dueDate: "Feb 15, 2025",
            daysLeft: 20,
            image: "/rental-book-1.jpg?height=200&width=150&query=rental book 1",
        },
        {
            id: 2,
            title: "Science Fiction Epic",
            author: "Bob Johnson",
            dueDate: "Feb 20, 2025",
            daysLeft: 25,
            image: "/rental-book-2.jpg?height=200&width=150&query=rental book 2",
        },
    ];

    const wishlist = [
        {
            id: 1,
            title: "Historical Fiction",
            author: "Alice Brown",
            price: 19.99,
            image: "/wishlist-book-1.jpg?height=200&width=150&query=wishlist book 1",
        },
        {
            id: 2,
            title: "Biography Collection",
            author: "David Lee",
            price: 29.99,
            image: "/wishlist-book-2.jpg?height=200&width=150&query=wishlist book 2",
        },
        {
            id: 3,
            title: "Poetry Anthology",
            author: "Emma White",
            price: 16.99,
            image: "/wishlist-book-3.jpg?height=200&width=150&query=wishlist book 3",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <div className="space-y-8">
                        {/* Tabs List */}
                        <div className="flex gap-2 border-b border-gray-200">
                            <label className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setCurrentPage('overview')}>
                                <input type="radio" name="account-tab" value="overview" defaultChecked className="sr-only" />
                                <User className="h-4 w-4" />
                                <span className="hidden sm:inline">Overview</span>
                            </label>
                            <label className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors"  onClick={() => setCurrentPage('orders')}>
                                <input type="radio" name="account-tab" value="orders" className="sr-only" />
                                <Package className="h-4 w-4" />
                                <span className="hidden sm:inline">Orders</span>
                            </label>
                            <label className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors"  onClick={() => setCurrentPage('rentals')}>
                                <input type="radio" name="account-tab" value="rentals" className="sr-only" />
                                <Clock className="h-4 w-4" />
                                <span className="hidden sm:inline">Rentals</span>
                            </label>
                            <label className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setCurrentPage('wishlist')}>
                                <input type="radio" name="account-tab" value="wishlist" className="sr-only" />
                                <Heart className="h-4 w-4" />
                                <span className="hidden sm:inline">Wishlist</span>
                            </label>
                            <label className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setCurrentPage('settings')}>
                                <input type="radio" name="account-tab" value="settings" className="sr-only" />
                                <Settings className="h-4 w-4" />
                                <span className="hidden sm:inline">Settings</span>
                            </label>
                        </div>

                        {/* Overview Tab */}
                        <div id="overview-content" className={`${currentTab === 'overview' ? '' : 'hidden'} space-y-6`}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white rounded-lg border shadow-sm p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                                            <Package className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold">12</p>
                                            <p className="text-sm text-gray-600">Total Orders</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg border shadow-sm p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                                            <Clock className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold">2</p>
                                            <p className="text-sm text-gray-600">Active Rentals</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg border shadow-sm p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                                            <Heart className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold">{wishlist.length}</p>
                                            <p className="text-sm text-gray-600">Wishlist Items</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders */}
                            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="font-semibold text-xl">Recent Orders</h2>
                                        <button className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                                            <Link to="#orders">View All</Link>
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {recentOrders.slice(0, 3).map((order) => (
                                            <div
                                                key={order.id}
                                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                                            >
                                                <div>
                                                    <p className="font-semibold mb-1">{order.id}</p>
                                                    <p className="text-sm text-gray-600">{order.date}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${order.status === "Delivered"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-gray-100 text-gray-800"
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                    <p className="text-sm font-medium mt-1">${order.total.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Active Rentals */}
                            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="font-semibold text-xl">Active Rentals</h2>
                                        <button className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                                            <Link to="#rentals">View All</Link>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {activeRentals.map((rental) => (
                                            <div key={rental.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                                                <div className="w-20 h-28 bg-gray-100 rounded flex-shrink-0">
                                                    <img
                                                        src={rental.image || "/placeholder.svg"}
                                                        alt={rental.title}
                                                        className="w-full h-full object-cover rounded"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold mb-1 line-clamp-2">{rental.title}</h3>
                                                    <p className="text-sm text-gray-600 mb-2">by {rental.author}</p>
                                                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-2">
                                                        {rental.daysLeft} days left
                                                    </span>
                                                    <p className="text-xs text-gray-600">Due: {rental.dueDate}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Orders Tab */}
                        <div id="orders-content" className={`${currentTab === 'orders' ? '' : 'hidden'} space-y-6`}>
                            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <h2 className="font-semibold text-xl mb-6">Order History</h2>

                                    <div className="space-y-4">
                                        {recentOrders.map((order) => (
                                            <div key={order.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                                <div className="p-6">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                        <div>
                                                            <p className="font-semibold text-lg mb-1">Order {order.id}</p>
                                                            <p className="text-sm text-gray-600">Placed on {order.date}</p>
                                                        </div>
                                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium w-fit ${order.status === "Delivered"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : "bg-gray-100 text-gray-800"
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>

                                                    <hr className="border-gray-200 my-4" />

                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm text-gray-600 mb-1">{order.items} items</p>
                                                            <p className="font-semibold text-lg">${order.total.toFixed(2)}</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
                                                                View Details
                                                            </button>
                                                            {order.status === "Delivered" && (
                                                                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
                                                                    Buy Again
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rentals Tab */}
                        <div id="rentals-content" className={`${currentTab === 'rentals' ? '' : 'hidden'} space-y-6`}>
                            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <h2 className="font-semibold text-xl mb-6">My Rentals</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {activeRentals.map((rental) => (
                                            <div key={rental.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                                <div className="p-4">
                                                    <div className="aspect-[2/3] bg-gray-100 rounded mb-4">
                                                        <img
                                                            src={rental.image || "/placeholder.svg"}
                                                            alt={rental.title}
                                                            className="w-full h-full object-cover rounded"
                                                        />
                                                    </div>
                                                    <h3 className="font-semibold mb-1 line-clamp-2">{rental.title}</h3>
                                                    <p className="text-sm text-gray-600 mb-3">by {rental.author}</p>

                                                    <div className="space-y-2 mb-4">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">Due Date:</span>
                                                            <span className="font-medium">{rental.dueDate}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">Days Left:</span>
                                                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                {rental.daysLeft} days
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
                                                            Extend Rental
                                                        </button>
                                                        <button className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
                                                            Return
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Wishlist Tab */}
                        <div id="wishlist-content" className={`${currentTab === 'wishlist' ? '' : 'hidden'} space-y-6`}>
                            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <h2 className="font-semibold text-xl mb-6">My Wishlist</h2>

                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {wishlist.map((book) => (
                                            <div key={book.id} className="group">
                                                <div className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
                                                    <div className="aspect-[2/3] bg-gray-100 relative">
                                                        <img
                                                            src={book.image || "/placeholder.svg"}
                                                            alt={book.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white rounded-full shadow-sm border">
                                                            <Heart className="h-4 w-4 text-red-500" />
                                                        </button>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{book.title}</h3>
                                                        <p className="text-xs text-gray-600 mb-2">by {book.author}</p>
                                                        <p className="font-bold text-sm mb-3">${book.price.toFixed(2)}</p>
                                                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                                                            Add to Cart
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Settings Tab */}
                        <div id="settings-content" className={`${currentTab === 'settings' ? '' : 'hidden'} space-y-6`}>
                            {/* Profile Information */}
                            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <User className="h-5 w-5" />
                                        <h2 className="font-semibold text-xl">Profile Information</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="profileFirstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    First Name
                                                </label>
                                                <input id="profileFirstName" defaultValue="John" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                            </div>
                                            <div>
                                                <label htmlFor="profileLastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Last Name
                                                </label>
                                                <input id="profileLastName" defaultValue="Doe" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="profileEmail" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Email Address
                                            </label>
                                            <input id="profileEmail" type="email" defaultValue="john.doe@example.com" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                        </div>

                                        <div>
                                            <label htmlFor="profilePhone" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Phone Number
                                            </label>
                                            <input id="profilePhone" type="tel" defaultValue="(555) 123-4567" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                        </div>

                                        <button className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <MapPin className="h-5 w-5" />
                                        <h2 className="font-semibold text-xl">Shipping Address</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="settingsAddress" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Address
                                            </label>
                                            <input id="settingsAddress" defaultValue="123 Main St" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="settingsCity" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    City
                                                </label>
                                                <input id="settingsCity" defaultValue="New York" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                            </div>
                                            <div>
                                                <label htmlFor="settingsState" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    State
                                                </label>
                                                <input id="settingsState" defaultValue="NY" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="settingsZip" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    ZIP Code
                                                </label>
                                                <input id="settingsZip" defaultValue="10001" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                            </div>
                                            <div>
                                                <label htmlFor="settingsCountry" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Country
                                                </label>
                                                <input id="settingsCountry" defaultValue="United States" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                            </div>
                                        </div>

                                        <button className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                                            Update Address
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <CreditCard className="h-5 w-5" />
                                        <h2 className="font-semibold text-xl">Payment Methods</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                            <div className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <CreditCard className="h-5 w-5 text-gray-600" />
                                                        <div>
                                                            <p className="font-medium">•••• •••• •••• 4242</p>
                                                            <p className="text-sm text-gray-600">Expires 12/25</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                                                            Edit
                                                        </button>
                                                        <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button className="px-6 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
                                            Add New Card
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Password */}
                            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <h2 className="font-semibold text-xl mb-6">Change Password</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Current Password
                                            </label>
                                            <input id="currentPassword" type="password" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                        </div>

                                        <div>
                                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                New Password
                                            </label>
                                            <input id="newPassword" type="password" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                        </div>

                                        <div>
                                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Confirm New Password
                                            </label>
                                            <input id="confirmPassword" type="password" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                        </div>

                                        <button className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}

export default Account;
