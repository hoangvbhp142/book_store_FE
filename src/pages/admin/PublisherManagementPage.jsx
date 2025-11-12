import React, { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Modal from '../../modal/Modal';
import PublisherModal from '../../modal/PublisherModal';
import PagingBar from '../../components/PagingBar';
import { useDispatch, useSelector } from 'react-redux';
import { create, getAll, remove, update } from '../../stores/publisherSlice';
import { toast } from 'react-toastify';

const PublisherManagementPage = () => {
    const dispatch = useDispatch();
    const { publishers, loading, error, meta } = useSelector(state => state.publisher);

    const [modalData, setModalData] = useState({
        isEdit: false,
        isOpen: false,
        publisher: null
    });

    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);

    const openAddModal = () => {
        setModalData({
            isOpen: true,
            isEdit: false,
            publisher: null
        });
    };

    const openEditModal = (publisher) => {
        setModalData({
            isOpen: true,
            isEdit: true,
            publisher
        });
    };

    const closeModal = () => {
        setModalData({ isOpen: false, isEdit: false, publisher: null });
    };

    const handleDeleteClick = async (publisher) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa nhà xuất bản này?')) {
            try {
                const result = await dispatch(remove(publisher.id)).unwrap();
                console.log(result);
                toast.success('xóa thành công');
            } catch (error) {
                console.log(error);
                toast.error(error);
            }
        }
    };

    const handleSubmit = async (formData) => {
        const id = formData.id;
        const data = {
            name: formData.name,
            address: formData.address,
            website: formData.website,
            contactEmail: formData.contactEmail
        }
        try {
            if (modalData.isEdit) {
                const result = await dispatch(update({ id, data })).unwrap();
                if (result)
                    toast.success("Cập nhật nhà xuất bản thành công"); // Đổi thông báo
            } else {
                const result = await dispatch(create(data)).unwrap();
                if (result)
                    toast.success("Thêm nhà xuất bản thành công"); // Đổi thông báo
            }
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
        closeModal();
    };

    const fetchPublishers = () => {

        const params = {
            sort: `${sortConfig.key}:${sortConfig.direction}`,
            q: searchKeyword,
            filter: {},
            limit: 10,
            page: currentPage || 1
        }

        dispatch(getAll(params));
    }

    useEffect(() => {
        fetchPublishers();
    }, [currentPage, searchKeyword, sortConfig]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchKeyword, sortConfig]);

    return (
        <div className="container mx-auto p-4 max-w-6xl bg-white">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Quản lý nhà xuất bản</h2> {/* Đổi tiêu đề */}
                <button
                    onClick={openAddModal}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Thêm nhà xuất bản {/* Đổi text */}
                </button>
            </div>

            <div className="flex justify-between items-center mb-4 gap-2">
                <div className="flex-1 max-w">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên, email, website..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
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
                        value={sortConfig.key}
                        onChange={(e) => setSortConfig({ ...sortConfig, key: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="name">Sắp xếp theo tên</option>
                        <option value="contactEmail">Sắp xếp theo email</option>
                        <option value="website">Sắp xếp theo website</option>
                        <option value="address">Sắp xếp theo địa chỉ</option>
                    </select>
                    <button
                        onClick={() => setSortConfig({ ...sortConfig, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {sortConfig.direction === 'asc' ? 'A-Z' : 'Z-A'}
                    </button>
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
                                Địa chỉ
                            </th> {/* Thêm cột địa chỉ */}
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Website
                            </th> {/* Thêm cột website */}
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email liên hệ
                            </th> {/* Thêm cột email */}
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {publishers.length === 0 ? ( // Đổi thành publishers
                            <tr>
                                <td colSpan="5" className="px-6 py-16 text-center text-gray-500 text-lg"> {/* Đổi colSpan */}
                                    Chưa có nhà xuất bản nào. Hãy thêm nhà xuất bản mới! {/* Đổi thông báo */}
                                </td>
                            </tr>
                        ) : (
                            publishers.map(publisher => ( // Đổi thành publishers
                                <tr key={publisher.id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-gray-900">
                                        {publisher.name}
                                    </td>
                                    <td className="px-6 py-4 text-base text-gray-700 max-w-md" title={publisher.address}>
                                        <div className="line-clamp-2">
                                            {publisher.address}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-blue-600 hover:text-blue-800">
                                        <a href={publisher.website} target="_blank" rel="noopener noreferrer">
                                            {publisher.website}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
                                        {publisher.contactEmail}
                                    </td>
                                    <td className="w-30 px-3 py-4 whitespace-nowrap">
                                        <div className="flex justify-start space-x-2">
                                            <button
                                                onClick={() => openEditModal(publisher)} // Đổi tham số
                                                className="p-1.5 hover:bg-blue-50 rounded transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                                title="Sửa"
                                            >
                                                <Pencil size={18} className="text-blue-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(publisher)} // Đổi tham số
                                                className="p-1.5 hover:bg-red-50 rounded transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                                title="Xóa"
                                            >
                                                <Trash2 size={18} className="text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={modalData.isOpen} onClose={closeModal} title={modalData.isEdit ? "Sửa nhà xuất bản" : "Thêm nhà xuất bản mới"}> {/* Đổi tiêu đề */}
                <PublisherModal // Đổi thành PublisherModal
                    isEdit={modalData.isEdit}
                    data={modalData.publisher} // Đổi thành publisher
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                />
            </Modal>

            <div className={`mt-2 ${publishers && publishers.length !== 0 ? '' : 'hidden'}`}>
                <PagingBar currentPage={currentPage} onPageChange={(page) => setCurrentPage(page)} pageSize={meta ? meta.limit : 1} totalPages={meta ? meta.pageCount : 1} />
            </div>
        </div>
    );
};

export default PublisherManagementPage;