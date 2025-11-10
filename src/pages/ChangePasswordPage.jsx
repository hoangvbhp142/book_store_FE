import React from 'react'

const ChangePasswordPage = () => {
    return (
        <div className="mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Đổi mật khẩu</h1>

            <form className="space-y-4">
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu hiện tại <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        id="currentPassword"
                        placeholder="Mật khẩu hiện tại"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                </div>

                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        placeholder="Mật khẩu mới"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Nhập lại mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Nhập lại mật khẩu mới"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium mt-2"
                >
                    Lưu thay đổi
                </button>
            </form>
        </div>
    )
}

export default ChangePasswordPage
