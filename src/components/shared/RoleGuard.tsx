import { Navigate } from "react-router-dom";
import { usePermissions } from "../../hooks/usePermissions";
import { ROUTES_PATHS } from "../../routes/routes_path";

interface RoleGuardProps {
    path: string;
    children: React.ReactNode;
}

function RoleGuard({ path, children }: RoleGuardProps) {
    const { canAccessRoute } = usePermissions();

    if (!canAccessRoute(path)) {
        return <Navigate to={ROUTES_PATHS.DASHBOARD.ROOT} replace />;
    }

    return <>{children}</>;
}

export default RoleGuard;