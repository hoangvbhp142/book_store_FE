import { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import {
    DollarSign,
    Users,
    TrendingUp,
    TrendingDown,
    ShoppingBag,
    BookOpen,
    Loader2,
    AlertCircle
} from "lucide-react";
import analysisApi from '../../api/analysisApi'; // Điều chỉnh đường dẫn cho đúng

const AdminDashboard = () => {
    const [loading, setLoading] = useState({
        stats: true,
        revenue: true,
        topBooks: true
    });
    const [error, setError] = useState(null);

    // State cho dữ liệu
    const [stats, setStats] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [topBooks, setTopBooks] = useState([]);
    const [topPurchase, setTopPurchase] = useState([]);
    const [topRental, setTopRental] = useState([]);

    // Fetch tất cả dữ liệu
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setError(null);

                // Fetch dữ liệu song song
                const [
                    userRes,
                    bookRes,
                    orderRes,
                    revenueRes,
                    topPurchaseRes,
                    topRentalRes,
                    topBookRes
                ] = await Promise.all([
                    analysisApi.getUserNumber(),
                    analysisApi.getBookNumber(),
                    analysisApi.getOrderNumber(),
                    analysisApi.getRevenue(),
                    analysisApi.getTopPurchase(),
                    analysisApi.getTopRental(),
                    analysisApi.getTopBook()
                ]);

                console.log('API Responses:', {
                    user: userRes,
                    book: bookRes,
                    order: orderRes,
                    revenue: revenueRes,
                    topPurchase: topPurchaseRes,
                    topRental: topRentalRes,
                    topBook: topBookRes
                });

                // Xử lý dữ liệu stats
                const currentMonth = new Date().getMonth() + 1; // Tháng hiện tại (1-12)
                const currentMonthRevenue = revenueRes.data.find(item => item.month === currentMonth)?.revenue || 0;
                const previousMonthRevenue = revenueRes.data.find(item => item.month === (currentMonth === 1 ? 12 : currentMonth - 1))?.revenue || 0;

                setStats([
                    {
                        title: "Doanh thu tháng này",
                        value: formatCurrency(currentMonthRevenue),
                        change: calculatePercentageChange(currentMonthRevenue, previousMonthRevenue),
                        trend: calculateTrend(currentMonthRevenue, previousMonthRevenue),
                        icon: DollarSign,
                    },
                    {
                        title: "Tổng đơn hàng",
                        value: orderRes.totalOrder || "0",
                        change: "+0%", // Không có dữ liệu để tính phần trăm
                        trend: "neutral",
                        icon: ShoppingBag,
                    },
                    {
                        title: "Tổng số sách",
                        value: bookRes.totalBook || "0",
                        change: "+0%",
                        trend: "neutral",
                        icon: BookOpen,
                    },
                    {
                        title: "Tổng người dùng",
                        value: userRes.total || "0",
                        change: "+0%",
                        trend: "neutral",
                        icon: Users,
                    },
                ]);

                // Xử lý dữ liệu doanh thu
                if (revenueRes && Array.isArray(revenueRes)) {
                    const formattedRevenue = revenueRes.map(item => ({
                        month: `T${item.month}`,
                        revenue: item.revenue || 0
                    }));
                    setRevenueData(formattedRevenue);
                }

                // Xử lý top sách
                setTopPurchase(topPurchaseRes || []);
                setTopRental(topRentalRes || []);

                // Nếu topBookRes.data có dữ liệu, sử dụng nó
                if (topBookRes && topBookRes.length > 0) {
                    setTopBooks(topBookRes.slice(0, 10));
                } else {
                    // Nếu không, kết hợp dữ liệu từ topPurchase và topRental
                    const combinedBooks = combineBookData(
                        topPurchaseRes || [],
                        topRentalRes || []
                    );
                    setTopBooks(combinedBooks);
                }

                setLoading({
                    stats: false,
                    revenue: false,
                    topBooks: false
                });

            } catch (err) {
                console.error('Lỗi khi fetch dữ liệu dashboard:', err);
                setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
                setLoading({
                    stats: false,
                    revenue: false,
                    topBooks: false
                });

                // Set dữ liệu mẫu nếu có lỗi
                setStats(getSampleStats());
                setRevenueData(getSampleRevenueData());
                setTopBooks(getSampleTopBooks());
            }
        };

        fetchDashboardData();

        // Refresh data mỗi 5 phút
        const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Format số tiền
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Tính phần trăm thay đổi
    const calculatePercentageChange = (current, previous) => {
        if (previous === 0) {
            if (current === 0) return "+0%";
            return "New"; // Từ 0 lên số dương
        }

        const change = ((current - previous) / previous) * 100;
        return `${change >= 0 ? '+' : ''}${change.toFixed(0)}%`;
    };

    const calculateTrend = (current, previous) => {
        if (current > previous) return "up";
        if (current < previous) return "down";
        return "neutral";
    };

    // Kết hợp dữ liệu sách từ purchase và rental
    const combineBookData = (purchaseData, rentalData) => {
        const bookMap = new Map();

        // Thêm dữ liệu từ purchase
        purchaseData.forEach(book => {
            const bookId = book.bookId || book.id || book.name;
            bookMap.set(bookId, {
                id: bookId,
                name: book.bookName || book.name || `Sách ${bookId}`,
                sold: book.purchaseCount || book.count || book.sold || 0,
                rented: 0
            });
        });

        // Thêm dữ liệu từ rental
        rentalData.forEach(book => {
            const bookId = book.bookId || book.id || book.name;
            const existing = bookMap.get(bookId);
            if (existing) {
                existing.rented = book.rentalCount || book.count || book.rented || 0;
            } else {
                bookMap.set(bookId, {
                    id: bookId,
                    name: book.bookName || book.name || `Sách ${bookId}`,
                    sold: 0,
                    rented: book.rentalCount || book.count || book.rented || 0
                });
            }
        });

        return Array.from(bookMap.values())
            .sort((a, b) => (b.sold + b.rented) - (a.sold + a.rented))
            .slice(0, 10);
    };

    // Dữ liệu mẫu khi API không có dữ liệu
    const getSampleStats = () => [
        {
            title: "Doanh thu tháng này",
            value: formatCurrency(0),
            change: "+0%",
            trend: "neutral",
            icon: DollarSign,
        },
        {
            title: "Tổng đơn hàng",
            value: "0",
            change: "+0%",
            trend: "neutral",
            icon: ShoppingBag,
        },
        {
            title: "Tổng số sách",
            value: "0",
            change: "+0%",
            trend: "neutral",
            icon: BookOpen,
        },
        {
            title: "Tổng người dùng",
            value: "0",
            change: "+0%",
            trend: "neutral",
            icon: Users,
        },
    ];

    const getSampleRevenueData = () => [
        { month: "T1", revenue: 0 },
        { month: "T2", revenue: 0 },
        { month: "T3", revenue: 0 },
        { month: "T4", revenue: 0 },
        { month: "T5", revenue: 0 },
        { month: "T6", revenue: 0 },
        { month: "T7", revenue: 0 },
        { month: "T8", revenue: 0 },
        { month: "T9", revenue: 0 },
        { month: "T10", revenue: 0 },
        { month: "T11", revenue: 0 },
        { month: "T12", revenue: 0 },
    ];

    const getSampleTopBooks = () => [];

    // Dữ liệu mẫu cho các phần chưa có API
    const ordersByCategory = [
        { category: "Tiểu thuyết", orders: 0 },
        { category: "Giáo khoa", orders: 0 },
        { category: "Kỹ năng sống", orders: 0 },
        { category: "Thiếu nhi", orders: 0 },
    ];

    const userRoles = [
        { name: "Chỉ mua", value: 0 },
        { name: "Chỉ thuê", value: 0 },
        { name: "Cả hai", value: 0 },
    ];

    const COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

    if (error && !stats.length) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <div className="text-red-500 text-lg font-semibold mb-2">{error}</div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Tải lại trang
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 space-y-8 p-6">
            {/* === Thống kê nhanh === */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading.stats ? (
                    Array(4).fill(0).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white border border-gray-300 rounded-2xl shadow-sm p-5 flex flex-col justify-between animate-pulse"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                            </div>
                            <div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    stats.map((stat, i) => (
                        <div
                            key={i}
                            className="bg-white border border-gray-300 rounded-2xl shadow-sm p-5 flex flex-col justify-between transition hover:shadow-md"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 bg-blue-50 flex items-center justify-center rounded-full">
                                    <stat.icon className="h-6 w-6 text-blue-600" />
                                </div>
                                {stat.change !== "+0%" && stat.change !== "0%" && (
                                    <span
                                        className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${stat.trend === "up"
                                            ? "bg-green-100 text-green-700"
                                            : stat.trend === "down"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {stat.trend === "up" ? (
                                            <TrendingUp className="h-3 w-3" />
                                        ) : stat.trend === "down" ? (
                                            <TrendingDown className="h-3 w-3" />
                                        ) : null}
                                        {stat.change}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{stat.title}</p>
                                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* === Biểu đồ doanh thu + đơn hàng === */}
            <div className="flex flex-col gap-6">
                {/* Biểu đồ doanh thu */}
                <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Biểu đồ doanh thu theo tháng</h2>
                        <div className="text-sm text-gray-500">
                            Năm {new Date().getFullYear()}
                        </div>
                    </div>
                    {loading.revenue ? (
                        <div className="h-64 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    ) : revenueData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="month"
                                    stroke="#6b7280"
                                    fontSize={12}
                                />
                                <YAxis
                                    stroke="#6b7280"
                                    fontSize={12}
                                    tickFormatter={(value) => {
                                        if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
                                        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                                        return value;
                                    }}
                                />
                                <Tooltip
                                    formatter={(value) => [formatCurrency(value), "Doanh thu"]}
                                    labelFormatter={(label) => `Tháng ${label}`}
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#4F46E5"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: "#4F46E5" }}
                                    activeDot={{ r: 6, fill: "#4F46E5" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                            <AlertCircle className="h-12 w-12 mb-2" />
                            <p>Chưa có dữ liệu doanh thu</p>
                        </div>
                    )}
                </div>

                {/* Biểu đồ đơn hàng theo danh mục */}
                <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Đơn hàng theo danh mục</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={ordersByCategory}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="category"
                                stroke="#6b7280"
                                fontSize={12}
                            />
                            <YAxis
                                stroke="#6b7280"
                                fontSize={12}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb'
                                }}
                            />
                            <Bar
                                dataKey="orders"
                                fill="#22C55E"
                                radius={[4, 4, 0, 0]}
                                name="Số đơn"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* === Biểu đồ người dùng + Top sách === */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Người dùng theo loại */}
                <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Tỉ lệ người dùng</h2>
                    {userRoles.every(role => role.value === 0) ? (
                        <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                            <AlertCircle className="h-12 w-12 mb-2" />
                            <p>Chưa có dữ liệu người dùng</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={userRoles.filter(role => role.value > 0)}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    label={(entry) => `${entry.name}: ${entry.value}%`}
                                >
                                    {userRoles.filter(role => role.value > 0).map((entry, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [`${value}%`, "Tỉ lệ"]}
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb'
                                    }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Top sách bán/thuê nhiều */}
                <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Top sách phổ biến</h2>
                        <div className="text-sm text-gray-500">
                            {topBooks.length > 0 ? `${topBooks.length} sách` : 'Chưa có dữ liệu'}
                        </div>
                    </div>
                    {loading.topBooks ? (
                        <div className="h-64 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    ) : topBooks.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="text-xs uppercase bg-gray-100 text-gray-600">
                                    <tr>
                                        <th className="px-4 py-2 rounded-l-lg">Sách</th>
                                        <th className="px-4 py-2 text-center">Đã bán</th>
                                        <th className="px-4 py-2 text-center">Đã thuê</th>
                                        <th className="px-4 py-2 text-center rounded-r-lg">Tổng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topBooks.map((book, i) => (
                                        <tr key={i} className="border-t hover:bg-gray-50 transition">
                                            <td className="px-4 py-3 font-medium">
                                                <div className="max-w-xs truncate" title={book.name}>
                                                    {book.name}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="font-semibold text-blue-600">
                                                    {book.sold || 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="font-semibold text-green-600">
                                                    {book.rented || 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="font-bold text-purple-600">
                                                    {(book.sold || 0) + (book.rented || 0)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                            <AlertCircle className="h-12 w-12 mb-2" />
                            <p>Chưa có dữ liệu sách phổ biến</p>
                            <p className="text-sm mt-1">Sẽ hiển thị khi có đơn hàng đầu tiên</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Thông tin debug */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="text-sm font-semibold text-yellow-800 mb-2">Thông tin API (Debug):</h3>
                    <div className="text-xs text-yellow-700 space-y-1">
                        <p>• Tổng người dùng: {stats.find(s => s.title === "Tổng người dùng")?.value || 0}</p>
                        <p>• Tổng sách: {stats.find(s => s.title === "Tổng số sách")?.value || 0}</p>
                        <p>• Tổng đơn hàng: {stats.find(s => s.title === "Tổng đơn hàng")?.value || 0}</p>
                        <p>• Số sách phổ biến: {topBooks.length}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;