import { AlertCircle } from "lucide-react";
import type {
    FieldValues,
    Path,
    RegisterOptions,
    UseFormRegister
} from "react-hook-form";

type FormCheckboxProps<T extends FieldValues> = {
    label: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    rules?: RegisterOptions<T, Path<T>>;
    error?: string;
    helper?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const FormCheckbox = <T extends FieldValues>({
    label,
    name,
    register,
    rules,
    error,
    helper,
    ...rest
}: FormCheckboxProps<T>) => {
    return (
        <div className="space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                    type="checkbox"
                    {...register(name, rules)}
                    {...rest}
                    className={`h-4 w-4 rounded border bg-slate-800/80 
                    ${error ? "border-red-500/50" : "border-slate-700/50"} 
                    text-cyan-500 focus:ring-cyan-500/30 focus:ring-1`}
                />

                <span className="text-sm text-slate-300">
                    {label}
                </span>
            </label>

            {error && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle size={10} /> {error}
                </p>
            )}

            {helper && !error && (
                <p className="text-xs text-slate-600">{helper}</p>
            )}
        </div>
    );
};

export default FormCheckbox;