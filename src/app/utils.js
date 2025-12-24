//format gia tien
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

//xu ly exception khi goi api
const handleApiError = (error, rejectWithValue) => {
    if (error.response && error.response.data) {
        const message = error.response.data.message;
        if (Array.isArray(message)) {
            return rejectWithValue(message.join(", "));
        }
        return rejectWithValue(message || "Đã xảy ra lỗi");
    }
    return rejectWithValue(error.message || "Đã xảy ra lỗi không xác định");
}

//so sanh du lieu truoc va sau khi sua
const getDiff = (original, current) => {
    const diff = {};

    Object.keys(current).forEach(key => {
        if (current[key] !== original[key]) {
            diff[key] = current[key];
        }
    });

    return diff;
}

//Tao cay
const buildTree = (tree) => {
    const map = {};
    const roots = [];

    tree.forEach(node => {
        map[node.id] = {
            ...node,
            children: [],
            parentName: ''
        }
    });

    tree.forEach(node => {
        if (node.parentId) {
            if (map[node.parentId]) {
                map[node.parentId].children.push(map[node.id]);
                map[node.id].parentName = map[node.parentId].name;
            }
        }
        else {
            roots.push(map[node.id]);
        }
    })

    return roots;
}

const addNodeToTree = (tree, parentId, newNode) => {
    for (const node of tree) {
        if (node._id === parentId) {
            node.children = node.children || [];
            node.children.push(newNode);
            return true;
        }
        else {
            if (node.children?.length) {
                const added = addNodeToTree(tree, newNode);
                if (added) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Hàm format ngày
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Hàm format ngày chỉ ngày tháng
const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
};

// Hàm rút gọn ID để hiển thị
const shortenId = (id) => {
    if (!id) return 'N/A';
    return id.substring(0, 15) + '...';
};

const utils = {
    formatCurrency,
    handleApiError,
    buildTree,
    addNodeToTree,
    getDiff,
    formatDateOnly,
    formatDate,
    shortenId
}

export { formatCurrency, handleApiError, buildTree, addNodeToTree, getDiff, formatDateOnly, formatDate, shortenId }
export default utils;