type BadgeProps = { children: React.ReactNode; variant?: string; size?: string };

const Badge = ({ children, variant = "default", size = "sm" }: BadgeProps) => {

    const v: {
        [key: string]: string
    } = {
        default: "bg-slate-700/60 text-slate-300 border-slate-600/40",
        success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        danger: "bg-red-500/10 text-red-400 border-red-500/20",
        info: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        purple: "bg-violet-500/10 text-violet-400 border-violet-500/20",
        admin: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
        sub_admin: "bg-violet-500/15 text-violet-300 border-violet-400/30",
    };

    const s: {
        [key: string]: string
    } = {
        xs: "px-1.5 py-0.5 text-[10px]",
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs"
    };

    return <span className={`inline-flex items-center gap-1 rounded border mono font-medium ${v[variant]} ${s[size]}`}>{children}</span>;
};

export default Badge;