import { AlertCircle, type LucideIcon } from "lucide-react";
import type { FieldValues, RegisterOptions, UseFormRegister, Path } from "react-hook-form";


type FormSelectProps<T extends FieldValues> = {
    // name: keyof T;
    name: Path<T>;
    label?: string;
    error?: string;
    icon?: LucideIcon;
    options: { value: string | null | undefined; label: string }[];
    rules?: RegisterOptions<T>;
    register: UseFormRegister<T>;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const FormSelect = <T extends FieldValues>({
    label,
    error,
    icon: Ic,
    options = [],
    register,
    name,
    rules,
    ...rest
}: FormSelectProps<T>) => (
    <div className="space-y-1.5">
        {label && <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</label>}
        <div className="relative">
            {Ic && <Ic size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />}
            <select
                {...(register ? register(name as any, rules) : {})}
                {...rest}
                className={`w-full bg-slate-800/80 border rounded-lg py-2 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 ${error ? "border-red-500/50" : "border-slate-700/50"} ${Ic ? "pl-9 pr-3" : "px-3"}`}

            >
                {options.map(o => <option key={o.value} value={o?.value || ""}>{o.label}</option>)}
            </select>
            {error && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={10} />{error}</p>}
        </div>
    </div>
);

export default FormSelect;