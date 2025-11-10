import React from "react";

const Loading = ({ message = "Đang xử lý..." }) => {
    return (
        <div className="fixed inset-0 bg-gray-600/30 flex items-center justify-center z-50 p-4">
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-lg">
                <svg
                    className="animate-spin h-6 w-6 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                </svg>
                <span className="text-gray-700 font-medium">{message}</span>
            </div>
        </div>
    );
};

export default Loading;
