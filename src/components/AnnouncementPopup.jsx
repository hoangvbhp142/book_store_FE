import React, { useEffect, useState } from 'react'

const AnnouncementPopup = ({ title, content }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(true);
    }, []);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl max-w-sm w-full text-center shadow-2xl transform transition-all">
                <h2 className="text-xl font-bold mb-3 text-gray-800">
                    {title || 'Thông báo'}
                </h2>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    {content || 'Website chỉ mang tính chất demo, không sử dụng cho mục đích kinh doanh hay các hoạt động thương mại. Mọi thông tin về sách, giá cả, hình ảnh đều không chính thức và chỉ nhằm mục đích học tập.'}
                </p>

                <button
                    onClick={() => setOpen(false)}
                    className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Đã hiểu
                </button>
            </div>
        </div>
    )
}

export default AnnouncementPopup