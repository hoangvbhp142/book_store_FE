import React from 'react';
import { BookOpen, Target, Eye, Sparkles, Heart, Shield, Truck, HeadphonesIcon } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-sky-700 to-sky-500 text-white py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <BookOpen className="w-16 h-16 mx-auto mb-6" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Chào Mừng Đến Với BookHaven</h1>
                    <p className="text-xl md:text-2xl font-light opacity-90">Ngôi Nhà Của Những Người Yêu Sách</p>
                </div>
            </section>

            {/* Intro Section */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="prose prose-lg max-w-none">
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        Chào mừng bạn đến với <span className="font-semibold text-sky-600">BookHaven</span>, nền tảng sách trực tuyến thế hệ mới, nơi chúng tôi mang đến một giải pháp độc đáo cho tất cả những người đam mê tri thức: <span className="font-semibold">MUA</span> và <span className="font-semibold">CHO THUÊ</span> sách chỉ trong vài cú nhấp chuột.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        Trong thế giới kỹ thuật số hối hả, chúng tôi hiểu rằng tình yêu dành cho những trang sách giấy vẫn luôn vẹn nguyên. Mùi giấy mới, cảm giác lật giở từng trang, hay niềm vui sở hữu một ấn bản quý... đó là những giá trị không thể thay thế.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Tuy nhiên, <span className="font-semibold text-sky-600">BookHaven</span> cũng nhận thấy những trăn trở của độc giả hiện đại: chi phí cho những cuốn sách chuyên ngành đắt đỏ, không gian lưu trữ ngày càng hạn hẹp, và nhiều tựa sách hay chỉ được đọc một lần rồi xếp gọn trên kệ.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="bg-white py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Mission */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 shadow-lg">
                            <div className="flex items-center gap-3 mb-6">
                                <Target className="w-10 h-10 text-amber-600" />
                                <h2 className="text-3xl font-bold text-gray-800">Sứ Mệnh</h2>
                            </div>
                            <p className="text-xl font-semibold text-amber-700 mb-6">
                                "Phá vỡ mọi rào cản để đưa tri thức đến gần hơn với mọi người"
                            </p>
                            <ul className="space-y-4 text-gray-700">
                                <li className="flex gap-3">
                                    <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                                    <span><strong>Linh hoạt hóa trải nghiệm đọc:</strong> Cung cấp lựa chọn "Thuê sách" bên cạnh "Mua sách", giúp tiết kiệm chi phí tối đa</span>
                                </li>
                                <li className="flex gap-3">
                                    <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                                    <span><strong>Tối ưu hóa nguồn tài nguyên:</strong> Thúc đẩy mô hình kinh tế tuần hoàn, giảm lãng phí và lan tỏa giá trị tri thức</span>
                                </li>
                                <li className="flex gap-3">
                                    <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                                    <span><strong>Xây dựng cộng đồng:</strong> Tạo không gian trực tuyến nơi độc giả kết nối và chia sẻ</span>
                                </li>
                            </ul>
                        </div>

                        {/* Vision */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg">
                            <div className="flex items-center gap-3 mb-6">
                                <Eye className="w-10 h-10 text-blue-600" />
                                <h2 className="text-3xl font-bold text-gray-800">Tầm Nhìn</h2>
                            </div>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Đến năm 2030, <span className="font-semibold text-blue-700">BookHaven</span> đặt mục tiêu trở thành:
                            </p>
                            <div className="mt-6 p-6 bg-white rounded-xl">
                                <p className="text-xl font-semibold text-blue-700 leading-relaxed">
                                    "Hệ sinh thái sách trực tuyến hàng đầu tại Việt Nam, tiên phong trong mô hình đọc sách thông minh và bền vững"
                                </p>
                            </div>
                            <p className="mt-6 text-gray-700 leading-relaxed">
                                Chúng tôi khao khát xây dựng một "Trạm" trung tâm, nơi công nghệ được ứng dụng để cá nhân hóa trải nghiệm đọc, nơi mọi cuốn sách đều tìm thấy độc giả của mình, và nơi văn hóa đọc của người Việt Nam ngày càng phát triển mạnh mẽ.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Features */}
            <section className="py-16 px-6 bg-gradient-to-b from-white to-amber-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Tại Sao Chọn BookHaven?</h2>
                    <p className="text-center text-xl text-gray-600 mb-12">Những điểm khác biệt làm nên BookHaven</p>

                    {/* Highlight: Rental Model */}
                    <div className="bg-gradient-to-r from-sky-700 to-indigo-600 text-white rounded-3xl p-10 mb-12 shadow-2xl">
                        <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <Heart className="w-8 h-8" />
                            Mô Hình "Thuê Sách" Độc Đáo
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                                <h4 className="font-bold text-xl mb-3">💰 Siêu tiết kiệm</h4>
                                <p>Chỉ 15-30% giá bìa để tiếp cận kho tri thức khổng lồ</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                                <h4 className="font-bold text-xl mb-3">🏠 Tiết kiệm không gian</h4>
                                <p>Không còn lo nhà chật, kệ đầy. Đọc xong trả lại dễ dàng</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                                <h4 className="font-bold text-xl mb-3">🌱 Bảo vệ môi trường</h4>
                                <p>Tham gia chu trình đọc bền vững, giảm rác thải giấy</p>
                            </div>
                        </div>
                    </div>

                    {/* Other Benefits */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                            <BookOpen className="w-12 h-12 text-amber-600 mb-4" />
                            <h4 className="font-bold text-lg mb-3 text-gray-800">Kho Sách Phong Phú</h4>
                            <p className="text-gray-600">Hàng chục ngàn đầu sách từ văn học, kinh tế đến chuyên ngành</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                            <Sparkles className="w-12 h-12 text-amber-600 mb-4" />
                            <h4 className="font-bold text-lg mb-3 text-gray-800">Trải Nghiệm Mượt Mà</h4>
                            <p className="text-gray-600">Giao diện thân thiện, tìm kiếm thông minh và gợi ý cá nhân hóa</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                            <Truck className="w-12 h-12 text-amber-600 mb-4" />
                            <h4 className="font-bold text-lg mb-3 text-gray-800">Giao Hàng Nhanh</h4>
                            <p className="text-gray-600">Đóng gói cẩn thận, giao hàng tin cậy đến tận tay bạn</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                            <HeadphonesIcon className="w-12 h-12 text-amber-600 mb-4" />
                            <h4 className="font-bold text-lg mb-3 text-gray-800">Hỗ Trợ 24/7</h4>
                            <p className="text-gray-600">Đội ngũ tận tâm luôn sẵn sàng đồng hành cùng bạn</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-16 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Câu Chuyện Của Chúng Tôi</h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                        <p className="text-lg leading-relaxed mb-6">
                            Trạm Đọc được khởi nguồn từ chính những trăn trở của những người sáng lập – những "mọt sách" chính hiệu, và cũng là những người trẻ trong lĩnh vực công nghệ.
                        </p>
                        <p className="text-lg leading-relaxed mb-6">
                            Chúng tôi đã từng là những sinh viên chật vật tìm mua giáo trình chuyên ngành đắt đỏ chỉ để dùng trong một học kỳ. Chúng tôi đã từng là những người đi làm, háo hức mua một cuốn sách kỹ năng "hot" về đọc ngấu nghiến trong một tuần, và rồi để nó "ngủ yên" trên kệ sách hàng năm trời.
                        </p>
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 my-8 rounded-r-lg">
                            <p className="text-xl font-semibold text-amber-800 italic">
                                "Tại sao phải là 'sở hữu' (ownership) trong khi điều chúng ta thực sự cần là 'tiếp cận' (access)?"
                            </p>
                        </div>
                        <p className="text-lg leading-relaxed mb-6">
                            Từ ý tưởng đó, Trạm Đọc ra đời. Chúng tôi tin rằng công nghệ có thể là cầu nối hoàn hảo để giải quyết bài toán này. Bằng cách kết hợp niềm đam mê sách và thế mạnh về công nghệ thông tin, chúng tôi bắt tay vào xây dựng một nền tảng không chỉ để bán sách, mà còn để "luân chuyển" sách, để tri thức được chảy mãi không ngừng.
                        </p>
                        <p className="text-lg leading-relaxed">
                            Đội ngũ của Trạm Đọc là sự kết hợp của những kỹ sư phần mềm tâm huyết, những chuyên viên vận hành tỉ mỉ và những người làm nội dung am hiểu sâu sắc về sách. Chúng tôi làm việc mỗi ngày với một mục tiêu chung: <span className="font-semibold text-amber-700">làm cho việc đọc sách trở nên dễ dàng hơn, rẻ hơn và bền vững hơn cho tất cả mọi người</span>.
                        </p>
                    </div>
                </div>
            </section>

            {/* Commitments */}
            <section className="py-16 px-6 bg-gradient-to-b from-amber-50 to-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Cam Kết Của Trạm Đọc</h2>
                    <p className="text-center text-xl text-gray-600 mb-12">Chất Lượng – Dịch Vụ – Hỗ Trợ</p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Quality Commitment */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-green-500">
                            <Shield className="w-12 h-12 text-green-600 mb-4" />
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Chất Lượng Sản Phẩm</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex gap-2">
                                    <span className="text-green-600 font-bold">✓</span>
                                    <span><strong>Sách mới:</strong> 100% chính hãng, nguyên seal từ NXB uy tín</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-green-600 font-bold">✓</span>
                                    <span><strong>Sách thuê:</strong> Kiểm duyệt nghiêm ngặt, vệ sinh và bọc bìa cẩn thận</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-green-600 font-bold">✓</span>
                                    <span>Mô tả tình trạng rõ ràng, minh bạch</span>
                                </li>
                            </ul>
                        </div>

                        {/* Service Commitment */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-blue-500">
                            <Sparkles className="w-12 h-12 text-blue-600 mb-4" />
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Dịch Vụ Tận Tâm</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex gap-2">
                                    <span className="text-blue-600 font-bold">✓</span>
                                    <span><strong>Minh bạch:</strong> Chi phí rõ ràng, quy trình đơn giản</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-600 font-bold">✓</span>
                                    <span><strong>Giao hàng:</strong> Nhanh chóng, an toàn với đối tác uy tín</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-600 font-bold">✓</span>
                                    <span><strong>Linh hoạt:</strong> Chính sách đổi trả, gia hạn thuận tiện</span>
                                </li>
                            </ul>
                        </div>

                        {/* Support Commitment */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-amber-500">
                            <HeadphonesIcon className="w-12 h-12 text-amber-600 mb-4" />
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Hỗ Trợ Khách Hàng</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex gap-2">
                                    <span className="text-amber-600 font-bold">✓</span>
                                    <span><strong>Đa kênh:</strong> Hotline, Email, Live Chat luôn sẵn sàng</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-amber-600 font-bold">✓</span>
                                    <span><strong>Tư vấn:</strong> Gợi ý sách phù hợp với sở thích của bạn</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-amber-600 font-bold">✓</span>
                                    <span><strong>Lắng nghe:</strong> Mỗi phản hồi là cơ hội cải tiến</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-sky-700 to-indigo-500 text-white py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Sẵn Sàng Khám Phá Thế Giới Tri Thức?</h2>
                    <p className="text-xl mb-8 opacity-90">Hãy để Trạm Đọc đồng hành cùng bạn trên hành trình chinh phục tri thức</p>
                    <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-50 transition-colors shadow-lg">
                        Khám Phá Ngay
                    </button>
                </div>
            </section>
        </div>
    );
}