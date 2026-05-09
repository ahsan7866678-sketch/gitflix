import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Signup() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data) {
    try {
      await signUp(data.email, data.password, data.displayName);
      toast.success("Account created! Welcome to Filxjoy.");
      navigate("/");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create account";
      toast.error(msg.includes("email-already-in-use") ? "Email already in use" : "Failed to create account. Try again.");
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate("/");
    } catch {
      toast.error("Google sign-in failed. Try again.");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center px-4 py-12"
      style={{ backgroundImage: "radial-gradient(ellipse at top, #1c0305 0%, #141414 60%)" }}>
      <Link to="/" className="text-[#e50914] font-black text-3xl tracking-tight mb-10 block">
        FILXJOY
      </Link>

      <div className="w-full max-w-md bg-[#1c1c1c]/90 backdrop-blur-sm rounded-2xl border border-[#2a2a2a] p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-2">Create an account</h1>
        <p className="text-gray-500 text-sm mb-8">Join Filxjoy to track your movies</p>

        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 hover:bg-gray-100 font-medium py-2.5 rounded-lg transition-colors mb-6 disabled:opacity-60"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {googleLoading ? "Signing up…" : "Continue with Google"}
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-[#2a2a2a]" />
          <span className="text-gray-600 text-xs">or</span>
          <div className="flex-1 h-px bg-[#2a2a2a]" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="displayName">Full Name</label>
            <input
              id="displayName"
              type="text"
              {...register("displayName")}
              className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#e50914] text-white rounded-lg px-4 py-2.5 outline-none transition-colors placeholder-gray-600"
              placeholder="Your name"
            />
            {errors.displayName && <p className="mt-1 text-xs text-[#e50914]">{errors.displayName.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#e50914] text-white rounded-lg px-4 py-2.5 outline-none transition-colors placeholder-gray-600"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-[#e50914]">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#e50914] text-white rounded-lg px-4 py-2.5 pr-10 outline-none transition-colors placeholder-gray-600"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-[#e50914]">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#e50914] text-white rounded-lg px-4 py-2.5 outline-none transition-colors placeholder-gray-600"
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-[#e50914]">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#e50914] hover:bg-[#c4070f] text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60 mt-2"
          >
            {isSubmitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-white hover:text-[#e50914] transition-colors font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
