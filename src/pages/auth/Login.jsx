import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/axiosInstance";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const sendOtp = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "/api/v1/auth/get-otp",
        {
          email,
        }
      );

      toast.success("OTP sent");

      navigate("/verify-otp", {
        state: { email },
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.detail ||
          "Failed to send OTP"
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">
      <form
        onSubmit={sendOtp}
        className="bg-white p-8 rounded shadow w-96"
      >
        <h2 className="text-2xl font-bold mb-6">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          required
          className="w-full border p-3 rounded mb-4"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <button
          className="w-full bg-blue-600 text-white p-3 rounded"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
}

export default Login;