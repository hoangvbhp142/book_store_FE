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
    BookOpen
} from "lucide-react";

const AdminDashboard = () => {
    const stats = [
        {
            title: "Doanh thu tháng này",
            value: "85,200,000₫",
            change: "+12%",
            trend: "up",
            icon: DollarSign,
        },
        {
            title: "Tổng đơn hàng",
            value: "438",
            change: "+8%",
            trend: "up",
            icon: ShoppingBag,
        },
        {
            title: "Sách đang được thuê",
            value: "127",
            change: "-5%",
            trend: "down",
            icon: BookOpen,
        },
        {
            title: "Người dùng mới",
            value: "94",
            change: "+15%",
            trend: "up",
            icon: Users,
        },
    ];

    const revenueData = [
        { month: "T1", revenue: 50000000 },
        { month: "T2", revenue: 62000000 },
        { month: "T3", revenue: 58000000 },
        { month: "T4", revenue: 70000000 },
        { month: "T5", revenue: 75200000 },
        { month: "T6", revenue: 85200000 },
    ];

    const ordersByCategory = [
        { category: "Tiểu thuyết", orders: 180 },
        { category: "Giáo khoa", orders: 120 },
        { category: "Kỹ năng sống", orders: 95 },
        { category: "Thiếu nhi", orders: 70 },
    ];

    const userRoles = [
        { name: "Chỉ mua", value: 55 },
        { name: "Chỉ thuê", value: 30 },
        { name: "Cả hai", value: 15 },
    ];

    const COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

    const topBooks = [
        { name: "Đắc Nhân Tâm", sold: 54, rented: 22 },
        { name: "Harry Potter", sold: 48, rented: 40 },
        { name: "Nhà Giả Kim", sold: 45, rented: 25 },
        { name: "7 Thói Quen Hiệu Quả", sold: 32, rented: 18 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 space-y-8 p-6">
            {/* === Thống kê nhanh === */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className="bg-white border border-gray-300 rounded-2xl shadow-sm p-5 flex flex-col justify-between transition hover:shadow-md"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-blue-50 flex items-center justify-center rounded-full">
                                <stat.icon className="h-6 w-6 text-blue-600" />
                            </div>
                            <span
                                className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${stat.trend === "up"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {stat.trend === "up" ? (
                                    <TrendingUp className="h-3 w-3" />
                                ) : (
                                    <TrendingDown className="h-3 w-3" />
                                )}
                                {stat.change}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{stat.title}</p>
                            <p className="text-2xl font-bold mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* === Biểu đồ doanh thu + đơn hàng === */}
            <div className="flex flex-col gap-6">
                {/* Biểu đồ doanh thu */}
                <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1">Ngày bắt đầu</label>
                            <input
                                type="date"
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1">Ngày kết thúc</label>
                            <input
                                type="date"
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                    <h2 className="text-lg font-semibold mb-4">Biểu đồ doanh thu theo tháng</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Biểu đồ đơn hàng theo danh mục */}
                <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Đơn hàng theo danh mục</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={ordersByCategory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="orders" fill="#22C55E" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* === Biểu đồ người dùng === */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Người dùng theo loại */}
                <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Tỉ lệ người dùng</h2>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={userRoles}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                label
                            >
                                {userRoles.map((entry, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Top sách bán/thuê nhiều */}
                <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Top sách phổ biến</h2>
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs uppercase bg-gray-100 text-gray-600">
                            <tr>
                                <th className="px-4 py-2">Sách</th>
                                <th className="px-4 py-2 text-center">Đã bán</th>
                                <th className="px-4 py-2 text-center">Đã thuê</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topBooks.map((book, i) => (
                                <tr key={i} className="border-t">
                                    <td className="px-4 py-2 font-medium">{book.name}</td>
                                    <td className="px-4 py-2 text-center">{book.sold}</td>
                                    <td className="px-4 py-2 text-center">{book.rented}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
};

export default AdminDashboard;
