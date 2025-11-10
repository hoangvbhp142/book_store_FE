import { Navigate } from 'react-router-dom'
const ProtectedAdminRoutes = ({ children }) => {

    const userData = JSON.parse(localStorage.getItem('userData'));

    if (!userData || userData.role !== 'ADMIN') {
        return <Navigate to={'/admin/login'} replace />
    }

    return children;
}

export default ProtectedAdminRoutes;
