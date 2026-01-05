"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import auth from "../../../../firebase";
import { AuthContext } from "@/pages/Authentication";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // watch fields
  const selectedRole = watch("role");
  const selectedGroup = watch("group");

  // SUBJECT LISTS
  const subjectOptions = {
    science: ["Physics", "Chemistry", "Biology", "Higher Math", "ICT"],
    commerce: [
      "Accounting",
      "Finance & Banking",
      "Business Entrepreneurship",
      "General Math",
      "ICT",
    ],
    arts: ["Civics", "Geography", "Economics", "History", "Bangla", "English"],
    general: [
      "Bangla",
      "English",
      "General Math",
      "General Science",
      "Religion",
      "Social Science",
      "ICT",
      "Agriculture",
      "Home Science",
      "Physical Education",
      "Drawing / Arts",
      "Work & Life Oriented Education",
    ],
  };

  const onSubmit = async ({
    name,
    role,
    password,
    email,
    image,
    about,
    number,
    group,
    subjects,
  }) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // image upload
      const imageFile = image[0];
      const formData = new FormData();
      formData.append("image", imageFile);

      const imgbbApiKey = "d1fbaa0b9f043f285b08e6d997b387ef";
      const imgbbResponse = await fetch(
        `https://api.imgbb.com/1/upload?expiration=2592000&key=${imgbbApiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const imgbbData = await imgbbResponse.json();
      if (!imgbbData.success) throw new Error("Image upload failed");

      const imageUrl = imgbbData.data.url;

      const userData = {
        name,
        role,
        password,
        email,
        number,
        about,
        image: imageUrl,

        // only meaningful for teachers
        group: role === "teacher" ? group || "" : "",
        subjects: role === "teacher" ? subjects || [] : [],
      };

      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          fetch("https://pomkara-high-school-server.vercel.app/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });

          setSuccess(
            "Request submitted successfully. After approval by authority you can login."
          );
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <input
            {...register("name")}
            required
            placeholder="Full Name"
            className="input input-bordered bg-white text-black w-full border-green-500"
          />

          {/* Role */}
          <select
            {...register("role")}
            required
            className="input input-bordered bg-white text-black w-full border-green-500"
          >
            <option value="">Select your role</option>
            <option value="principle">Principal</option>
            <option value="teacher">Teacher</option>
            <option value="management">Management</option>
          </select>

          {/* 👇 TEACHER EXTRA FIELDS 👇 */}
          {selectedRole === "teacher" && (
            <>
              {/* Group */}
              <select
                {...register("group", { required: true })}
                className="input input-bordered bg-white text-black w-full border-green-500"
              >
                <option value="">Select group</option>
                <option value="science">Science</option>
                <option value="commerce">Commerce</option>
                <option value="arts">Arts</option>
                <option value="general">General (Class 6–8)</option>
              </select>

              {/* Subjects (multiple) */}
              <div className="border border-green-400 rounded-lg p-3">
                <p className="font-semibold mb-2">Select subjects</p>

                <div className="grid grid-cols-2 gap-2">
                  {(subjectOptions[selectedGroup] || []).map((s) => (
                    <label key={s} className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        value={s}
                        {...register("subjects")}
                        className="checkbox checkbox-success"
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-500">
                👉 Ctrl (Windows) / Cmd (Mac) ধরে রেখে multiple select করুন
              </p>
            </>
          )}

          {/* Email */}
          <input
            {...register("email")}
            required
            placeholder="Email address"
            className="input input-bordered bg-white text-black w-full border-green-500"
          />

          {/* Phone */}
          <div>
            <input
              {...register("number", {
                pattern: {
                  value: /^01\d{9}$/,
                  message:
                    "Number must start with '01' and be exactly 11 digits long",
                },
              })}
              required
              placeholder="Mobile number"
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
            <input
              {...register("password")}
              required
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              className="input input-bordered bg-white text-black w-full border-green-500 pr-12"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* About */}
          <textarea
            {...register("about")}
            required
            rows={4}
            placeholder="Write about yourself (qualification, experience, etc.)"
            className="w-full textarea textarea-bordered bg-white text-black border-green-500"
          />

          {/* Image */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Profile Image{" "}
              <span className="text-green-600 text-xs">
                (Square image recommended)
              </span>
            </label>
            <input
              type="file"
              required
              {...register("image")}
              className="file-input file-input-bordered w-full border-green-500"
            />
          </div>

          {/* Messages */}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          {/* Button */}
          {user?.uid ? (
            <button
              disabled
              className="btn btn-outline w-full border-green-500"
            >
              Wait for principal approval
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="btn bg-green-600 hover:bg-green-700 text-white w-full"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          )}
        </form>

        {/* Login link */}
        <p className="text-center mt-5 text-sm">
          Already have an account?{" "}
          <Link
            href="/components/login"
            className="text-green-600 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
