import { useState, useMemo } from "react";
import { EyeIcon, Pencil, Trash2 } from "lucide-react";

type Column = {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
};

type DataTableProps = {
    columns?: Column[];
    data?: any[];
    onEdit?: (row: any) => void;
    onDelete?: (row: any) => void;
    onView?: (row: any) => void;
    rowKey?: string;
    searchKeys?: string[]; // 🔥 which keys to search in (e.g. ["name", "email"])

};

const DataTable = ({
    columns,
    data = [],
    onEdit,
    onDelete,
    onView,
    rowKey = "id",
    searchKeys = [], // default empty

}: DataTableProps) => {


    const canView = !!onView;

    const [searchQuery, setSearchQuery] = useState("");

    // 🔥 Filtered data based on search
    const filteredData = useMemo(() => {
        if (!searchQuery) return data;

        const query = searchQuery.toLowerCase();
        return data.filter(row =>
            searchKeys.some(key => String(row[key] ?? "").toLowerCase().includes(query))
        );
    }, [searchQuery, data, searchKeys]);

    return (


        <>
            {/* 🔥 SEARCH BAR */}
            {searchKeys.length > 0 && (
                <div className="m-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full md:w-1/3 px-3 py-2 text-sm text-slate-200 bg-slate-900 border border-slate-700 rounded-lg outline-none placeholder-slate-500"
                    />
                </div>
            )}
            <div className="overflow-x-auto">


                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-700/50">
                            {columns?.map(col => (
                                <th
                                    key={col.key}
                                    className="text-left px-5 py-3 text-slate-500 text-xs uppercase tracking-wider font-semibold whitespace-nowrap"
                                >
                                    {col.label}
                                </th>
                            ))}
                            {(canView || onEdit || onDelete) && (
                                <th className="px-5 py-3 text-slate-500 text-xs uppercase text-right font-semibold">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((row, i) => (
                                <tr
                                    key={row[rowKey] ?? i}
                                    className="border-b border-slate-700/20 hover:bg-slate-800/40 transition-colors"
                                >
                                    {columns?.map(col => (
                                        <td
                                            key={col.key}
                                            className="px-5 py-3 text-slate-200 font-medium whitespace-nowrap"
                                        >
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}

                                    {(onEdit || onDelete || onView) && (
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {onView && (
                                                    <button
                                                        onClick={() => onView(row)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                                                    >
                                                        <EyeIcon size={16} />
                                                    </button>
                                                )}
                                                {(onEdit) && (
                                                    <button
                                                        onClick={() => onEdit(row)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                )}
                                                {(onDelete) && (
                                                    <button
                                                        onClick={() => onDelete(row)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns?.length! + (onEdit || onDelete || onView ? 1 : 0)}
                                    className="py-10 text-center text-slate-400 text-sm font-medium"
                                >
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div></>

    );
};

export default DataTable;