import { AlertCircle, type LucideIcon } from "lucide-react";
import type { FieldValues, RegisterOptions, UseFormRegister } from "react-hook-form";

type FormTextareaProps<T extends FieldValues> = {
    label: string;
    error?: string;
    rows?: number;
    name: keyof T;
    icon?: LucideIcon;
    register: UseFormRegister<T>;
    rules?: RegisterOptions<T>;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const FormTextarea = <T extends FieldValues>({
    label,
    error,
    rows = 3,
    icon: Ic,
    register,
    name,
    rules,
    ...rest
}: FormTextareaProps<T>) => (
    <div className="space-y-1.5">
        {label && (
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
                {label}
            </label>
        )}

        <div className="relative">
            {Ic && (
                <Ic
                    size={14}
                    className="absolute left-3 top-3 text-slate-500"
                />
            )}

            <textarea
                rows={rows}
                {...(register ? register(name as any, rules) : {})}
                {...rest}
                className={`w-full bg-slate-800/80 border rounded-lg text-sm text-slate-200 placeholder-slate-600 outline-none transition-all resize-none focus:border-cyan-500/60
                ${Ic ? "pl-9 pr-3 py-2" : "px-3 py-2"}
                ${error ? "border-red-500/50" : "border-slate-700/50"}`}
            />

            {error && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle size={10} /> {error}
                </p>
            )}
        </div>
    </div>
);

export default FormTextarea;