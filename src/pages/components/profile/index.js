/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ResultSection from "../Dashboard/dComponents/student/result";
import DuePaymentsSection from "../Dashboard/dComponents/student/duePayment";
import PaidPaymentsSection from "../Dashboard/dComponents/student/paidPayment";
import AttendanceSummary from "../AttendanceSummary";

const Profile = () => {
  const [student, setStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setStudent(JSON.parse(localStorage.getItem("student")));
    }
  }, []);

  const id = student?._id;

  useEffect(() => {
    if (id) {
      fetch(`https://pomkara-high-school-server.vercel.app/students/${id}`)
        .then((res) => res.json())
        .then((data) => setStudent(data))
        .catch(() => {});
    }
  }, [id]);

  const reversedDuePayments = student?.due_payment?.slice().reverse() || [];
  const reversedPaidPayments = student?.paid_payment?.slice().reverse() || [];

  const totalDue =
    student?.due_payment?.reduce((a, p) => a + Number(p.amount), 0) || 0;
  const totalPaid =
    student?.paid_payment?.reduce((a, p) => a + Number(p.amount), 0) || 0;

  const totalAmount = totalDue - totalPaid;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://pomkara-high-school-server.vercel.app/students/changePassword/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
          }),
        }
      );

      if (!res.ok) throw new Error();

      alert("Password changed successfully");
      reset();
      setShowModal(false);
      router.reload();
    } catch {
      alert("Error changing password");
    } finally {
      setLoading(false);
    }
  };

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <p className="text-red-500 text-xl mb-4">
            You are not logged in
          </p>
          <Link href="/" className="btn bg-blue-500 text-white mr-2">
            Home
          </Link>
          <Link
            href="/components/studentLogin"
            className="btn bg-green-500 text-white"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 space-y-10">
      {/* Profile Card */}
      <div className="max-w-lg mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl shadow-xl p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">{student.name}</h2>
        <p className="text-sm mb-4 opacity-80">Class {student.class}</p>
        <button
          onClick={() => setShowModal(true)}
          className="btn bg-red-500 hover:bg-red-600 text-white"
        >
          Change Password
        </button>
      </div>

      {/* Student Info */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-center mb-4">
          Student Information
        </h3>
        <table className="table w-full">
          <tbody>
            {[
              ["Class", student.class],
              ["Class Roll", student.class_role],
              ["Number", student.number],
              ["Father's Name", student.fathers_name],
              ["Father's Number", student.fathers_number],
              ["Mother's Name", student.mothers_name],
              ["Mother's Number", student.mothers_number],
              [
                "Admission Date",
                new Date(student.createdAt).toLocaleDateString(),
              ],
              ["Creator", student.creator?.name],
              [
                "Total Due",
                <span className="text-red-500 font-bold">
                  {totalAmount} Taka
                </span>,
              ],
            ].map(([label, value]) => (
              <tr key={label}>
                <td className="font-semibold">{label}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Results Table */}
        <ResultSection results={student?.result || []} />

        {/* Due Payments */}
        <DuePaymentsSection payments={reversedDuePayments} />

        {/* Paid Payments */}
        <PaidPaymentsSection payments={reversedPaidPayments} />

        <AttendanceSummary attendance={student?.attendance || []} />

      </div>

      {/* Change Password Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Change Password</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {["oldPassword", "newPassword"].map((field) => (
                <div className="relative" key={field}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      field === "oldPassword"
                        ? "Old Password"
                        : "New Password"
                    }
                    {...register(field)}
                    required
                    className="input input-bordered w-full pr-12 bg-white text-black"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              ))}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn bg-gray-400 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-blue-500 text-white"
                >
                  {loading ? "Changing..." : "Change"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
