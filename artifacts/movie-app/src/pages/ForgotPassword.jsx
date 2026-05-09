import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data) {
    try {
      await resetPassword(data.email);
      setSent(true);
    } catch {
      toast.error("Failed to send reset email. Check the address and try again.");
    }
  }

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center px-4 py-12"
      style={{ backgroundImage: "radial-gradient(ellipse at top, #1c0305 0%, #141414 60%)" }}>
      <Link to="/" className="text-[#e50914] font-black text-3xl tracking-tight mb-10 block">
        FILXJOY
      </Link>

      <div className="w-full max-w-md bg-[#1c1c1c]/90 backdrop-blur-sm rounded-2xl border border-[#2a2a2a] p-8 shadow-2xl">
        {sent ? (
          <div className="text-center py-4">
            <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
            <p className="text-gray-400 text-sm mb-6">
              We've sent a password reset link to your email address.
            </p>
            <Link to="/login" className="text-[#e50914] hover:underline text-sm font-medium">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-2">Reset password</h1>
            <p className="text-gray-500 text-sm mb-8">
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#e50914] hover:bg-[#c4070f] text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
              >
                {isSubmitting ? "Sending…" : "Send Reset Link"}
              </button>
            </form>

            <p className="text-center text-gray-500 text-sm mt-6">
              <Link to="/login" className="text-white hover:text-[#e50914] transition-colors">
                Back to Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
