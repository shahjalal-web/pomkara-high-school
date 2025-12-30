/* eslint-disable react-hooks/rules-of-hooks */
import Link from "next/link";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  fetchUserFailure,
  fetchUserStart,
  fetchUserSuccess,
} from "../../../../Redux/features/userSlice";
import { AuthContext } from "@/pages/Authentication";
import { useRouter } from "next/router";
import Head from "next/head";

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loginUser, user, signOutUser } = useContext(AuthContext);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    setError("");
    dispatch(fetchUserStart());

    try {
      const response = await fetch(
        `https://pomkara-high-school-server.vercel.app/user/login?email=${encodeURIComponent(
          email
        )}`
      );
      const userData = await response.json();

      if (userData.message === "User not found") {
        setError("There is no account with this email");
        setLoading(false);
        return;
      }

      if (userData.isApprove) {
        await loginUser(email, password);
        localStorage.setItem("user", JSON.stringify(userData));
        dispatch(fetchUserSuccess(userData));
        setLoading(false);

        // ✅ Redirect to dashboard
        router.push("/components/Dashboard");
      } else {
        setError("Your account has not been approved yet.");
        setLoading(false);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      dispatch(fetchUserFailure(err.message));
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Pomkara High School</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email address"
                {...register("email", { required: true })}
                className="input input-bordered bg-white text-black w-full border-green-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", { required: true })}
                className="input input-bordered bg-white text-black w-full border-green-500 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Error */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Button */}
            {user?.uid ? (
              <button
                type="button"
                onClick={signOutUser}
                className="btn btn-outline border-green-500 w-full"
              >
                Logout first to login again
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn bg-green-600 hover:bg-green-700 text-white w-full"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            )}
          </form>

          {/* Signup */}
          <p className="text-center mt-5 text-sm">
            Don’t have an account?{" "}
            <Link href="/components/signUp" className="text-green-600 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
