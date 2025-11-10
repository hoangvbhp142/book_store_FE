; import { Navigate } from 'react-router-dom'
const ProtectedCustomerRoutes = ({ children }) => {

    const token = localStorage.getItem('token');

    if (token !== 'customer-token') {
        return <Navigate to={'/login'} replace />
    }

    return children;
}

export default ProtectedCustomerRoutes;
