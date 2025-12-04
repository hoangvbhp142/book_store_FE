//format gia tien
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
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

const utils = {
    formatCurrency,
    handleApiError,
    buildTree,
    addNodeToTree,
    getDiff
}

export { formatCurrency, handleApiError, buildTree, addNodeToTree, getDiff }
export default utils;