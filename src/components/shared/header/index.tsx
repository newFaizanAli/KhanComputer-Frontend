import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, Search, User2Icon } from "lucide-react";
import { useAuthStore } from "../../../store";
import NAV_TREE from "../nav_tree";
import { ROUTES_PATHS } from "../../../routes/routes_path";
import { useState, useMemo, useEffect } from "react";


// 🔥 Types

type NavGroup = {
    id: string;
    label: string;
    icon?: React.ElementType;
    children: {
        id: string;
        label: string;
        route: string;
        icon?: React.ElementType;
    }[];
};

type FlatPage = {
    label: string;
    route: string;
    parent: string;
};



const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signOut } = useAuthStore();


    const flattenNav = (nav: NavGroup[]): FlatPage[] => {
        return nav.flatMap(group =>
            group.children.map(child => ({
                label: child.label,
                route: child.route,
                parent: group.label
            }))
        );
    };



    const navTree = NAV_TREE as NavGroup[];


    const title: string =
        navTree.flatMap(g => g.children)
            .find(c => c.route === location.pathname)?.label || "Dashboard";


    const [query, setQuery] = useState<string>("");
    const [showResults, setShowResults] = useState<boolean>(false);


    const allPages: FlatPage[] = useMemo(() => flattenNav(navTree), [navTree]);


    const filteredPages: FlatPage[] = useMemo(() => {
        if (!query) return [];
        return allPages.filter(p =>
            p.label.toLowerCase().includes(query.toLowerCase()) ||
            p.parent.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, allPages]);


    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setShowResults(true);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const handleSignOut = (): void => {
        signOut();
        navigate(ROUTES_PATHS.AUTH.SIGNIN);
    };

    return (
        <header className="h-14 bg-slate-950/95 backdrop-blur border-b border-slate-800/70 flex items-center justify-between px-5 shrink-0">

            {/* LEFT */}
            <div className="flex items-center gap-2.5">
                <div className="text-white font-semibold text-sm">{title}</div>
                <div className="w-1 h-1 rounded-full bg-slate-700" />
                <div className="text-slate-600 text-xs mono">KCN</div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">

                {/* 🔥 SEARCH */}
                <div className="relative hidden md:block w-56">
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
                        <Search size={11} className="text-slate-600" />
                        <input
                            value={query}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setQuery(e.target.value);
                                setShowResults(true);
                            }}
                            onFocus={() => setShowResults(true)}
                            onBlur={() => setTimeout(() => setShowResults(false), 150)}
                            placeholder="Search pages..."
                            className="bg-transparent text-xs text-slate-300 placeholder-slate-700 outline-none flex-1"
                        />
                    </div>

                    {/* 🔥 DROPDOWN */}
                    {showResults && filteredPages.length > 0 && (
                        <div className="absolute top-10 left-0 w-full bg-slate-900 border border-slate-800 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                            {filteredPages.map((item) => (
                                <div
                                    key={item.route}
                                    onClick={() => {
                                        navigate(item.route);
                                        setQuery("");
                                        setShowResults(false);
                                    }}
                                    className="px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer"
                                >
                                    <div className="font-medium">{item.label}</div>
                                    <div className="text-slate-500 text-[10px]">
                                        {item.parent}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 🔥 EMPTY STATE */}
                    {showResults && query && filteredPages.length === 0 && (
                        <div className="absolute top-10 left-0 w-full bg-slate-900 border border-slate-800 rounded-lg shadow-lg z-50 p-3 text-xs text-slate-500">
                            No results found
                        </div>
                    )}
                </div>

                {/* PROFILE */}
                <button
                    onClick={() => navigate(ROUTES_PATHS.AUTH.PROFILE)}
                    title="Profile"
                    className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-400 hover:border-blue-500/30 transition-colors"
                >
                    <User2Icon size={13} />
                </button>

                {/* SIGN OUT */}
                <button
                    onClick={handleSignOut}
                    title="Sign out"
                    className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-colors"
                >
                    <LogOut size={13} />
                </button>
            </div>
        </header>
    );
};

export default Header;