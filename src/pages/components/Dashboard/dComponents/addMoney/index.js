/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "../../DashboardLayout";

const AddMoney = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    }
  }, []);

  const onSubmit = async (data) => {
    setLoading(true)
    // Ensure user data is available
    if (!user?.name || !user?.email) {
      alert("User information is missing. Please log in.");
      setLoading(false)
      return;
    }

    // Flatten the structure
    const finalData = {
      ...data, // Spread form data directly
      amount: Number(data.amount),
      addedBy: { name: user?.name, email: user?.email }, // Add user details
    };

    try {
      const response = await fetch("https://pomkara-high-school-server.vercel.app/add-money", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData), // Send the flattened finalData
      });

      if (response.ok) {
        setLoading(false)
        alert("Payment added successfully!");
        reset(); // Reset the form after successful submission
      } else {
        alert("Failed to add payment");
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error("Error adding payment:", error);
      alert("An error occurred while adding payment.");
    }
  };

  if (!["teacher", "principle",].includes(user?.role) || user?.isApprove == false) {
    return <div  className="text-center mt-4 text-2xl text-red-500 font-serif">Please login first to see this section</div>;
  }

  return (
    <div className="p-5 md:w-1/3 w-full mx-auto">
      <h2 className="text-xl mb-5">Add Money to All Students of a Class</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="class" className="block mb-2">
            Select Class
          </label>
          <select
            id="class"
            {...register("class", { required: true })}
            className="border border-gray-300 p-2 w-full"
          >
            <option value="" disabled selected>
              Select Class
            </option>
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
            <option value="exam batch">Exam Batch</option>
          </select>
          {errors.class && (
            <span className="text-red-500">Class is required</span>
          )}
        </div>

        <div>
          <label htmlFor="reason" className="block mb-2">
            Select Reason
          </label>
          <select
            id="reason"
            {...register("reason", { required: true })}
            className="border border-gray-300 p-2 w-full"
          >
            <option value="" disabled selected>
              Select Reason
            </option>
            <option value="Admission Fee">Admission Fee</option>
            <option value="Exam Fee">Exam Fee</option>
            <option value="Monthly Fee">Monthly Fee</option>
            <option value="Session fee">Session fee</option>
            <option value="Scout fee">Scout fee</option>
            <option value="Sports Fee">Sports Fee</option>
            <option value="Other">Other</option>
          </select>
          {errors.reason && (
            <span className="text-red-500">Reason is required</span>
          )}
        </div>

        <div>
          <label htmlFor="amount" className="block mb-2">
            Enter Amount
          </label>
          <input
            type="number"
            id="amount"
            {...register("amount", { required: true, valueAsNumber: true })}
            className="border bg-white text-black border-gray-300 p-2 w-full"
          />
          {errors.amount && (
            <span className="text-red-500">
              Amount is required and should be a number
            </span>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 w-full text-white p-2 rounded hover:bg-blue-600"
        >
         {loading? "Money Addeding....": " Add Money"}
        </button>
      </form>
    </div>
  );
};

export default AddMoney;


AddMoney.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};