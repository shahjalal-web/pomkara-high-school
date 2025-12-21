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
  const [loginError, setLoginError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const { class: studentClass, class_role, number, password } = data;
    try {
      const response = await fetch("https://pomkara-high-school-server.vercel.app/student/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentClass, class_role, number, password }),
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("student", JSON.stringify(result));
      }
      if (!response.ok) {
        setLoading(false);
        throw new Error(result.message || "Login failed");
      }

      setLoading(false);
      // If login is successful, redirect to the dashboard
      router.reload();
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
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center">Student Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Class</label>
            <input
              type="text"
              placeholder="Enter your class in number"
              {...register("class", {
                required: "Class is required",
                min: {
                  value: 6,
                  message: "Class must be between 6 and 10",
                },
                max: {
                  value: 10,
                  message: "Class must be between 6 and 10",
                },
                pattern: {
                  value: /^\S+$/, // Regular expression to disallow spaces
                  message: "this field not contain spaces",
                },
              })}
              className="input input-bordered bg-white text-black w-full"
            />
            {errors.class && (
              <p className="text-red-500 text-sm mt-1">
                {errors.class.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Class Role</label>
            <input
              placeholder="Enter your class role in number"
              type="text"
              {...register("class_role", {
                required: "Class role is required",
                pattern: {
                  value: /^\S+$/, // Regular expression to disallow spaces
                  message: "this field not contain spaces",
                },
              })}
              className="input input-bordered bg-white text-black w-full"
            />
            {errors.class_role && (
              <p className="text-red-500 text-sm mt-1">
                {errors.class_role.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Number</label>
            <input
              type="text"
              placeholder="Enter your number/fathers/mothers"
              {...register("number", {
                required: "number is required",
                pattern: {
                  value: /^01[0-9]{9}$/,
                  message:
                    "number must start with 01 and be exactly 11 digits long",
                },
              })}
              className="input input-bordered bg-white text-black w-full"
            />
            {errors.number && (
              <p className="text-red-500 text-sm mt-1">
                {errors.number.message}
              </p>
            )}
          </div>

          <div className="relative w-full">
            <label>Password</label>
            <input
              className="input input-bordered bg-white text-black border-green-500 mb-5 w-full pr-10" // Added padding to the right for the icon
              {...register("password", { required: "Password is required" })}
              placeholder="Enter your Password"
              name="password"
              type={showPassword ? "text" : "password"} // Toggle input type
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer mt-1"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {loginError && (
            <p className="text-red-500 text-sm text-center">{loginError}</p>
          )}

          <div>
            {
              student ? <button disabled className="btn bg-green-400 w-full">
              Already Login
            </button> : <button type="submit" className="btn bg-green-400 w-full">
              {loading ? "...." : "Login"}
            </button>
            }
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
