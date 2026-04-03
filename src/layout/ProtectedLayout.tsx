import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { ROUTES_PATHS } from '../routes/routes_path';
import { useAuthStore } from '../store';
import { Header, Sidebar } from '../components/shared';


const ProtectedLayout = () => {

    const token = localStorage.getItem("kcn_token")
    const { fetchCurrentUser, isFetched, current_user } = useAuthStore();

    useEffect(() => {
        if (!isFetched) {
            fetchCurrentUser();
        }
    }, [fetchCurrentUser, isFetched])


    const [collapsed, setCollapsed] = useState(false);

    if (!token) {
        return <Navigate to={ROUTES_PATHS.AUTH.SIGNIN} />;
    }

    if (!isFetched || !current_user) {
        return <div>Loading...</div>;
    }



    return (
        <div
            className={`flex h-screen bg-slate-950 overflow-hidden`}

        >
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProtectedLayout;