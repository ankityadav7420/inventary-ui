import { useState } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../services/axiosInstance";
import { useAuth } from "../../context/AuthContext";

function VerifyOtp() {
  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email;

  const { login } = useAuth();

  const [otp, setOtp] = useState("");

  const verifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/api/v1/auth/login",
        {
          email,
          otp,
        }
      );

      const token =
        response.data.access_token;

      login(token);

      toast.success("Login successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error?.response?.data?.detail ||
          "Invalid OTP"
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">
      <form
        onSubmit={verifyOtp}
        className="bg-white p-8 rounded shadow w-96"
      >
        <h2 className="text-2xl font-bold mb-4">
          Verify OTP
        </h2>

        <p className="mb-4 text-sm">
          {email}
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          required
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value)
          }
          className="w-full border p-3 rounded mb-4"
        />

        <button
          className="w-full bg-green-600 text-white p-3 rounded"
        >
          Verify
        </button>
      </form>
    </div>
  );
}

export default VerifyOtp;