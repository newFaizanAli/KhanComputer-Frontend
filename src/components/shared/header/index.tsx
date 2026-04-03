import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, Search } from "lucide-react";
import { useAuthStore } from "../../../store";
import NAV_TREE from "../nav_tree";
import { ROUTES_PATHS } from "../../../routes/routes_path";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signOut } = useAuthStore();


    const title =
        NAV_TREE.flatMap(g => g.children)
            .find(c => c.route === location.pathname)?.label || "Dashboard";

    const handleSignOut = () => {
        signOut();
        navigate(ROUTES_PATHS.AUTH.SIGNIN);
    }

    return (
        <header className="h-14 bg-slate-950/95 backdrop-blur border-b border-slate-800/70 flex items-center justify-between px-5 shrink-0">
            <div className="flex items-center gap-2.5">
                <div className="text-white font-semibold text-sm">{title}</div>
                <div className="w-1 h-1 rounded-full bg-slate-700" />
                <div className="text-slate-600 text-xs mono">KCN</div>
            </div>
            <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 w-44">
                    <Search size={11} className="text-slate-600" />
                    <input placeholder="Search…" className="bg-transparent text-xs text-slate-300 placeholder-slate-700 outline-none flex-1 w-full" />
                </div>

                {/* Sign out */}
                <button onClick={() => handleSignOut()} title="Sign out"
                    className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-colors">
                    <LogOut size={13} />
                </button>
            </div>
        </header>
    );
}

export default Header;