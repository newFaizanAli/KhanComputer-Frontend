
type PageHeaderProps = {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}


const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => (
    <div className="flex items-start justify-between mb-6">
        <div>
            <h1 className="text-xl font-bold text-white mono">{title}</h1>
            {subtitle && <p className="text-slate-500 text-sm mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
);

export default PageHeader;