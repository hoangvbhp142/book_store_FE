import React from 'react'
import policiesData from '../data/Policies'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const PolicyDisplayPage = () => {

    const policy = policiesData[0];
    const modules = {
        toolbar: false, // Ẩn toolbar khi chỉ hiển thị
    };

    return (
        <ReactQuill
            value={policy.content}
            readOnly={true}
            modules={modules}
            theme="snow"
        />
    )
}

export default PolicyDisplayPage
