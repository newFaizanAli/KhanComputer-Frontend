import { ChevronRight, RefreshCw, type LucideIcon } from "lucide-react";

type ButtonProps = {
    children?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    icon?: LucideIcon;
    iconRight?: boolean;
    loading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}


// Button
const Button = ({ children, variant = "primary", size = "md", icon: Ic, iconRight, loading, disabled, onClick, type = "button", className = "" }: ButtonProps) => {

    const v = {
        primary: "bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold shadow-lg shadow-cyan-500/20",
        secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50",
        ghost: "hover:bg-slate-800 text-slate-400 hover:text-slate-200",
        danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20",
        success: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20",
        outline: "border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10",
    };

    const s = {
        xs: "px-2 py-1 text-xs gap-1",
        sm: "px-3 py-1.5 text-xs gap-1.5",
        md: "px-4 py-2 text-sm gap-2",
        lg: "px-5 py-2.5 text-sm gap-2"
    };

    return (
        <button type={type} onClick={onClick} disabled={disabled || loading}
            className={`inline-flex items-center justify-center rounded-lg transition-all ${v[variant]} ${s[size]} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
            {loading ? <RefreshCw size={13} className="animate-spin" /> : Ic ? <Ic size={13} /> : null}
            {children}
            {iconRight && <ChevronRight size={11} />}
        </button>
    );
};

export default Button;