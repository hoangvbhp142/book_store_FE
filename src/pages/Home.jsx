import React from 'react'
import Hero from '../components/Hero'
import BookList from '../components/BookList'
import CategoriesSection from '../components/CategoriesSection'
import { Link } from 'react-router-dom'
import books from '../data/Books'
import { TruckIcon, ShieldCheckIcon, Star, ArrowLeftRightIcon } from 'lucide-react'

const Home = () => {

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Hero />
      <CategoriesSection />

      {/* --- Featured Books --- */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-14 text-center sm:text-left">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Sách Nổi Bật</h2>
              <p className="text-gray-600 text-sm sm:text-base">Những cuốn sách được yêu thích nhất</p>
            </div>
            <Link to="/store" className="text-blue-600 hover:text-blue-700 font-medium mt-4 sm:mt-0 transition-colors">
              Xem tất cả →
            </Link>
          </div>
          <BookList books={books} />
        </div>
      </section>

      {/* --- New Books --- */}
      <section className="py-14 sm:py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-14 text-center sm:text-left">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Sách Mới</h2>
              <p className="text-gray-600 text-sm sm:text-base">Những tựa sách vừa được cập nhật</p>
            </div>
            <Link to="/new" className="text-blue-600 hover:text-blue-700 font-medium mt-4 sm:mt-0 transition-colors">
              Xem tất cả →
            </Link>
          </div>
          <BookList books={books} />
        </div>
      </section>

      {/* --- Why Choose Us --- */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Tại Sao Chọn BookHaven?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                icon: <TruckIcon className="h-8 w-8 text-green-600" />,
                title: "Giao Hàng Nhanh",
                desc: "Nhận sách trong vòng 2-3 ngày làm việc",
                bg: "bg-green-100",
              },
              {
                icon: <ShieldCheckIcon className="h-8 w-8 text-blue-600" />,
                title: "Chất Lượng Đảm Bảo",
                desc: "Sách mới 100%, đóng gói cẩn thận",
                bg: "bg-blue-100",
              },
              {
                icon: <ArrowLeftRightIcon className="h-8 w-8 text-purple-600" />,
                title: "Đổi Trả Dễ Dàng",
                desc: "Đổi trả trong vòng 7 ngày nếu không hài lòng",
                bg: "bg-purple-100",
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200">
                <div className={`${item.bg} rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Testimonials --- */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Đánh Giá Từ Độc Giả</h2>
            <p className="text-gray-600 text-sm sm:text-base">Những gì khách hàng nói về chúng tôi</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 text-sm sm:text-base">
                  "Dịch vụ tuyệt vời! Sách chất lượng, giao hàng nhanh. Tôi sẽ tiếp tục ủng hộ BookHaven."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">Nguyễn Văn A</p>
                    <p className="text-gray-500 text-xs sm:text-sm">Độc giả thân thiết</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home;
