import { AlertCircle, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFormContext, type FieldValues, type Path, type RegisterOptions, type UseFormRegister } from "react-hook-form";


type Option = {
    value: string;
    label: string;
};

type Props<T extends FieldValues> = {
    label?: string;
    name: Path<T>;                    // ✅ was: keyof T & string
    icon?: LucideIcon;
    error?: string;
    value?: Option | null;
    placeholder?: string;
    register?: UseFormRegister<T>;
    rules?: RegisterOptions<T, Path<T>>;
    onSearch: (value: string) => Promise<Option[]>;
    onChange: (value: Option) => void;
};

const FormSearchSelect = <T extends FieldValues>({
    label,
    name,
    icon: Ic,
    error,
    placeholder = "Search...",
    value,
    register,
    rules,
    onSearch,
    onChange,
}: Props<T>) => {
    const [query, setQuery] = useState(value?.label || "");
    const [options, setOptions] = useState<Option[]>([]);
    const [open, setOpen] = useState(false);

    const ref = useRef<HTMLDivElement>(null);
    const requestId = useRef(0);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const formContext = useFormContext();
    const setFormValue = formContext?.setValue ?? null;

    // sync external value (edit mode)
    useEffect(() => {
        if (value?.label !== undefined) {
            setQuery(value.label);
        }
    }, [value]);

    // debounce search
    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        if (!query.trim()) {
            setOptions([]);
            return;
        }

        debounceTimer.current = setTimeout(async () => {
            const currentId = ++requestId.current;
            try {
                const data = await onSearch(query);
                if (currentId !== requestId.current) return;
                setOptions(data);
            } catch (err) {
                console.error("Search error:", err);
            }
        }, 300);

        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [query, onSearch]);

    // close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const registered = register
        ? register(name, {
            ...rules,
            validate: (rules as any)?.required
                ? (val: any) =>
                    !!val ||
                    (typeof (rules as any).required === "string"
                        ? (rules as any).required
                        : "Required")
                : undefined,
        })
        : null;

    return (
        <div className="space-y-1.5" ref={ref}>
            {label && (
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {label}
                </label>
            )}

            <div className="relative">
                {Ic && (
                    <Ic
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                        size={14}
                    />
                )}

                <input
                    value={query}
                    placeholder={placeholder}
                    onFocus={() => setOpen(true)}
                    onBlur={registered?.onBlur}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (!e.target.value && setFormValue) {
                            setFormValue(name, "" as any, { shouldValidate: true });
                        }
                        setOpen(true);
                    }}
                    className={`w-full bg-slate-800/80 border rounded-lg py-2 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 ${error ? "border-red-500/50" : "border-slate-700/50"
                        } ${Ic ? "pl-9 pr-3" : "px-3"}`}
                />

                {open && options.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg max-h-48 overflow-auto">
                        {options.map((opt) => (
                            <div
                                key={opt.value}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                    onChange(opt);
                                    setQuery(opt.label);
                                    setOpen(false);
                                }}
                                className="px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 cursor-pointer"
                            >
                                {opt.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {error && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle size={10} /> {error}
                </p>
            )}
        </div>
    );
};

export default FormSearchSelect;