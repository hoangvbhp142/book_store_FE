import React from 'react'
import { Link } from 'react-router-dom'
import {
    ArrowLeft,
} from 'lucide-react';

import ModifyBookForm from '../../components/ModifyBookForm'


const AddBookPage = () => {
    return (
        <main className="flex-1 bg-gray-50/30 min-h-screen">
            <div className="container mx-auto">
                <div className="flex items-center gap-4 mb-5">
                    <Link
                        to="/admin/books"
                        className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-800">
                        Thêm sách mới
                    </h1>
                </div>
                <ModifyBookForm />
            </div>
        </main>
    )
}

export default AddBookPage
