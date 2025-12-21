/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../DashboardLayout";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const addStudent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    }
  }, []);

  const validUser =
    ["teacher", "principle", "faculty"].includes(user?.role) && user?.isApprove == true;

  //   //console.log(validUser)

  const onSubmit = async (formData) => {
    setLoading(true);
    setError("");
    setSuccess("");
    const {
      name,
      number,
      fathers_name,
      fathers_number,
      mothers_name,
      mothers_number,
      email,
      class: studentClass,
      class_role,
      password,
    } = formData;
    if (validUser) {
      const creator = {
        name: user?.name,
        email: user?.email,
      };

      if (creator) {
        try {
          const response = await fetch("https://pomkara-high-school-server.vercel.app/addStudents", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              number,
              fathers_name,
              fathers_number,
              mothers_name,
              mothers_number,
              email,
              class: studentClass,
              class_role,
              creator,
              password
            }),
          });

          if (!response.ok) {
            setLoading(false);
            setError("something is wrong, student not added");
            setSuccess("");
            const errorData = await response.json();
            throw new Error(errorData.message || "Network response was not ok");
          }

          const data = await response.json();
          setSuccess("Student added successfully");
          setLoading(false);
          setError("");
        } catch (error) {
          setLoading(false);
          setSuccess("");
          setError(error.message);
          console.error("Error saving student data:", error);
        }
      }
    } else {
      setLoading(false);
      setSuccess("");
      setError("Your account don't have enough authority to add any student");
    }
  };

  if (!["teacher", "principle", "faculty"].includes(user?.role) || user?.isApprove == false) {
    return <div  className="text-center mt-4 text-2xl text-red-500 font-serif">Please login first to see this section</div>;
  }

  return (
    <div>
      <div className="md:p-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="shadow-xl shadow-green-400 hover:shadow-2xl hover:shadow-green-600 rounded-xl p-5"
        >
          <div>
            <input
              className="input input-bordered bg-white text-black border-green-500 mb-5 w-full"
              {...register("name", {
                required: "Name is required",
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Name can only contain letters and spaces",
                },
              })}
              placeholder="Enter student Name *"
              name="name"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <select
              className="input input-bordered bg-white text-black border-green-500 mb-5 w-full"
              required
              {...register("class")}
            >
              <option disabled selected value={""}>
                select student class
              </option>
              <option value={"6"}>Six</option>
              <option value={"7"}>Seven</option>
              <option value={"8"}>Eight</option>
              <option value={"9"}>Nine</option>
              <option value={"10"}>Ten</option>
              <option value={"exam batch"}>Exam Batch</option>
            </select>
          </div>
          <div>
            <input
              className="input input-bordered bg-white text-black border-green-500 mb-5 w-full"
              placeholder="Enter studnet class role"
              required
              name="class_role"
              {...register("class_role", {
                required: "Role is required",
                pattern: {
                  value: /^[1-9]\d*$/,
                  message:
                    "Role cannot start with 0 and must be a valid number",
                },
              })}
            />
            {errors.class_role && (
              <p className="text-red-500">{errors.class_role.message}</p>
            )}
          </div>
          <div>
            <input
              className="input input-bordered bg-white text-black border-green-500 mb-5 w-full"
              {...register("number", {
                pattern: {
                  value: /^01\d{9}$/,
                  message:
                    "number must start with '01' and be exactly 11 digits long",
                },
              })}
              placeholder="Enter student number"
              name="number"
            />
            {errors.number && (
              <p className="text-red-500">{errors.number.message}</p>
            )}
          </div>
          <div>
            <input
              className="input input-bordered bg-white text-black border-green-500 mb-5 w-full"
              {...register("fathers_name", {
                required: "Father's name is required",
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Father's name can only contain letters and spaces",
                },
              })}
              placeholder="Enter student Father's Name *"
              name="fathers_name"
            />
            {errors.fathers_name && (
              <p className="text-red-500">{errors.fathers_name.message}</p>
            )}
          </div>
          <div>
            <input
              className="input input-bordered bg-white text-black border-green-500 mb-5 w-full"
              {...register("fathers_number", {
                required: "Father's number is required",
                pattern: {
                  value: /^01\d{9}$/,
                  message:
                    "number must start with '01' and be exactly 11 digits long",
                },
              })}
              placeholder="Enter student father's number *"
              name="fathers_number"
            />
            {errors.fathers_number && (
              <p className="text-red-500">{errors.fathers_number.message}</p>
            )}
          </div>
          <div>
            <input
              className="input input-bordered bg-white text-black border-green-500 mb-5 w-full"
              {...register("mothers_name", {
                required: "Mother's name is required",
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Mother's name can only contain letters and spaces",
                },
              })}
              placeholder="Enter student mother's name *"
              name="mothers_name"
            />
            {errors.mothers_name && (
              <p className="text-red-500">{errors.mothers_name.message}</p>
            )}
          </div>
          <div>
            <input
              className="input input-bordered bg-white text-black border-green-500 mb-5 w-full"
              {...register("mothers_number", {
                pattern: {
                  value: /^01\d{9}$/,
                  message:
                    "number must start with '01' and be exactly 11 digits long",
                },
              })}
              placeholder="Enter mother's number *"
              name="mothers_number"
            />
            {errors.mothers_number && (
              <p className="text-red-500">{errors.mothers_number.message}</p>
            )}
          </div>
          <div className="relative w-full">
              <input
                className="input input-bordered bg-white text-black border-green-500 mb-5 w-full pr-10" // Added padding to the right for the icon
                {...register("password")}
                required
                placeholder="Enter A default Password"
                name="password"
                type={showPassword ? "text" : "password"} // Toggle input type
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer mb-4"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          <div>
            <input
              type="email"
              className="input input-bordered bg-white text-black border-green-500 mb-5 w-full"
              {...register("email", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              placeholder="Enter Student Email"
              name="email"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <p className="text-red-400">{error}</p>
          </div>
          <div>
            <p className="text-green-500">{success}</p>
          </div>

          {loading ? (
            <>
              <input
                value={"......"}
                className="btn btn-outline uppercase font-serif border-green-500 mb-5 w-full"
              />
            </>
          ) : (
            <>
              <input
                type="submit"
                value={"Add_Student"}
                className="btn btn-outline uppercase font-serif border-green-500 mb-5 w-full"
              />
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default addStudent;

addStudent.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
