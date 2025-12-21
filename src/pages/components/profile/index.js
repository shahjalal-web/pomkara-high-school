/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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

      {/* Results */}
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Results Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <h3 className="text-center text-xl font-bold text-red-500 p-4">
            All Results
          </h3>
          <table className="table w-full">
            <thead className="bg-green-500 text-white">
              <tr>
                <th>Exam</th>
                <th>Subject</th>
                <th>Result</th>
                <th>Date</th>
                <th>Added By</th>
              </tr>
            </thead>
            <tbody>
              {student.result
                ?.slice()
                .reverse()
                .map((r, i) => (
                  <tr key={i}>
                    <td>{r.examType}</td>
                    <td>{r.subject}</td>
                    <td>{r.result} / {r.mark}</td>
                    <td>{new Date(r.date).toLocaleDateString()}</td>
                    <td>{r.addedBy?.name}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Due Payments */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <h3 className="text-center text-xl font-bold text-yellow-500 p-4">
            Due Payments
          </h3>
          <table className="table w-full">
            <thead className="bg-yellow-400 text-white">
              <tr>
                <th>Amount</th>
                <th>For</th>
                <th>Added By</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reversedDuePayments
                .filter((p) => !p.isPaid)
                .map((p, i) => (
                  <tr key={i}>
                    <td>{p.amount}</td>
                    <td>{p.amountType}</td>
                    <td>{p.addedBy?.name}</td>
                    <td>{new Date(p.date).toLocaleDateString()}</td>
                    <td className="text-yellow-500 font-bold">Due</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Paid Payments */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <h3 className="text-center text-xl font-bold text-green-500 p-4">
            Paid Payments
          </h3>
          <table className="table w-full">
            <thead className="bg-green-500 text-white">
              <tr>
                <th>Date</th>
                <th>For</th>
                <th>Amount</th>
                <th>Accepted By</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reversedPaidPayments
                .filter((p) => p.isPaid)
                .map((p, i) => (
                  <tr key={i}>
                    <td>{new Date(p.date).toLocaleDateString()}</td>
                    <td>{p.amountType}</td>
                    <td>{p.amount}</td>
                    <td>{p.addedBy?.name}</td>
                    <td className="text-green-500 font-bold">Paid</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
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
                    className="input input-bordered w-full pr-12"
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
