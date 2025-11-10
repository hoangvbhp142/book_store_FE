import React from 'react'
import { BookOpenIcon } from 'lucide-react'

const CategoriesSection = () => {
    return (
        <section className="py-5 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Danh Mục Nổi Bật</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Khám phá sách theo thể loại yêu thích của bạn</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {['Văn học', 'Kinh doanh', 'Kỹ năng', 'Khoa học', 'Thiếu nhi', 'Tiểu thuyết'].map((category, index) => (
                        <div key={index} className="text-center group cursor-pointer">
                            <div className="bg-blue-50 rounded-xl p-6 mb-3 group-hover:bg-blue-100 transition-colors duration-200">
                                <BookOpenIcon className="h-8 w-8 text-blue-600 mx-auto" />
                            </div>
                            <span className="font-medium text-gray-900 text-sm">{category}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CategoriesSection
