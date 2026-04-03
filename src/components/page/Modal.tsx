
import { X } from "lucide-react";
import type { ReactNode } from "react";


const Modal = ({ open, onClose, title, children, size = "md" }: {
    open: boolean,
    onClose: () => void,
    title: string,
    children: ReactNode,
    size?: 'sm' | 'md' | 'lg' | 'xl'
}) => {
    if (!open) return null;

    const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-3xl" };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className={`relative w-full ${sizes[size]} bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl fade-in max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50 sticky top-0 bg-slate-900 z-10">
                    <div className="text-white font-semibold">{title}</div>
                    <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"><X size={14} /></button>
                </div>
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
};

export default Modal;