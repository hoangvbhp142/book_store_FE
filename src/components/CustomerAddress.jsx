import { Trash } from 'lucide-react'
import { useNavigate, Link, Meta } from 'react-router-dom'
// import addresses from '../data/Address'
import { useDispatch, useSelector } from 'react-redux'
import { getAll, remove } from '../stores/addressSlice'
import { useEffect } from 'react'
import Loading from './Loading'
import { toast } from 'react-toastify'
const CustomerAddress = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { addresses, error, meta } = useSelector(state => state.address);

    const fetchAddress = async () => {
        dispatch(getAll());
    };

    const handleRemove = async (id) => {
        try {
            const result = await dispatch(remove(id)).unwrap();
            toast.success("Xóa địa chỉ thành công");
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    }

    useEffect(() => {
        if (!addresses.length)
            fetchAddress();
    }, []);

    console.log(addresses, meta);


    return (
        <div className="bg-white p-6">
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-2xl font-bold text-gray-900">Sổ địa chỉ</h1>
                <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                    onClick={() => navigate('/customer/address/new')}>
                    <span>+</span>
                    <span>Thêm địa chỉ</span>
                </button>
            </div>

            <div className="rounded-lg p-3">
                {addresses.map((address, index) => (
                    <div key={index} className="py-2 px-3 bg-white rounded mb-2 last:mb-0 hover:bg-gray-50 transition-colors border-b border-gray-400">
                        <div className="flex justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    {/* <span className="font-medium text-gray-900">{`${address.firstName} ${address.lastName}`}</span> */}
                                    <span className="font-medium text-gray-900">{`${address.name}`}</span>
                                    <span className="text-gray-500 text-sm">|</span>
                                    <span className="text-gray-500 text-sm">{address.phone}</span>
                                    {address.isDefault && (
                                        <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">Địa chỉ giao hàng mặc định</span>
                                    )}
                                </div>
                                <div className="text-gray-600 text-sm mt-0.5">{`${address.street}, ${address.ward}, ${address.district}, ${address.province} `}</div>
                            </div>
                            <div className='flex items-center'>
                                <Link to={`/customer/address/edit/${address.id}`} className="text-blue-600 hover:text-blue-600 text-sm">Sửa</Link>
                                {
                                    !address.isDefault && (
                                        <>
                                            <span className="text-gray-300 mx-1">|</span>
                                            <button className="text-red-500 hover:text-red-700 transition-colors"
                                                onClick={() => handleRemove(address.id)}>
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </>
                                    )
                                }
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            {addresses.length === 0 && (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="text-gray-300 mb-3">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-sm mb-3">Chưa có địa chỉ nào được thêm</p>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">Thêm địa chỉ đầu tiên</button>
                </div>
            )}
        </div>
    )
}

export default CustomerAddress
