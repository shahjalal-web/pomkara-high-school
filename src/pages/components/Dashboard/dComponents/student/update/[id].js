import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "../../../DashboardLayout";
import { useForm } from "react-hook-form";

const UpdateStudent = () => {
  const router = useRouter();
  const { id } = router.query; // Get the student ID from the route
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState();
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch the student's current data
  useEffect(() => {
    if (id) {
      fetch(`https://pomkara-high-school-server.vercel.app/students/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setStudent(data);
          setCurrentRole(data.class_role)
          setValue("name", data.name);
          setValue("password", data.password)
          setValue("number", data.number);
          setValue("fathers_name", data.fathers_name);
          setValue("mothers_name", data.mothers_name);
          setValue("fathers_number", data.fathers_number);
          setValue("mothers_number", data.mothers_number);
          setValue("class", data.class);
          setValue("class_role", data.class_role);
        })
        .catch((error) => console.error("Error fetching student data:", error));
    }
  }, [id, setValue]);

  const onSubmit = (updatedStudent) => {
    setLoading(true);
    // Send the updated data to your backend using PATCH
    fetch(`https://pomkara-high-school-server.vercel.app/students/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({updatedStudent, currentRole}),
    })
      .then(async (response) => {
        if (response.ok) {
          setLoading(false);
          alert("Student updated successfully!");
        //   router.push("/components/Dashboard/dComponents/student");
        } else {
            const errorData = await response.json(); // Parse the JSON response
            alert(errorData.message || "Failed to update student."); // Show the error message from the backend
            setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error updating student:", error);
      });
  };

  if (!["teacher", "principle", "faculty"].includes(user?.role) || user?.isApprove == false) {
    return <div  className="text-center mt-4 text-2xl text-red-500 font-serif">Please login first to see this section</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Update Student Information</h2>
      {student ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block ">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="input input-bordered bg-white text-black w-full"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block ">Password</label>
            <input
              type="text"
              {...register("password", { required: "Password is required" })}
              className="input input-bordered bg-white text-black w-full"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block ">Number</label>
            <input
              type="text"
              {...register("number", {
                required: "Number is required",
                pattern: {
                  value: /^01[0-9]{9}$/,
                  message:
                    "Number must start with 01 and be exactly 11 digits long",
                },
              })}
              className="input input-bordered bg-white text-black w-full"
            />
            {errors.number && (
              <p className="text-red-500">{errors.number.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block ">Fathers Name</label>
            <input
              type="text"
              {...register("fathers_name", {
                required: "Father's name is required",
              })}
              className="input input-bordered bg-white text-black w-full"
            />
            {errors.fathers_name && (
              <p className="text-red-500">{errors.fathers_name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block ">Mothers Name</label>
            <input
              type="text"
              {...register("mothers_name", {
                required: "Mother's name is required",
              })}
              className="input input-bordered bg-white text-black w-full"
            />
            {errors.mothers_name && (
              <p className="text-red-500">{errors.mothers_name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block ">Fathers Number</label>
            <input
              type="text"
              {...register("fathers_number", {
                required: "Father's number is required",
                pattern: {
                  value: /^01[0-9]{9}$/,
                  message:
                    "Father's number must start with 01 and be exactly 11 digits long",
                },
              })}
              className="input input-bordered bg-white text-black w-full"
            />
            {errors.fathers_number && (
              <p className="text-red-500">{errors.fathers_number.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block ">Mothers Number</label>
            <input
              type="text"
              {...register("mothers_number", {
                required: "Mother's number is required",
                pattern: {
                  value: /^01[0-9]{9}$/,
                  message:
                    "Mother's number must start with 01 and be exactly 11 digits long",
                },
              })}
              className="input input-bordered bg-white text-black w-full"
            />
            {errors.mothers_number && (
              <p className="text-red-500">{errors.mothers_number.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block ">Class</label>
            <input
              type="number"
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
              })}
              className="input input-bordered bg-white text-black w-full"
            />
            {errors.class && (
              <p className="text-red-500">{errors.class.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block ">Class Role</label>
            <input
              type="text"
              {...register("class_role", {
                required: "Class role is required",
              })}
              className="input input-bordered bg-white text-black w-full"
            />
            {errors.class_role && (
              <p className="text-red-500">{errors.class_role.message}</p>
            )}
          </div>
          <button type="submit" className="btn btn-success text-white w-full">
            {loading ? "Updating data...." : "Update"}
          </button>
        </form>
      ) : (
        <p>Loading student data...</p>
      )}
    </div>
  );
};

export default UpdateStudent;

UpdateStudent.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
