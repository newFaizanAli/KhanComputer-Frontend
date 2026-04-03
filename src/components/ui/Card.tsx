type CardProps = {
    children: React.ReactNode,
    className?: string,
    glow?: boolean
}

const Card = ({ children, className = "", glow = false }: CardProps) => (
    <div className={`bg-slate-900/80 border border-slate-700/50 
    rounded-xl ${glow ? "ring-1 ring-cyan-500/20 shadow-lg shadow-cyan-500/5" : ""} ${className}`}>
        {children}
    </div>
);

export default Card;