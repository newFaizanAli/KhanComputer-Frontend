import { Navigate } from "react-router";
import { useUserRole } from "../hooks/useUserRole";

interface Props {
    children: React.ReactNode;
    allow: ("admin" | "subadmin")[];
}

const RoleProtected = ({ children, allow }: Props) => {
    const { role } = useUserRole();

    if (!role || !allow.includes(role as ("admin" | "subadmin"))) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export default RoleProtected;