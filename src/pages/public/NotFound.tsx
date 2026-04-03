import { FileQuestion, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES_PATHS } from "../../routes/routes_path";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center h-screen py-24 px-6 fade-in bg-slate-900">
            <div className="max-w-md w-full text-center">

                {/* Icon */}
                <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                    <FileQuestion size={28} className="text-red-400" />
                </div>

                {/* 404 Number */}
                <h1 className="text-6xl font-bold text-white mb-2 mono">404</h1>

                {/* Title */}
                <h2 className="text-xl font-semibold text-white mb-2">
                    Page Not Found
                </h2>

                {/* Description */}
                <p className="text-slate-400 text-sm mb-8">
                    The page you are looking for doesn’t exist or may have been moved.
                </p>

                {/* Buttons */}
                <div className="flex items-center justify-center gap-3">

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
                    >
                        <ArrowLeft size={16} />
                        Go Back
                    </button>

                    <button
                        onClick={() => navigate(ROUTES_PATHS.DASHBOARD.ROOT)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                    >
                        <Home size={16} />
                        Dashboard
                    </button>

                </div>

            </div>
        </div>
    );
};

export default NotFound;