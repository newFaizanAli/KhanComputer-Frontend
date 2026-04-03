import { AlertCircle, type LucideIcon } from "lucide-react";
import type { FieldValues, Path, RegisterOptions, UseFormRegister } from "react-hook-form";

type FormInputProps<T extends FieldValues> = {
    label: string;
    error?: string;
    helper?: string;
    icon?: LucideIcon;
    type?: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    rules?: RegisterOptions<T, Path<T>>;
} & React.InputHTMLAttributes<HTMLInputElement>;


const FormInput = <T extends FieldValues>({
    label,
    error,
    helper,
    icon: Ic,
    type = "text",
    register,
    name,
    rules,
    ...rest
}: FormInputProps<T>) => (
    <div className="space-y-1.5">
        {label && (
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
                {label}
            </label>
        )}
        <div className="relative">
            {Ic && <Ic size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />}
            <input
                type={type}
                {...register(name, rules)}
                {...rest}
                className={`w-full bg-slate-800/80 border rounded-lg py-2 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 ${error ? "border-red-500/50" : "border-slate-700/50"
                    } ${Ic ? "pl-9 pr-3" : "px-3"}`}
            />
        </div>
        {error && (
            <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle size={10} /> {error}
            </p>
        )}
        {helper && !error && <p className="text-xs text-slate-600">{helper}</p>}
    </div>
);

export default FormInput;