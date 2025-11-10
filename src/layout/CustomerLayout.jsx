import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import CustomerSidebar from '../components/CustomerSidebar';
const CustomerLayout = () => {

    return (
        <div className="flex m-auto min-h-screen bg-gray-100 justify-center max-w-7xl">
            <CustomerSidebar />

            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-3">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default CustomerLayout;