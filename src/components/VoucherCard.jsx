import {
    Copy,
    Ticket
} from 'lucide-react';
import React, { useState } from 'react'

const VoucherCard = ({ voucher }) => {

    const [copiedVoucher, setCopiedVoucher] = useState(null);

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedVoucher(code);
        setTimeout(() => setCopiedVoucher(null), 2000);
    };

    return (
        <div className="w-full max-w-md bg-white rounded-md shadow-sm flex items-stretch gap-3 hover:shadow-md transition-all overflow-hidden h-[110px]">
            <div className="flex-shrink-0 flex items-center justify-center w-16 bg-green-600 text-white">
                <Ticket className="w-8 h-8" />
            </div>

            <div className="flex flex-1 flex-col justify-between overflow-hidden p-2">
                <div className="overflow-hidden">
                    <p className="font-semibold text-gray-800 text-sm truncate">{voucher.title}</p>
                    <p className="text-gray-600 text-xs truncate">{voucher.description}</p>

                    <div
                        className="inline-flex items-center gap-1 mt-1 bg-gray-200 px-1.5 py-0.5 rounded-sm cursor-pointer hover:bg-gray-300 transition"
                        onClick={() => copyToClipboard(voucher.code)}
                    >
                        <Copy className="w-3.5 h-3.5 text-gray-500" />
                        <p className="font-mono text-xs text-gray-700 truncate">{voucher.code}</p>
                    </div>

                    <p className="text-[10px] text-blue-700 mt-0.5">HSD: {voucher.expiredAt}</p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-200">
                    <p className="text-xs text-blue-500 cursor-pointer hover:underline">Chi tiết</p>
                    <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                        Sao chép mã
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VoucherCard
