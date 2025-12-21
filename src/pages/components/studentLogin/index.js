import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const StudentLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setLoginError("");

    const { class: studentClass, class_role, number, password } = data;

    try {
      const response = await fetch(
        "https://pomkara-high-school-server.vercel.app/student/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentClass,
            class_role,
            number,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      // ✅ Save student & redirect
      localStorage.setItem("student", JSON.stringify(result));
      setLoading(false);

      router.push("/components/profile");
    } catch (err) {
      setLoginError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const studentData = JSON.parse(localStorage.getItem("student"));
      setStudent(studentData);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          Student Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Class */}
          <div>
            <label className="block font-medium mb-1">Class</label>
            <input
              type="text"
              placeholder="Class (6 - 10)"
              {...register("class", {
                required: "Class is required",
                min: { value: 6, message: "Class must be between 6 and 10" },
                max: { value: 10, message: "Class must be between 6 and 10" },
                pattern: {
                  value: /^\S+$/,
                  message: "This field must not contain spaces",
                },
              })}
              className="input input-bordered bg-white text-black w-full border-green-500"
            />
            {errors.class && (
              <p className="text-red-500 text-sm mt-1">
                {errors.class.message}
              </p>
            )}
          </div>

          {/* Class Role */}
          <div>
            <label className="block font-medium mb-1">Class Roll</label>
            <input
              type="text"
              placeholder="Class roll"
              {...register("class_role", {
                required: "Class roll is required",
                pattern: {
                  value: /^\S+$/,
                  message: "This field must not contain spaces",
                },
              })}
              className="input input-bordered bg-white text-black w-full border-green-500"
            />
            {errors.class_role && (
              <p className="text-red-500 text-sm mt-1">
                {errors.class_role.message}
              </p>
            )}
          </div>

          {/* Number */}
          <div>
            <label className="block font-medium mb-1">Guardian Number</label>
            <input
              type="text"
              placeholder="01XXXXXXXXX"
              {...register("number", {
                required: "Number is required",
                pattern: {
                  value: /^01[0-9]{9}$/,
                  message:
                    "Number must start with 01 and be exactly 11 digits long",
                },
              })}
              className="input input-bordered bg-white text-black w-full border-green-500"
            />
            {errors.number && (
              <p className="text-red-500 text-sm mt-1">
                {errors.number.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
              })}
              className="input input-bordered bg-white text-black w-full border-green-500 pr-12"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-11 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Error */}
          {loginError && (
            <p className="text-red-500 text-sm text-center">{loginError}</p>
          )}

          {/* Button */}
          {student ? (
            <button disabled className="btn bg-green-400 w-full text-white">
              Already Logged In
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
      </div>
    </div>
  );
};

export default StudentLogin;
