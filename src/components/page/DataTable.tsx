import { EyeIcon, Pencil, Trash2 } from "lucide-react";

// DataTable
const DataTable = ({ columns, data, onEdit, onDelete, onView, rowKey = "id" }: {
    columns?: { key: string, label: string, render?: (value: any, row: any) => React.ReactNode }[],
    data?: any[],
    onEdit?: (row: any) => void,
    onDelete?: (row: any) => void,
    onView?: (row: any) => void,
    rowKey?: string
}) => (
    <div className="overflow-x-auto">
        <table className="w-full text-base">
            <thead>
                <tr className="border-b border-slate-700/50">
                    {columns?.map(col => (
                        <th key={col.key} className="text-left px-5 py-4 text-slate-500 text-sm uppercase tracking-wider font-semibold whitespace-nowrap">
                            {col.label}
                        </th>
                    ))}
                    {(onEdit || onDelete || onView) && (
                        <th className="px-5 py-4 text-slate-500 text-sm uppercase text-right font-semibold">
                            Actions
                        </th>
                    )}
                </tr>
            </thead>
            <tbody>
                {data?.map((row, i) => (
                    <tr key={row[rowKey] ?? i} className="border-b border-slate-700/20 hover:bg-slate-800/40 transition-colors">
                        {columns?.map(col => (
                            <td key={col.key} className="px-5 py-4 text-slate-200 font-medium whitespace-nowrap">
                                {col.render ? col.render(row[col.key], row) : row[col.key]}
                            </td>
                        ))}
                        {(onEdit || onDelete || onView) && (
                            <td className="px-5 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    {onView && (
                                        <button onClick={() => onView(row)} className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                                            <EyeIcon size={18} />
                                        </button>
                                    )}
                                    {onEdit && (
                                        <button onClick={() => onEdit(row)} className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors">
                                            <Pencil size={18} /> {/* Increased icon size */}
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button onClick={() => onDelete(row)} className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    )}

                                </div>
                            </td>
                        )}
                    </tr>
                ))}
                {data?.length === 0 && (
                    <tr>
                        <td colSpan={99} className="py-12 text-center text-slate-400 text-base font-medium">
                            No records found
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

export default DataTable;