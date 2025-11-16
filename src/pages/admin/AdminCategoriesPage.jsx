import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { create, getAll, update } from "../../stores/categorySlice";
import Modal from '../../modal/Modal';
import AddCategoryForm from '../../modal/AddCategoryForm';
import AdminCategoryTree from '../../components/AdminCategoryTree';
import { toast } from 'react-toastify';
import { buildTree } from '../../app/utils';

const AdminCategoriesPage = () => {
    // Redux hooks
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector(state => state.category);

    // State management
    const [modalData, setModalData] = useState({
        isOpen: false,
        isEdit: false,
        parentCategory: null,   // nếu thêm con, lưu node cha
        category: null          // nếu sửa, lưu node cần sửa
    });



    // Modal handlers
    const openAddModal = (parentCategory = null) => {
        setModalData({
            isOpen: true,
            isEdit: false,
            parentCategory: parentCategory,
            category: null
        });
    };

    const openEditModal = (category) => {
        setModalData({
            isOpen: true,
            isEdit: true,
            parentCategory: null,
            category
        });
    };

    const closeModal = () => {
        setModalData({ isOpen: false, isEdit: false, category: null });
    };


    // Data handlers
    const handleSubmitCategory = async (formData) => {
        console.log('Thêm danh mục:', formData.id);

        const data = {
            name: formData.name,
            parentId: formData.parentId
        }

        console.log(modalData);


        try {
            if (modalData.isEdit) {
                const result = await dispatch(update(formData.id, data)).unwrap();
                console.log(result);
            }
            else {
                const result = await dispatch(create(data)).unwrap();
                console.log(result);

                toast.success("Thêm danh mục thành công");
            }
        } catch (error) {
            console.log(error);
            toast.error(error);
        }

        closeModal();
    };

    const onDelete = () => {

    }

    // API calls
    const fetchCategory = async () => {
        dispatch(getAll({ filter: {}, limit: 10000 }));
    };

    // Effects
    useEffect(() => {
        fetchCategory();
    }, []);


    return (
        <div className="min-h-screen flex flex-col bg-white p-5">
            <main className="flex-1 bg-gray-50/30">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold">Quản lý danh mục</h2>

                        <button
                            onClick={() => openAddModal(null)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Thêm danh mục mới
                        </button>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
                        <AdminCategoryTree
                            categories={buildTree(categories)}
                            onEdit={(node) => openEditModal(node)}
                            onDelete={onDelete}
                            onAddChild={(node) => openAddModal(node)}
                        />

                        <Modal isOpen={modalData.isOpen} onClose={closeModal} title={modalData.isEdit ? "Sửa Danh Mục" : "Thêm Danh Mục"}>
                            <AddCategoryForm
                                isEdit={modalData.isEdit}
                                categoryData={modalData.category}
                                parentCategory={modalData.parentCategory}
                                onSubmit={handleSubmitCategory}
                                onClose={closeModal} />
                        </Modal>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminCategoriesPage;