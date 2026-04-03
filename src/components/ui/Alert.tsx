import { AlertCircle, CheckCircle2, Info } from "lucide-react";

type AlertProps = {
    children: React.ReactNode;
    variant?: "info" | "success" | "warning" | "danger";
    className?: string;
}

// Alert
const Alert = ({ children, variant = "info", className = "" }: AlertProps) => {
    const cfg = {
        info: { bg: "bg-cyan-500/10 border-cyan-500/20", text: "text-cyan-300", Ic: Info },
        success: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-300", Ic: CheckCircle2 },
        warning: { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-300", Ic: AlertCircle },
        danger: { bg: "bg-red-500/10 border-red-500/20", text: "text-red-300", Ic: AlertCircle },
    };
    const c = cfg[variant];
    return (
        <div className={`flex items-start gap-3 p-3 rounded-lg border ${c.bg} ${className}`}>
            <c.Ic size={14} className={`mt-0.5 shrink-0 ${c.text}`} />
            <div className={`text-xs ${c.text}`}>{children}</div>
        </div>
    );
};

export default Alert;