import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, ChevronRight, ChevronDown } from "lucide-react";

function CategoryNode({ category, onEdit, onDelete, onAddChild }) {
    const [open, setOpen] = useState(false);
    const hasChildren = category.children && category.children.length > 0;

    return (
        <div className="ml-4 mt-1">
            {/* Dòng chính của category */}
            <div className="flex items-center gap-2 py-1 px-2 bg-gray-50 rounded hover:bg-gray-100">
                {/* Toggle mở/đóng */}
                {hasChildren ? (
                    <button
                        onClick={() => setOpen(!open)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                ) : (
                    <span className="w-4" /> // chừa chỗ cho icon
                )}

                {/* Tên danh mục */}
                <span className="flex-1 font-medium text-gray-800">
                    {category.name}
                </span>

                {/* Hành động CRUD */}
                <div className="flex gap-1">
                    <button
                        onClick={() => onAddChild(category)}
                        className="p-1 hover:bg-green-100 rounded"
                        title="Thêm danh mục con"
                    >
                        <Plus size={14} className="text-green-600" />
                    </button>
                    <button
                        onClick={() => onEdit(category)}
                        className="p-1 hover:bg-blue-100 rounded"
                        title="Sửa"
                    >
                        <Pencil size={14} className="text-blue-600" />
                    </button>
                    <button
                        onClick={() => onDelete(category)}
                        className="p-1 hover:bg-red-100 rounded"
                        title="Xóa"
                    >
                        <Trash2 size={14} className="text-red-600" />
                    </button>
                </div>
            </div>

            {/* Các danh mục con */}
            {hasChildren && open && (
                <div className="ml-5 border-l border-gray-200 pl-2">
                    {category.children.map((child) => (
                        <CategoryNode
                            key={child.id}
                            category={child}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onAddChild={onAddChild}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function AdminCategoryTree({categories, onEdit, onDelete, onAddChild}) {

    return (
        <div className="p-4 bg-white shadow rounded-lg">
            {categories.length === 0 ? (
                <p className="text-gray-500">Chưa có danh mục nào.</p>
            ) : (
                categories.map((cat) => (
                    <CategoryNode
                        key={cat.id}
                        category={cat}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onAddChild={onAddChild}
                    />
                ))
            )}
        </div>
    );
}
