import { AlertCircle, Eye, EyeOff, Lock, Mail, Globe } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../store";
import { ROUTES_PATHS } from "../../routes/routes_path";
import { FormInput } from "../../components/form";
import { Alert, Button, Card } from "../../components/ui";

type SignInForm = {
    email: string;
    password: string;
};

const SignInPage = () => {

    const { signIn } = useAuthStore();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState:
        {
            errors,
            isSubmitting
        }
    } = useForm<SignInForm>();

    const [showPwd, setShowPwd] = useState(false);

    const onSubmit = async (data: SignInForm) => {
        await signIn(data)
        navigate(ROUTES_PATHS.DASHBOARD.ROOT);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/4 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-violet-500/4 rounded-full blur-3xl pointer-events-none" />
            <div className="w-full max-w-sm fade-in">
                <div className="flex items-center justify-center gap-2.5 mb-8">
                    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center"><Globe size={18} className="text-white" /></div>
                    <span className="text-white font-bold text-lg tracking-widest mono">KCN<span className="text-cyan-400">NETWORK</span></span>
                </div>
                <Card className="p-6 border-slate-700/60">
                    <div className="text-center mb-6">
                        <h1 className="text-white font-bold text-xl mono">Sign In</h1>
                        <p className="text-slate-500 text-sm mt-1">Access your admin dashboard</p>
                    </div>
                    {errors.root && <Alert variant="danger" className="mb-4">{errors.root.message}</Alert>}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormInput label="Email" type="email" autoComplete="current-email" icon={Mail} placeholder="admin@kcn.io"
                            name="email" register={register} rules={{ required: "Email required" }} error={errors.email?.message as string} />
                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input type={showPwd ? "text" : "password"} autoComplete="current-password" placeholder="password123"
                                    {...register("password", { required: "Password required" })}
                                    className={`w-full bg-slate-800/80 border rounded-lg pl-9 pr-10 py-2 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 ${errors.password ? "border-red-500/50" : "border-slate-700/50"}`} />
                                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                    {showPwd ? <EyeOff size={13} /> : <Eye size={13} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={10} />{errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full justify-center" loading={isSubmitting}>
                            {isSubmitting ? "Signing in…" : "Sign In"}
                        </Button>
                    </form>

                </Card>
            </div>
        </div>
    );
}

export default SignInPage