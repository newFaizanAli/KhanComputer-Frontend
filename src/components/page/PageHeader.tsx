
type PageHeaderProps = {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}


const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        {/* Title & Subtitle */}
        <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white mono">{title}</h1>
            {subtitle && (
                <p className="text-slate-500 text-sm mt-1 sm:mt-0.5">{subtitle}</p>
            )}
        </div>

        {/* Actions */}
        {actions && (
            <div className="flex flex-wrap items-center gap-2 justify-start sm:justify-end">
                {actions}
            </div>
        )}
    </div>
);

export default PageHeader;