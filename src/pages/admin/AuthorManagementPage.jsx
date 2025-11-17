import React, { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react'; // Giả sử bạn đang sử dụng lucide-react cho icons
import Modal from '../../modal/Modal';
import AuthorModal from '../../modal/AuthorModal';
import PagingBar from '../../components/PagingBar';
import { useDispatch, useSelector } from 'react-redux';
import { create, getAll, update } from '../../stores/authorSlice';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

const AuthorManagementPage = () => {

    const dispatch = useDispatch();
    const { authors, loading, error, meta } = useSelector(state => state.author);

    const [modalData, setModalData] = useState({
        isEdit: false,
        isOpen: false,
        author: null
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const [params, setParams] = useState({
        sort: searchParams.get("sort") || "name:asc",
        q: searchParams.get("q") || "",
        limit: Number(searchParams.get("limit") || 10),
        page: Number(searchParams.get("page") || 1),
        filter: {}
    });

    // ==========EVENT HANDLER ==========
    const updateParams = (patch) => {
        const next = {
            ...params,
            ...patch,
            filter: {
                ...params.filter,
                ...(patch.filter || {})
            }
        };
        setParams(next);

        // Đồng bộ lên URL
        const toSet = {
            ...(next.sort ? { sort: next.sort } : {}),
            ...(next.q ? { q: next.q } : {}),
            ...(next.page !== 0 ? { page: next.page } : {}),
            ...(next.limit !== 0 ? { limit: next.limit } : {})
        };

        console.log(toSet);

        setSearchParams(toSet);
    };

    // Modal handlers
    const openAddModal = () => {
        setModalData({
            isOpen: true,
            isEdit: false,
            author: null
        });
    };

    const openEditModal = (author) => {
        setModalData({
            isOpen: true,
            isEdit: true,
            author
        });
    };

    const closeModal = () => {
        setModalData({ isOpen: false, isEdit: false, author: null });
    };


    const handleDeleteClick = (author) => {
        // if (window.confirm('Bạn có chắc chắn muốn xóa tác giả này?')) {
        //     setAuthors(authors.filter(a => a.id !== author.id));
        // }
    };

    const handleSubmit = async (formData) => {
        const id = formData.id;
        const data = {
            name: formData.name,
            bio: formData.bio
        }
        try {
            if (modalData.isEdit) {
                const result = await dispatch(update({ id, data })).unwrap();
                if (result)
                    toast.success("Cập nhật tác giả thành công");
            } else {
                const result = await dispatch(create(data)).unwrap();
                if (result)
                    toast.success("Thêm tác giả thành công");
            }
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
        closeModal();
    };

    const fetchAuthors = () => {
        console.log(params);

        dispatch(getAll(params));
    }

    useEffect(() => {
        fetchAuthors();
    }, [params]);

    return (
        <div className="container mx-auto p-4 max-w-6xl bg-white">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Quản lý tác giả</h2>
                <button
                    onClick={() => openAddModal(null)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Thêm tác giả
                </button>
            </div>

            <div className="flex justify-between items-center mb-4 gap-2">
                <div className="flex-1 max-w">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên tác giả"
                            value={params.q}
                            onChange={(e) => updateParams({ q: e.target.value })}
                            className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <select
                        value={params.sort}
                        onChange={(e) => updateParams({ sort: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="name:asc">Sắp xếp tên từ A-Z</option>
                        <option value="name:desc">Sắp xếp tên từ Z-A</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                <table className="w-full divide-y divide-gray-200 bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tên
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tiểu sử
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {authors.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="px-6 py-16 text-center text-gray-500 text-lg">
                                    Chưa có tác giả nào. Hãy thêm tác giả mới!
                                </td>
                            </tr>
                        ) : (
                            authors.map(author => (
                                <tr key={author.id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-gray-900">
                                        {author.name}
                                    </td>
                                    <td className="px-6 py-4 text-base text-gray-700 max-w-2xl" title={author.bio}>
                                        <div className="line-clamp-2">
                                            {author.bio}
                                        </div>
                                    </td>
                                    <td className="w-30 px-3 py-4 whitespace-nowrap"> {/* Giảm width và padding */}
                                        <div className="flex justify-start space-x-2"> {/* Sử dụng flex và giảm spacing */}
                                            <button
                                                onClick={() => openEditModal(author)}
                                                className="p-1.5 hover:bg-blue-50 rounded transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                                title="Sửa"
                                            >
                                                <Pencil size={18} className="text-blue-600" /> {/* Giảm nhẹ icon size */}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(author)}
                                                className="p-1.5 hover:bg-red-50 rounded transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                                title="Xóa"
                                            >
                                                <Trash2 size={18} className="text-red-600" /> {/* Giảm nhẹ icon size */}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={modalData.isOpen} onClose={closeModal} title={modalData.isEdit ? "Sửa Tác giả" : "Thêm Tác giả mới"}>
                <AuthorModal
                    isEdit={modalData.isEdit}
                    data={modalData.author}
                    onClose={closeModal}
                    onSubmit={handleSubmit} />
            </Modal>

            <div className='mt-2'>
                <PagingBar
                    currentPage={params.page}
                    onPageChange={(page) => updateParams({ page: page })}
                    pageSize={meta ? meta.limit : 1}
                    totalPages={meta ? meta.pageCount : 1} />
            </div>
        </div>
    );
};

export default AuthorManagementPage;