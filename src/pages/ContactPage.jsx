import React from 'react';
import { Mail, Phone, MapPin, Clock, BookOpen } from 'lucide-react';
import { SocialIcon } from 'react-social-icons/component';
import 'react-social-icons/facebook'
import 'react-social-icons/instagram'
import 'react-social-icons/twitter'
import GoogleMapReact from 'google-map-react';

export default function ContactPage() {

    const defaultProps = {
        center: {
            lat: 10.99835602,
            lng: 77.01502627
        },
        zoom: 11
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50">
            {/* Hero */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center justify-center mb-4">
                        <h1 className="text-3xl md:text-5xl font-bold">Liên Hệ Với Chúng Tôi</h1>
                    </div>
                    <p className="text-blue-100 text-lg md:text-xl">
                        Chúng tôi luôn sẵn sàng hỗ trợ bạn về dịch vụ mua bán và cho thuê sách
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Left: Thông tin liên hệ */}
                    <div className="space-y-6">
                        {[
                            {
                                icon: <Phone className="w-6 h-6 text-blue-600" />,
                                bg: "bg-blue-100",
                                title: "Điện Thoại",
                                content: ["+84 123 456 789", "+84 987 654 321"],
                            },
                            {
                                icon: <Mail className="w-6 h-6 text-cyan-600" />,
                                bg: "bg-cyan-100",
                                title: "Email",
                                content: ["info@bookstore.vn", "support@bookstore.vn"],
                            },
                            {
                                icon: <MapPin className="w-6 h-6 text-sky-600" />,
                                bg: "bg-sky-100",
                                title: "Địa Chỉ",
                                content: ["123 Đường Sách, Quận 1", "TP. Hồ Chí Minh, Việt Nam"],
                            },
                            {
                                icon: <Clock className="w-6 h-6 text-green-600" />,
                                bg: "bg-green-100",
                                title: "Giờ Làm Việc",
                                content: ["Thứ 2 - Thứ 6: 8:00 - 20:00", "Thứ 7 - CN: 9:00 - 18:00"],
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                            >
                                <div className="flex items-start">
                                    <div className={`${item.bg} p-3 rounded-full`}>{item.icon}</div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-gray-800 mb-1">
                                            {item.title}
                                        </h3>
                                        {item.content.map((line, j) => (
                                            <p key={j} className="text-gray-600">
                                                {line}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Mạng xã hội */}
                        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
                            <h3 className="font-semibold mb-4 text-lg">Kết Nối Với Chúng Tôi</h3>
                            <div className="flex space-x-4">
                                {[
                                    { url: "https://www.facebook.com/", network: "facebook" },
                                    { url: "https://www.instagram.com/", network: "instagram" },
                                    { url: "https://x.com/home", network: "twitter" },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors cursor-pointer"
                                    >
                                        <SocialIcon url={item.url} network={item.network} className='p-0' />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Bản đồ / nội dung phụ */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex items-center justify-center">
                            <div className="text-center text-gray-600">
                                <MapPin className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                                <p className="font-semibold text-lg">Bản đồ Google Maps</p>
                                <p className="text-gray-500">123 Đường Sách, Quận 1, TP.HCM</p>
                                <div className="mt-6 bg-gray-200 h-64 w-full rounded-lg flex items-center justify-center">
                                    <span className="text-gray-500 italic">
                                        (Nhúng Google Maps thật vào đây sau)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-blue-900 to-cyan-900 text-white py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-blue-100 text-sm md:text-base">
                        © 2024 BookStore - Nền tảng mua bán và cho thuê sách trực tuyến hàng đầu Việt Nam
                    </p>
                </div>
            </div>
        </div>

    );
}