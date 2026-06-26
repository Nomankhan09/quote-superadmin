import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifySuperAdminOtp } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

export default function VerifyOtpPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { login } = useAuth();

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!state?.adminId) {
        navigate("/login");
        return null;
    }

    const handleVerify = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const { data } = await verifySuperAdminOtp({
                admin_id: state.adminId,
                otp,
            });

            login(data.token, data.admin);

            navigate("/", { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Invalid OTP."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB]">

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

                <h1 className="text-2xl font-bold text-center">
                    Verify OTP
                </h1>

                <p className="text-center text-gray-500 mt-2">
                    Enter the 6-digit code sent to
                </p>

                <p className="text-center font-semibold mt-1">
                    {state.email}
                </p>

                {error && (
                    <div className="mt-5 rounded-lg bg-red-50 border border-red-200 p-3 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleVerify} className="mt-6">

                    <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) =>
                            setOtp(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="000000"
                        className="w-full h-14 rounded-xl border text-center text-2xl tracking-[10px] font-bold"
                    />

                    <button
                        disabled={loading || otp.length !== 6}
                        className="mt-6 w-full h-12 rounded-xl bg-blue-600 text-white font-semibold disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>

                </form>
            </div>
        </div>
    );
}